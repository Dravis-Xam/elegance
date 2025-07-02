import { isRouteEnabled } from "../helpers/maintenance.js";


export const routeControl = (routePath) => (req, res, next) => {
  if (!isRouteEnabled(routePath)) {
    return res.status(503).json({ error: 'This route is temporarily disabled.' });
  }
  next();
};
