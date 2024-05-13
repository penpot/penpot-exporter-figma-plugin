export const registerChange = () => {
  figma.ui.postMessage({ type: 'CHANGES_DETECTED' });
};
