export const getUserData = (): void => {
  const user = figma.currentUser;

  if (!user) {
    console.warn('Could not get user data');

    return;
  }

  figma.ui.postMessage({
    type: 'USER_DATA',
    data: {
      userId: user.id
    }
  });
};
