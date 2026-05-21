import { type Command, parseSVG } from 'svg-path-parser';

import {
  transformBlend,
  transformEffects,
  transformLayoutAttributes,
  transformProportion,
  transformSceneNode,
  transformStrokesFromVector,
  transformVectorFills,
  transformVectorIds
} from '@plugin/transformers/partials';
import { translateCommands, translateWindingRule } from '@plugin/translators/vectors';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

// Cache parsed SVG commands to avoid re-parsing same path data
const parsedCache = new Map<string, Command[]>();
const failedParsedPaths = new Set<string>();

const getParsedCommands = (pathData: string): Command[] | undefined => {
  if (failedParsedPaths.has(pathData)) {
    return;
  }

  let commands = parsedCache.get(pathData);

  if (!commands) {
    try {
      commands = parseSVG(pathData);
    } catch {
      failedParsedPaths.add(pathData);
      return;
    }

    parsedCache.set(pathData, commands);
  }

  return commands;
};

/**
 * Clears the parsed SVG cache to prevent memory accumulation during exports.
 * Should be called at the start of each export to ensure clean state.
 */
export const clearParsedCache = (): void => {
  parsedCache.clear();
  failedParsedPaths.clear();
};

export const transformVectorPaths = (node: VectorNode): PathShape[] => {
  let regions: readonly VectorRegion[] = [];

  try {
    regions = node.vectorNetwork?.regions ?? [];
  } catch (error) {
    console.warn('Could not access the vector network', node.name, error);
  }

  let vectorPaths: readonly VectorPath[] = [];

  try {
    vectorPaths = node.vectorPaths ?? [];
  } catch (error) {
    console.warn('Could not access vector paths', node.name, error);
  }

  const hasStrokes = node.strokes.length > 0;
  const fillGeometry = node.fillGeometry ?? [];
  const validFillGeometry = fillGeometry.filter(
    geometry => getParsedCommands(geometry.data) !== undefined
  );
  const hasGeometry = validFillGeometry.length > 0;
  let count = 0;

  // Cache for vertex extraction to avoid re-parsing same path data
  const vertexCache = new Map<string, Set<string>>();
  const getVertices = (pathData: string): Set<string> => {
    let vertices = vertexCache.get(pathData);
    if (!vertices) {
      vertices = extractVertices(pathData);
      vertexCache.set(pathData, vertices);
    }
    return vertices;
  };

  // Compute combined vertices of all fillGeometry entries once
  // (vectorPaths may contain multiple subpaths in one entry, while fillGeometry has them separate)
  const combinedFillGeometryVertices = hasGeometry
    ? getCombinedVerticesCached(
        validFillGeometry.map(geo => geo.data),
        getVertices
      )
    : new Set<string>();
  const combinedFillGeometryHash = hashVertexSet(combinedFillGeometryVertices);

  // Single pass: filter vectorPaths and collect both pathShapes and included path data
  // Use hash-based deduplication for O(1) lookup instead of O(n²) set comparisons
  const includedVectorPathsData: string[] = [];
  const pathShapes: PathShape[] = [];
  const seenVertexHashes = new Set<string>();

  for (let i = 0; i < vectorPaths.length; i++) {
    const vectorPath = vectorPaths[i];

    if (getParsedCommands(vectorPath.data) === undefined) {
      continue;
    }

    let shouldInclude = false;
    let currentHash: string | undefined;

    // Include if there are strokes but NO fillGeometry (stroke-only vector)
    if (hasStrokes && !hasGeometry) {
      shouldInclude = true;
    }
    // Include if there are no strokes and no geometry (edge case)
    else if (!hasStrokes && !hasGeometry) {
      shouldInclude = true;
    }
    // Include if this path has fills (windingRule !== 'NONE')
    else if (nodeHasFills(node, vectorPath, regions[i])) {
      shouldInclude = true;
    }
    // For windingRule 'NONE' paths when hasStrokes && hasGeometry:
    // Only EXCLUDE if this vectorPath visits the SAME vertices as the COMBINED fillGeometry
    else if (hasStrokes && hasGeometry && vectorPath.windingRule === 'NONE') {
      currentHash = hashVertexSet(getVertices(vectorPath.data));
      shouldInclude = currentHash !== combinedFillGeometryHash;
    }

    if (shouldInclude) {
      // Lazy compute hash only when needed for deduplication
      if (currentHash === undefined) {
        currentHash = hashVertexSet(getVertices(vectorPath.data));
      }
      // Deduplicate: skip if we've already seen a path with identical vertices (O(1) hash lookup)
      if (!seenVertexHashes.has(currentHash)) {
        const pathShape = transformVectorPath(node, vectorPath, regions[i], count);
        if (pathShape) {
          seenVertexHashes.add(currentHash);
          includedVectorPathsData.push(vectorPath.data);
          pathShapes.push(pathShape);
          count++;
        }
      }
    }
  }

  if (regions.length > 0) {
    return pathShapes;
  }

  // Compute combined vertices of included vectorPaths (reusing cached data)
  const combinedIncludedVectorPathVertices = getCombinedVerticesCached(
    includedVectorPathsData,
    getVertices
  );
  const combinedIncludedHash = hashVertexSet(combinedIncludedVectorPathVertices);

  // Include fillGeometry only if combined fillGeometry vertices differ from combined included vectorPath vertices
  // This handles cases where vectorPaths has multiple subpaths and fillGeometry has them as separate entries
  const shouldIncludeFillGeometry =
    includedVectorPathsData.length === 0 || combinedFillGeometryHash !== combinedIncludedHash;

  const geometryShapes: PathShape[] = [];
  if (shouldIncludeFillGeometry) {
    for (const geometry of validFillGeometry) {
      const geometryShape = transformVectorPath(node, geometry, undefined, count);
      if (geometryShape) {
        geometryShapes.push(geometryShape);
        count++;
      }
    }
  }

  return [...geometryShapes, ...pathShapes];
};

/**
 * Extracts all vertices from a path as a normalized set of "x,y" strings.
 * This allows comparing paths by their vertices, regardless of path structure
 * (e.g., multiple subpaths vs one continuous path).
 */
const extractVertices = (pathData: string): Set<string> => {
  const vertices = new Set<string>();
  const commands = getParsedCommands(pathData);

  if (!commands) {
    return vertices;
  }

  for (const cmd of commands) {
    if ('x' in cmd && 'y' in cmd && typeof cmd.x === 'number' && typeof cmd.y === 'number') {
      // Round to 1 decimal for tolerance
      const vertex = `${cmd.x.toFixed(1)},${cmd.y.toFixed(1)}`;
      vertices.add(vertex);
    }
  }

  return vertices;
};

/**
 * Combines vertices from multiple path data strings into a single set.
 * Uses a cache function to avoid re-parsing same paths.
 */
const getCombinedVerticesCached = (
  pathDataList: string[],
  getVertices: (pathData: string) => Set<string>
): Set<string> => {
  const combined = new Set<string>();
  for (const pathData of pathDataList) {
    for (const vertex of getVertices(pathData)) {
      combined.add(vertex);
    }
  }
  return combined;
};

/**
 * Creates a hash string from a vertex set for O(1) equality comparison.
 * Sorts vertices to ensure consistent hash regardless of insertion order.
 */
const hashVertexSet = (vertices: Set<string>): string => {
  return Array.from(vertices).sort().join('|');
};

const nodeHasFills = (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined
): boolean => {
  return !!(vectorPath.windingRule !== 'NONE' && (vectorRegion?.fills || node.fills));
};

const transformVectorPath = (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined,
  index: number
): PathShape | undefined => {
  const normalizedPaths = getParsedCommands(vectorPath.data);
  if (!normalizedPaths || normalizedPaths.length === 0) {
    return;
  }

  const content = translateCommands(node, normalizedPaths);

  return {
    type: 'path',
    name: 'svg-path',
    content,
    svgAttrs: {
      fillRule: translateWindingRule(vectorPath.windingRule)
    },
    constraintsH: 'scale',
    constraintsV: 'scale',
    ...transformVectorIds(node, index),
    ...transformVectorFills(node, vectorPath, vectorRegion),
    ...transformStrokesFromVector(node, normalizedPaths, vectorRegion),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node)
  };
};
