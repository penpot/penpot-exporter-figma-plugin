import { reportProgress } from '@plugin/utils';

export const getUserData = (): void => {
  const user = figma.currentUser;

  if (!user || !user.id) {
    console.warn('Could not get user data');

    return;
  }

  reportProgress({
    type: 'USER_DATA',
    data: {
      userId: user.id
    }
  });
};
