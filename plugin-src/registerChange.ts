import { BASE_WIDTH, NEEDS_RELOAD_TEXT_HEIGHT, NORMAL_HEIGHT } from './pluginSizes';

export const registerChange = () => {
  figma.ui.postMessage({ type: 'CHANGES_DETECTED' });
  figma.ui.resize(BASE_WIDTH, NORMAL_HEIGHT + NEEDS_RELOAD_TEXT_HEIGHT);
};
