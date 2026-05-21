export const getDefaultDashboardRoute = (role) =>
  role === "admin" ? "/admin/dashboard" : "/client/dashboard";

