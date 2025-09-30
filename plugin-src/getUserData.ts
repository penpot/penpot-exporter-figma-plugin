export const getUserData = (): void => {
  const user = figma.currentUser;
  if (user) {
    figma.ui.postMessage({
      type: 'USER_DATA',
      data: {
        userId: user.id
      }
    });
  } else {
    console.warn('Could not get user data');
  }
};
