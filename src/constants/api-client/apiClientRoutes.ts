export const ApiRoutes = {
  REFRESH_TOKEN: `/api/user/refreshToken`,

  // You may reuse these for role detection logic
  ORGANIZER_BASE: `/organizer`,
  ADMIN_BASE: `/admin`,
  USER_BASE: `/user`,
} as const;

export const RedirectRoutes = {
  LOGIN_USER: `/login/user`,
  LOGIN_ORGANIZER: `/login/organizer`,
  LOGIN_ADMIN: `/admin/login`,
} as const;
