export const getUserData = async () => {
  const user = figma.currentUser;
  if (user) {
    figma.ui.postMessage({
      type: 'USER_DATA',
      data: {
        userId: user.id
      }
    });
  } else {
    console.error('Could not get user data');
  }
};
