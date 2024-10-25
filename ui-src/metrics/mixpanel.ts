import mixpanel from 'mixpanel-figma';

export const track = (name: string, opts = {}) => {
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    opts = {
      ...opts,
      'Plugin Version': APP_VERSION
    };
    mixpanel.track(name, opts);
  }
};

export const identify = ({ userId, name }: { userId: string; name: string }) => {
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    mixpanel.identify(userId);

    mixpanel.people.set({
      'USER_ID': userId,
      '$name': name,
      'Plugin Version': APP_VERSION
    });
  }
};

export const initializeMixpanel = () => {
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
      disable_cookie: true,
      disable_persistence: true,
      track_pageview: true
    });
  }
};
