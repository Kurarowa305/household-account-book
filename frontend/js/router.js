import { defaultRoute, routes } from "./constants/routes.js"

export function getRouteByHash(hash = window.location.hash) {
  const normalizedHash = hash || defaultRoute.hash
  return routes.find((route) => route.hash === normalizedHash) || defaultRoute
}

export function ensureDefaultHash() {
  if (!window.location.hash) window.location.hash = defaultRoute.hash
}
