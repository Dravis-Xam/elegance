// routeToggles.js
const routeStatus = new Map();

export const enableRoute = (routePath) => {
  routeStatus.set(routePath, true);
};

export const disableRoute = (routePath) => {
  routeStatus.set(routePath, false);
};

export const isRouteEnabled = (routePath) => {
  return routeStatus.get(routePath) !== false; // default is enabled
};
