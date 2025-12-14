export const PASSWORD_ROUTES = {
  forgetPassword: (userType: "user" | "organizer") =>
    `/api/${userType}/forgetPassword`,

  verifyOtp: (userType: "user" | "organizer") =>
    `/api/${userType}/resetPasswordOtp`,

  changePassword: (userType: "user" | "organizer") =>
    `/api/${userType}/changePassword`,
};
