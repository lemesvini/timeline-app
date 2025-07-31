export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
    forgotPassword: {
      path: '/auth/forgot-password',
      getHref: () => '/auth/forgot-password',
    },
    resetPassword: {
      path: '/auth/reset-password/:token',
      getHref: (token: string) => `/auth/reset-password/${token}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },

    // discussion: {
    //   path: 'discussions/:discussionId',
    //   getHref: (id: string) => `/app/discussions/${id}`,
    // },
    users: {
      path: 'users',
      getHref: () => '/app/users',
    },
    user: {
      path: 'users/:userId',
      getHref: (userId: string) => `/app/users/${userId}`,
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
  },
} as const;
