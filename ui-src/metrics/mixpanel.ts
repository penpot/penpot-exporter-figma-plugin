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

export const identify = ({ userId }: { userId: string }) => {
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    mixpanel.identify(userId);

    mixpanel.people.set({
      'USER_ID': userId,
      'Plugin Version': APP_VERSION
    });
  }
};

export const initializeMixpanel = () => {
  if (import.meta.env.VITE_MIXPANEL_TOKEN) {
    mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
      disable_cookie: true,
      disable_persistence: true,
      opt_out_tracking_by_default: true,
      ip: false,
      track_pageview: true
    });
  }
};
