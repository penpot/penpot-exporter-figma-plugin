# penpot-exporter

## 0.20.1

### Patch Changes

- [#361](https://github.com/penpot/penpot-exporter-figma-plugin/pull/361)
  [`95b8047`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/95b8047414a319d756ab762fb4b1674f594a3ae3)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Reset `isSharedLibrary` flag between
  exports to prevent a file without published components from being incorrectly

## 0.20.0

### Minor Changes

- [#352](https://github.com/penpot/penpot-exporter-figma-plugin/pull/352)
  [`43cde4c`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/43cde4c52ff03e73ca9a361ad843c2b9b01128ad)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Replace how images are being converted
  using a modern format (webp)

### Patch Changes

- [#355](https://github.com/penpot/penpot-exporter-figma-plugin/pull/355)
  [`12e9595`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/12e95951446761a4aba7b9b55b09cf1a144ab28e)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Handle text segments with undefined
  properties (fontName, fontSize, letterSpacing, lineHeight) to prevent crashes during export.

- [#358](https://github.com/penpot/penpot-exporter-figma-plugin/pull/358)
  [`68908bf`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/68908bf3f65f74a3d4e9cc2848bb61da44cbcdb8)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Update google fonts list

- [#360](https://github.com/penpot/penpot-exporter-figma-plugin/pull/360)
  [`eb12cbf`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/eb12cbf88c41c58d68cbca4642acde169a365019)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Fix crash on some files after updating
  how we handle undefined properties on texts nodes

- [#356](https://github.com/penpot/penpot-exporter-figma-plugin/pull/356)
  [`5ea862a`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5ea862a92f70b28ecd259d33e16aa1a849462005)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Replaces O(n) linear searches with O(1)
  Map lookups for font family resolution. Pre-builds Maps at module load instead of searching
  through 1,832+ fonts per text segment.

- [#354](https://github.com/penpot/penpot-exporter-figma-plugin/pull/354)
  [`9d17b2f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/9d17b2fb9a94b9515765bf1940daaeed6808afc2)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Handle vectorPath getter throwing Figma
  internal error

## 0.19.4

### Patch Changes

- [#350](https://github.com/penpot/penpot-exporter-figma-plugin/pull/350)
  [`df15f8a`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/df15f8a72a632b2ba1df79f933d3de64641c5cec)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix error for malformed SVG

## 0.19.3

### Patch Changes

- [#348](https://github.com/penpot/penpot-exporter-figma-plugin/pull/348)
  [`f92e7d4`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/f92e7d470f4edc0483b0f2f6be62877b2fb5ea79)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Add warning on large files

- [#340](https://github.com/penpot/penpot-exporter-figma-plugin/pull/340)
  [`e9ddcea`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ddcea20463ecdcedab63cf0de208030c54df1f)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Cleaning tracking objects to free up
  memory

- [#345](https://github.com/penpot/penpot-exporter-figma-plugin/pull/345)
  [`b3f62a4`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b3f62a451a1d674bcc9a6d2187bdddd84c5725f7)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Fix variable alias resolution for
  external Design System references

## 0.19.2

### Patch Changes

- [#337](https://github.com/penpot/penpot-exporter-figma-plugin/pull/337)
  [`7f12b51`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/7f12b518e0d46331bebd603d76f92dc3ed949b78)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix maximum call stack size exceeded
  error on deeply nested structures by deferring child translation

- [#338](https://github.com/penpot/penpot-exporter-figma-plugin/pull/338)
  [`14cb9ed`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/14cb9ed279efa14be7c17dc2a382c40c1925e016)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix crash when boolean groups contain
  only frames as children (fallback to normal group)

## 0.19.1

### Patch Changes

- [#334](https://github.com/penpot/penpot-exporter-figma-plugin/pull/334)
  [`010352e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/010352e73afcfb46a43fd4e5091cfdfeebbad688)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Fix crash when dealing with some high
  complexity vectors (svg)

## 0.19.0

### Minor Changes

- [#322](https://github.com/penpot/penpot-exporter-figma-plugin/pull/322)
  [`b714087`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b7140878482ce38fabb0869b394e9cd09a9e116d)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Allow to export and link external
  libraries with their files

### Patch Changes

- [#330](https://github.com/penpot/penpot-exporter-figma-plugin/pull/330)
  [`61afc81`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/61afc815ca75be266a6d7446e71f1ada2611728b)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Avoid crash when text list fails to
  inform its list type (ordered or unordered)

## 0.18.1

### Patch Changes

- [#324](https://github.com/penpot/penpot-exporter-figma-plugin/pull/324)
  [`ab9e364`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/ab9e364e669ef64c89be4b72083ae06d1b144b80)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Fix wrong (missing) touched groups for
  styledTextSegments

- [#329](https://github.com/penpot/penpot-exporter-figma-plugin/pull/329)
  [`4c1ec1b`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/4c1ec1bdeadecfd6bea6eb67d0acbb386f3468da)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Fix bug with empty fill on an image

- [#326](https://github.com/penpot/penpot-exporter-figma-plugin/pull/326)
  [`37ec0d6`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/37ec0d6289e930b15d660c62a78208eb6f57de66)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Apply overrides for remote components

## 0.18.0

### Minor Changes

- [#319](https://github.com/penpot/penpot-exporter-figma-plugin/pull/319)
  [`1a88fb6`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/1a88fb6ae6f6f35627beedff457c39781268c2af)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Add export scope option to choose
  between exporting all pages or only the current page.

## 0.17.4

### Patch Changes

- [#318](https://github.com/penpot/penpot-exporter-figma-plugin/pull/318)
  [`610f665`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/610f66502a24ed0a9af60f084b5a16b0c088c3b2)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Update internal dependencies

- [#316](https://github.com/penpot/penpot-exporter-figma-plugin/pull/316)
  [`89fd36e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/89fd36e920f2868e98db2c96785e8cfb0f7b5021)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve svg parsing

## 0.17.3

### Patch Changes

- [#314](https://github.com/penpot/penpot-exporter-figma-plugin/pull/314)
  [`468f5f8`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/468f5f8719e6a8bc73c6ecc78bf62ab73b1e76b5)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix component variants when there are
  missing properties on some variants

- [#315](https://github.com/penpot/penpot-exporter-figma-plugin/pull/315)
  [`3f083b6`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3f083b6809e9682932841c0c03fbd93fdb7127ad)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix vector paths when more than one
  svg-path is needed to represent the Figma vector

- [#307](https://github.com/penpot/penpot-exporter-figma-plugin/pull/307)
  [`9e26ea6`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/9e26ea6225a350d524a2e5ce0ead3dccddf2f552)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve overrides for resized
  components

## 0.17.2

### Patch Changes

- [#311](https://github.com/penpot/penpot-exporter-figma-plugin/pull/311)
  [`b688cec`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b688cecfbe74a6be63b8a0d99106bc1102fffa18)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix to avoid empty boolean groups

## 0.17.1

### Patch Changes

- [#309](https://github.com/penpot/penpot-exporter-figma-plugin/pull/309)
  [`b610ec2`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b610ec2805d33c0255daecca73d7656173d58cfd)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix case where there are no variables
  in the Figma file

## 0.17.0

### Minor Changes

- [#283](https://github.com/penpot/penpot-exporter-figma-plugin/pull/283)
  [`58a1168`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/58a1168bd638c74481e4a18f5b2086ecbd41b0d3)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Implement Design Tokens translation

- [#292](https://github.com/penpot/penpot-exporter-figma-plugin/pull/292)
  [`cd2b55b`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/cd2b55b3d0ee742475a35c5b471385cad5735679)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Implement Grid Layout translation

- [#248](https://github.com/penpot/penpot-exporter-figma-plugin/pull/248)
  [`28af0fd`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/28af0fdb116c9e3d2fa5be664198e2cb4b5b4679)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Implement Grids translation

### Patch Changes

- [#306](https://github.com/penpot/penpot-exporter-figma-plugin/pull/306)
  [`c6113d0`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c6113d074d080c96c1d7736fed61e74edf011eca)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix scenario where paddings are the
  same as width/height and the inner element is moved from its original position

- [#292](https://github.com/penpot/penpot-exporter-figma-plugin/pull/292)
  [`cd2b55b`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/cd2b55b3d0ee742475a35c5b471385cad5735679)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix flex layout for text elements

## 0.16.2

### Patch Changes

- [#303](https://github.com/penpot/penpot-exporter-figma-plugin/pull/303)
  [`bc1c24d`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/bc1c24df43519f7e4c153be5976ad85194408dac)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix multiple shadows on the same
  layer

## 0.16.1

### Patch Changes

- [#301](https://github.com/penpot/penpot-exporter-figma-plugin/pull/301)
  [`c6fb57f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c6fb57f743d8a0033fdfd35882a8114488e478d1)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix variant properties not being
  properly ordered, in Penpot we need to ensure the order is constant among all instances of a
  component

## 0.16.0

### Minor Changes

- [#282](https://github.com/penpot/penpot-exporter-figma-plugin/pull/282)
  [`3db6acd`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3db6acdcd1f3a2a0dd9fda85878c18548d7ee51e)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Show current version on the plugin
  interface

- [#297](https://github.com/penpot/penpot-exporter-figma-plugin/pull/297)
  [`08d6291`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/08d6291e20f2bac9c3f446e1de4df9c24919e33d)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Progress visualization is now clear,
  with a new UI and simplified steps

- [#288](https://github.com/penpot/penpot-exporter-figma-plugin/pull/288)
  [`99a45b9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/99a45b90a12a321c2e1441190d671e62b1ebdb44)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Add a summary after export is
  completed

- [#288](https://github.com/penpot/penpot-exporter-figma-plugin/pull/288)
  [`99a45b9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/99a45b90a12a321c2e1441190d671e62b1ebdb44)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Move missing fonts section to the end
  of the export process, removing the initial loading time of the plugin

- [#296](https://github.com/penpot/penpot-exporter-figma-plugin/pull/296)
  [`489c625`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/489c6251c278bc43cbe43d27785879b77c36a825)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Optimize performance by reducing UI
  overhead during export

- [#294](https://github.com/penpot/penpot-exporter-figma-plugin/pull/294)
  [`0c36d60`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/0c36d6065e43a92dd544a187fd879a1cccfa1a30)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Refactor identifier generation logic
  to improve performance

- [#298](https://github.com/penpot/penpot-exporter-figma-plugin/pull/298)
  [`4500260`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/4500260092183651066814d23a7497494fa6d550)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Add more information to the main
  plugin page

### Patch Changes

- [#291](https://github.com/penpot/penpot-exporter-figma-plugin/pull/291)
  [`d69c757`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/d69c757e8026dd0714b17acea906f4f159df8bd6)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix Flex layout gap translation and
  alignment in certain cases

## 0.15.1

### Patch Changes

- [#287](https://github.com/penpot/penpot-exporter-figma-plugin/pull/287)
  [`7afad53`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/7afad5398292dfddc2020d0fd795fe190edb0e13)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Reverse order of stokes to match
  Figma

- [#284](https://github.com/penpot/penpot-exporter-figma-plugin/pull/284)
  [`5f1e1e7`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5f1e1e782be1c2f998214ea32bef403747b38d40)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Update Google fonts

- [#286](https://github.com/penpot/penpot-exporter-figma-plugin/pull/286)
  [`e06b7ea`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e06b7ea12407ed44931d3f49806b97aa847d6222)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Translate layoutGap to row and column
  at the same time like how it works on Figma

## 0.15.0

### Minor Changes

- [#275](https://github.com/penpot/penpot-exporter-figma-plugin/pull/275)
  [`db22ac4`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/db22ac41ab5991fd4c1ddc45729ce295abf5b120)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Upgrade internal dependencies and
  update Penpot SDK to 1.0.11

- [#278](https://github.com/penpot/penpot-exporter-figma-plugin/pull/278)
  [`3ef7087`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3ef7087b1fd867b0d8b51de95ec758cd3c9aa3e6)
  Thanks [@SpykeRel04D](https://github.com/SpykeRel04D)! - Implement Penpot Variants translation

- [#280](https://github.com/penpot/penpot-exporter-figma-plugin/pull/280)
  [`10fcb29`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/10fcb29904f20f4a8e6af4cee903ca6466af4c9e)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve the performance of the export
  process, especially when exporting large files

### Patch Changes

- [#273](https://github.com/penpot/penpot-exporter-figma-plugin/pull/273)
  [`e8743e3`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e8743e3c2f620b90c37075419b4c3c06b08a30ea)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Disable Sentry in development mode

- [#279](https://github.com/penpot/penpot-exporter-figma-plugin/pull/279)
  [`a5f9204`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/a5f92041cf80934cbf45db2f3c419e6f50312025)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix some cases where an SVG might not
  be correctly rotated

## 0.14.4

### Patch Changes

- [#266](https://github.com/penpot/penpot-exporter-figma-plugin/pull/266)
  [`2916a54`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2916a5400b8785c0b88cd834f19b7e3abf3ec259)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Added referer and fixed translate
  stroke

## 0.14.3

### Patch Changes

- [#263](https://github.com/penpot/penpot-exporter-figma-plugin/pull/263)
  [`dc64e91`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/dc64e91dd7f444ddeb47cdf052aa1058162f28da)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Update internal dependencies

## 0.14.2

### Patch Changes

- [#260](https://github.com/penpot/penpot-exporter-figma-plugin/pull/260)
  [`fa586c0`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/fa586c0df7a8b0167a25e3e4d1e2357db3f3c1fb)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix using Google fonts with variants
  that are not present on Penpot

## 0.14.1

### Patch Changes

- [#257](https://github.com/penpot/penpot-exporter-figma-plugin/pull/257)
  [`fcdfefb`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/fcdfefbcf09f0ea21dfa7eb78e0cd7106e9a7d6b)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix color libraries with image fills

- [#257](https://github.com/penpot/penpot-exporter-figma-plugin/pull/257)
  [`fcdfefb`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/fcdfefbcf09f0ea21dfa7eb78e0cd7106e9a7d6b)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix stroke fills with gradients

## 0.14.0

### Minor Changes

- [#254](https://github.com/penpot/penpot-exporter-figma-plugin/pull/254)
  [`5c13fe9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5c13fe962bbbfdb2007b20c80d06c512e2e58ad1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Upgrade to work with latest Penpot 2.7

- [#254](https://github.com/penpot/penpot-exporter-figma-plugin/pull/254)
  [`5c13fe9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5c13fe962bbbfdb2007b20c80d06c512e2e58ad1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Increase export speed and stability on most
  scenarios

- [#254](https://github.com/penpot/penpot-exporter-figma-plugin/pull/254)
  [`5c13fe9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5c13fe962bbbfdb2007b20c80d06c512e2e58ad1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Improve parsing of SVGs paths from Figma

- [#254](https://github.com/penpot/penpot-exporter-figma-plugin/pull/254)
  [`5c13fe9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5c13fe962bbbfdb2007b20c80d06c512e2e58ad1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Change export format to the new .penpot file
  format

- [#254](https://github.com/penpot/penpot-exporter-figma-plugin/pull/254)
  [`5c13fe9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5c13fe962bbbfdb2007b20c80d06c512e2e58ad1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Reduce export file size for Figma files with
  lots of images

- [#254](https://github.com/penpot/penpot-exporter-figma-plugin/pull/254)
  [`5c13fe9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5c13fe962bbbfdb2007b20c80d06c512e2e58ad1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Add progress bar for the final file generation

## 0.13.1

### Patch Changes

- [#246](https://github.com/penpot/penpot-exporter-figma-plugin/pull/246)
  [`05ec8ea`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/05ec8ea2bc6f381a670beb84f16fb18713ef42f1)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fixes undefined fontnames while fetching fonts

## 0.13.0

### Minor Changes

- [#243](https://github.com/penpot/penpot-exporter-figma-plugin/pull/243)
  [`b44cbf2`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b44cbf2052e18d5d8a77447af48a77e2c3f54b9a)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Remove custom font form since penpot now
  matches the fonts by fontName and fontFamily

### Patch Changes

- [#239](https://github.com/penpot/penpot-exporter-figma-plugin/pull/239)
  [`570aeee`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/570aeee7b0a5298ca7ed4e99aaaf216ecd621cc8)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Minor updates

## 0.12.1

### Patch Changes

- [#236](https://github.com/penpot/penpot-exporter-figma-plugin/pull/236)
  [`3da80b4`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3da80b4c266cf21e3123f8bf8a80bf2318c48c38)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fixed transformed shapes when flipped
  horizontally/vertically

## 0.12.0

### Minor Changes

- [#228](https://github.com/penpot/penpot-exporter-figma-plugin/pull/228)
  [`a079f16`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/a079f168df4f0d3cbd15ea58097f6763380d72a4)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added basic analytics and error tracking using
  MixPanel and Sentry

## 0.11.0

### Minor Changes

- [#229](https://github.com/penpot/penpot-exporter-figma-plugin/pull/229)
  [`f77bc46`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/f77bc463acdb9c12ca45f0ac7e908761eef454e9)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Basic Error Management

## 0.10.2

### Patch Changes

- [#225](https://github.com/penpot/penpot-exporter-figma-plugin/pull/225)
  [`2d0b63d`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2d0b63d5cd0579d1c2aef0694ed6624edc288fb2)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix vector network error on invalid
  access to the property

## 0.10.1

### Patch Changes

- [#221](https://github.com/penpot/penpot-exporter-figma-plugin/pull/221)
  [`638817a`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/638817a1d6f5b4a21b266d73d797b677ce2ebac7)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Figma typings update

- [#220](https://github.com/penpot/penpot-exporter-figma-plugin/pull/220)
  [`c95d442`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c95d442e74b2e59ab8873dab808f9f95cdfb4021)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fixed issue where big vectors are making the
  plugin crash

## 0.10.0

### Minor Changes

- [#213](https://github.com/penpot/penpot-exporter-figma-plugin/pull/213)
  [`58d9901`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/58d9901a7a9a70f6efe7beb3efc22dfac1688963)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Minor npm updates

## 0.9.2

### Patch Changes

- [#207](https://github.com/penpot/penpot-exporter-figma-plugin/pull/207)
  [`e5c2886`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e5c2886a87d96ca3642d23111d17eb30bd73bc2e)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Rollback to previous version of penpot lib

## 0.9.1

### Patch Changes

- [#204](https://github.com/penpot/penpot-exporter-figma-plugin/pull/204)
  [`07d7b49`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/07d7b495ec7c6dbdcb8464f055952b2fd2c020db)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Update penpot lib

## 0.9.0

### Minor Changes

- [#197](https://github.com/penpot/penpot-exporter-figma-plugin/pull/197)
  [`c5dd5d0`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c5dd5d011e165bf00f3c01f76de4a797618c7fcb)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Rework remote components

- [#200](https://github.com/penpot/penpot-exporter-figma-plugin/pull/200)
  [`303cc83`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/303cc833a002f709e70e533cb641b720dad0ffd9)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Improvements in overrides management

### Patch Changes

- [#201](https://github.com/penpot/penpot-exporter-figma-plugin/pull/201)
  [`bd36496`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/bd36496023bb6afead8180c77284fb4ee3df1f63)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Improve registering component properties

## 0.8.1

### Patch Changes

- [#194](https://github.com/penpot/penpot-exporter-figma-plugin/pull/194)
  [`53672d8`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/53672d8b43111efa1dedc5deac358410943c2bc5)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix local styles categorization
  system

## 0.8.0

### Minor Changes

- [#185](https://github.com/penpot/penpot-exporter-figma-plugin/pull/185)
  [`d3c144e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/d3c144e5e99777bc54635ad3f0067c6927041a90)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Add support for typographies

- [#183](https://github.com/penpot/penpot-exporter-figma-plugin/pull/183)
  [`a58f9e9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/a58f9e913de800047207dc86e4df01e3e3b3f235)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Support for color libraries

### Patch Changes

- [#190](https://github.com/penpot/penpot-exporter-figma-plugin/pull/190)
  [`511b842`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/511b842b129a9c97c917f5991acfbf1927494b7d)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Add additional layout properties

- [#185](https://github.com/penpot/penpot-exporter-figma-plugin/pull/185)
  [`d3c144e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/d3c144e5e99777bc54635ad3f0067c6927041a90)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Improve font weight translation

- [#185](https://github.com/penpot/penpot-exporter-figma-plugin/pull/185)
  [`d3c144e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/d3c144e5e99777bc54635ad3f0067c6927041a90)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix letter spacing

- [#191](https://github.com/penpot/penpot-exporter-figma-plugin/pull/191)
  [`b003704`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b00370410c0b50f4a177dc1a53c87bdad964d368)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve paragraph indent using letter
  spacing

## 0.7.1

### Patch Changes

- [#181](https://github.com/penpot/penpot-exporter-figma-plugin/pull/181)
  [`bc33c0e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/bc33c0ed9c3000d65ec1a18ec09e052b19bbb356)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix scrollbar showing up randomly

## 0.7.0

### Minor Changes

- [#166](https://github.com/penpot/penpot-exporter-figma-plugin/pull/166)
  [`4591369`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/4591369e3cf5c9522d904c97db71178c8b71cc0c)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for instances overrides

- [#180](https://github.com/penpot/penpot-exporter-figma-plugin/pull/180)
  [`6725676`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/672567614bb69f68ffe32aec3dddaa8ef3866e5b)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Use Fill Styles to optimize fills
  transformations

- [#163](https://github.com/penpot/penpot-exporter-figma-plugin/pull/163)
  [`e5f2943`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e5f294353233aba5cb9cceca78dec36143b3490f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Implement rotation for the missing
  figures

- [#160](https://github.com/penpot/penpot-exporter-figma-plugin/pull/160)
  [`af81fc7`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/af81fc7e929ecd0efa97d8d36a718695c536cec0)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Apply rotations to lines

- [#151](https://github.com/penpot/penpot-exporter-figma-plugin/pull/151)
  [`b85a4f7`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/b85a4f72791f6739702cd2989b40b15de964a494)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for autolayout

- [#172](https://github.com/penpot/penpot-exporter-figma-plugin/pull/172)
  [`8697902`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/8697902e086174170eeeb24a075a783eeb308ccc)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Track better the progress on file
  creation

- [#167](https://github.com/penpot/penpot-exporter-figma-plugin/pull/167)
  [`14c9d02`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/14c9d02cc928aef64b9068ff7d0e2b87b231edb7)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Register Text Variables as Instance override

- [#168](https://github.com/penpot/penpot-exporter-figma-plugin/pull/168)
  [`202e7f4`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/202e7f4fda62980094e447a7763864ab2c48624d)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Implement rotation for any arbitrary
  figure

### Patch Changes

- [#164](https://github.com/penpot/penpot-exporter-figma-plugin/pull/164)
  [`2f11c5f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2f11c5f0907d09a739b7779a9e52583fe75f4d6f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix svg translation of fill rules

- [#174](https://github.com/penpot/penpot-exporter-figma-plugin/pull/174)
  [`beb3caa`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/beb3caa5e0f28c0cc6a386226f2f3467c59700de)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix Hug in Frames

- [#154](https://github.com/penpot/penpot-exporter-figma-plugin/pull/154)
  [`342ab90`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/342ab90e69885482e7332fec5b28299226f1b54d)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Translate line endings done with
  shift+Enter in Figma

- [#170](https://github.com/penpot/penpot-exporter-figma-plugin/pull/170)
  [`ebad146`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/ebad146d7f01640a6ab086b6c453b1da4fb1eaa5)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix fonts detection traversal on the
  whole document

- [#164](https://github.com/penpot/penpot-exporter-figma-plugin/pull/164)
  [`2f11c5f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2f11c5f0907d09a739b7779a9e52583fe75f4d6f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix frames opacity translation

- [#156](https://github.com/penpot/penpot-exporter-figma-plugin/pull/156)
  [`6fc812a`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/6fc812a08fb73cc97d43b1e2ab6b99ad311d5443)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Do not apply indentation to texts
  with indent zero

- [#175](https://github.com/penpot/penpot-exporter-figma-plugin/pull/175)
  [`33d2502`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/33d250218cb9e68f7aa7afd854bf73c3d85a7ead)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve detection of changed fonts

## 0.6.1

### Patch Changes

- [#152](https://github.com/penpot/penpot-exporter-figma-plugin/pull/152)
  [`559a758`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/559a758d2176e6343c42f0b6727c91f3614c76de)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix node visibility and opacity

## 0.6.0

### Minor Changes

- [#147](https://github.com/penpot/penpot-exporter-figma-plugin/pull/147)
  [`e2d7a31`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e2d7a3131275246b7ed2fa3d95a4494e84245eb8)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Release on a new home, thanks to
  @micahchoo

## 0.5.0

### Minor Changes

- [#106](https://github.com/penpot/penpot-exporter-figma-plugin/pull/106)
  [`32aafbc`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/32aafbcf9dd263fcdccc5a875249d487b0567209)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Implement root component translation

- [#140](https://github.com/penpot/penpot-exporter-figma-plugin/pull/140)
  [`be5ff3b`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/be5ff3be8e64109ab7b28428b668040e820b9da0)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Remote components processing

- [#122](https://github.com/penpot/penpot-exporter-figma-plugin/pull/122)
  [`5d7263b`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/5d7263bdbf1d73ec8bd836c05cad5cc7d96fa1f9)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Translate rotations for ellipses and
  rectangles

- [#141](https://github.com/penpot/penpot-exporter-figma-plugin/pull/141)
  [`3094f05`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3094f05e98e5fd3b3d141d7cc957e6755073b897)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Optimize images before generating zip
  file

- [#126](https://github.com/penpot/penpot-exporter-figma-plugin/pull/126)
  [`88b3e5f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/88b3e5f69c9d8e7513a2dd76626c99a5e74b17c3)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Add progress bar during the export

- [#142](https://github.com/penpot/penpot-exporter-figma-plugin/pull/142)
  [`02fa336`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/02fa3363f55d406f40df71a23ee62f8f08d07633)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Constraints translation

- [#128](https://github.com/penpot/penpot-exporter-figma-plugin/pull/128)
  [`f8e6b6e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/f8e6b6ecd9ca3216ab977ee4bbc37c64fc9db249)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Component set

- [#124](https://github.com/penpot/penpot-exporter-figma-plugin/pull/124)
  [`7b31929`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/7b3192936e1902409d7f7723189e4eed3d820b97)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Implement component instances translation

- [#126](https://github.com/penpot/penpot-exporter-figma-plugin/pull/126)
  [`88b3e5f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/88b3e5f69c9d8e7513a2dd76626c99a5e74b17c3)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve performance so the interface
  of figma feels more responsive during the export process

- [#136](https://github.com/penpot/penpot-exporter-figma-plugin/pull/136)
  [`7895daa`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/7895daaea8d33071b813e8bbd81c837a683f3264)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Add loader when generating really
  large files after the page processing loader

### Patch Changes

- [#129](https://github.com/penpot/penpot-exporter-figma-plugin/pull/129)
  [`92167ac`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/92167aca42a20c42c2344c2c0c3a7affe9f8c940)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix masks not working in components

- [#135](https://github.com/penpot/penpot-exporter-figma-plugin/pull/135)
  [`8a86304`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/8a86304fead857456606e900f79f2259052dfae7)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Improve image processing speed

- [#133](https://github.com/penpot/penpot-exporter-figma-plugin/pull/133)
  [`f726dc9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/f726dc9cec05daf433750c2056d7303a341bb925)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Optimize image exporting when there
  are multiple copies of the same image in the file

## 0.4.1

### Patch Changes

- [#120](https://github.com/penpot/penpot-exporter-figma-plugin/pull/120)
  [`044b092`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/044b09207b48aa3b2ac8dcb86f6c6d04db88b645)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix text layers without text content

- [#118](https://github.com/penpot/penpot-exporter-figma-plugin/pull/118)
  [`35d9d47`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/35d9d47e2afb0fa3db09a51803de5549230ba2c4)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix frames fills and blendModes

## 0.4.0

### Minor Changes

- [#115](https://github.com/penpot/penpot-exporter-figma-plugin/pull/115)
  [`36afc6d`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/36afc6da5578c826c2d25eb313a96a502fa53a3a)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for boolean groups

- [#114](https://github.com/penpot/penpot-exporter-figma-plugin/pull/114)
  [`7610935`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/761093564bf958b18ce70eeb2153739437985c3a)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for masked groups

- [#103](https://github.com/penpot/penpot-exporter-figma-plugin/pull/103)
  [`c71eb8e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c71eb8e736aa591e69fd33312091ddf4d3910b58)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for layer blur

- [#105](https://github.com/penpot/penpot-exporter-figma-plugin/pull/105)
  [`2557cbd`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2557cbdacc7387d0f7268aa58fa89c9bff99d16a)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Implement Flatten object translation

- [#116](https://github.com/penpot/penpot-exporter-figma-plugin/pull/116)
  [`aafb9cf`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/aafb9cf3423355b4194e50f58505fe5f8c43bde2)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Updated copies for custom fonts help

- [#108](https://github.com/penpot/penpot-exporter-figma-plugin/pull/108)
  [`23e97fb`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/23e97fb3d740e715ccf912f7eb84b92111aba0c6)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for linear and radial gradients

### Patch Changes

- [#102](https://github.com/penpot/penpot-exporter-figma-plugin/pull/102)
  [`54df5ea`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/54df5ead1eb33a58cf5f349f45e4806b570634df)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix text image fills

- [#112](https://github.com/penpot/penpot-exporter-figma-plugin/pull/112)
  [`cc5553c`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/cc5553ce7ceef14cdc74840bd2bd567da5ad9c3c)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Arrows on complex svgs are now better
  represented inside Penpot

- [#112](https://github.com/penpot/penpot-exporter-figma-plugin/pull/112)
  [`cc5553c`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/cc5553ce7ceef14cdc74840bd2bd567da5ad9c3c)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix line node svg path

- [#98](https://github.com/penpot/penpot-exporter-figma-plugin/pull/98)
  [`8d5c5c1`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/8d5c5c15eb8832417c0c09e7292931d6a27dd32b)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Recalculate better the plugin height and limit
  it to a safer value so it does not get out of the screen

- [#105](https://github.com/penpot/penpot-exporter-figma-plugin/pull/105)
  [`2557cbd`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2557cbdacc7387d0f7268aa58fa89c9bff99d16a)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Fix complex svgs with multiple
  different fills

## 0.3.1

### Patch Changes

- [#96](https://github.com/penpot/penpot-exporter-figma-plugin/pull/96)
  [`9355f28`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/9355f282d00562aad1adef50fce61829ae9b08ec)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fixed correct size for line nodes

- [#96](https://github.com/penpot/penpot-exporter-figma-plugin/pull/96)
  [`9355f28`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/9355f282d00562aad1adef50fce61829ae9b08ec)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fixed line node export when using opacity 0 on
  the line

## 0.3.0

### Minor Changes

- [#82](https://github.com/penpot/penpot-exporter-figma-plugin/pull/82)
  [`c013e80`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c013e80962196e7a3e094bb3d3200fffdb389ef4)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Basic support for custom fonts

- [#88](https://github.com/penpot/penpot-exporter-figma-plugin/pull/88)
  [`2920ac2`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/2920ac297b37823eef8e5cf868df9a1fe8bd5c6c)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Ordered and unordered list support

- [#61](https://github.com/penpot/penpot-exporter-figma-plugin/pull/61)
  [`881ccab`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/881ccabe86d5a96e6efc84a1ec5e74f9cf5c4ca7)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Added text basic properties

- [#80](https://github.com/penpot/penpot-exporter-figma-plugin/pull/80)
  [`8021da2`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/8021da2623363ffab7f2b3434889c69ac4eeaffd)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Add support for Google Fonts

- [#89](https://github.com/penpot/penpot-exporter-figma-plugin/pull/89)
  [`dddc457`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/dddc457281e6824250852355270d9e2928bbe24a)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Basic support for image fills

- [#90](https://github.com/penpot/penpot-exporter-figma-plugin/pull/90)
  [`3ee244d`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3ee244db923d280e60b6fa090d7613dcf6e8c1c2)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Rethink the UI to be more usable

- [#81](https://github.com/penpot/penpot-exporter-figma-plugin/pull/81)
  [`58f7b0a`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/58f7b0ab2c346e672cc175bbdabd9d481718bd49)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for Source Sans Pro font (penpot
  local font)

- [#84](https://github.com/penpot/penpot-exporter-figma-plugin/pull/84)
  [`4ded73e`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/4ded73e0e9b9d3d498aa885bdac642c26b4475d8)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Paragraph spacing and indent support

## 0.2.2

### Patch Changes

- [#76](https://github.com/penpot/penpot-exporter-figma-plugin/pull/76)
  [`59d70d2`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/59d70d251094895b18bd6af7a8818a0b1de6abf3)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix vector shapes to be more precise with what
  you draw on figma

## 0.2.1

### Patch Changes

- [#71](https://github.com/penpot/penpot-exporter-figma-plugin/pull/71)
  [`3dec0a4`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/3dec0a452079e1a1a3e64290e16b881a47a22876)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fix blend mode 'color' translation

## 0.2.0

### Minor Changes

- [#58](https://github.com/penpot/penpot-exporter-figma-plugin/pull/58)
  [`e732887`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e73288739987d67135dc20ebb97fd165b3da0c79)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Shadows

- [#57](https://github.com/penpot/penpot-exporter-figma-plugin/pull/57)
  [`c464ff9`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/c464ff9bda24ef1660f2a58ecb39f76f1e8151a8)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for corner radius

### Patch Changes

- [#68](https://github.com/penpot/penpot-exporter-figma-plugin/pull/68)
  [`92e0b6f`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/92e0b6f026c8f05d1581bd6d3774e20f6992cb92)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Fixed strokecaps for arrows that were showing
  even when not configured in figma

## 0.1.0

### Minor Changes

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Solid Fills

- [#46](https://github.com/penpot/penpot-exporter-figma-plugin/pull/46)
  [`7a7ad6a`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/7a7ad6ae60885bb71919780a43b60fa3ff2008e3)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Initial plugin release

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Strokes

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Vector - Line & Arrow

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Frames & Sections

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Vector - Pen & Pencil

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Rectangle & Circle

- [#56](https://github.com/penpot/penpot-exporter-figma-plugin/pull/56)
  [`30a64ed`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/30a64ed1b35b62b9839f856cb3be36ee2b8fd7c0)
  Thanks [@Cenadros](https://github.com/Cenadros)! - Added support for background colors in pages

- [#54](https://github.com/penpot/penpot-exporter-figma-plugin/pull/54)
  [`e9ec609`](https://github.com/penpot/penpot-exporter-figma-plugin/commit/e9ec609a9ebc6c3dd4a5ca6a81d7d48ec769af1f)
  Thanks [@jordisala1991](https://github.com/jordisala1991)! - Lock and visibility
