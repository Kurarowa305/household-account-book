import { routes } from "../../constants/routes.js"
import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderNavigation(activeRouteKey) {
  const primaryRoutes = routes.filter((route) => route.key !== "wallets")
  const walletsRoute = routes.find((route) => route.key === "wallets")
  return `
    <aside class="sidebar" aria-label="Main menu" data-component-uid="CMP-0002">
      <div class="brand" data-component-uid="CMP-0004">
        <div class="brand-mark" aria-hidden="true">¥</div>
        <div>
          <h1>${escapeHtml(strings.app.title)}</h1>
          <p id="activeWalletLabel">${escapeHtml(strings.app.defaultWallet)}</p>
        </div>
      </div>

      <nav class="primary-nav" aria-label="Primary navigation">
        ${primaryRoutes.map((route) => renderRouteButton(route, activeRouteKey)).join("")}
      </nav>

      ${walletsRoute ? renderWalletRoute(walletsRoute, activeRouteKey) : ""}
    </aside>
  `
}

function renderRouteButton(route, activeRouteKey) {
  const activeClass = route.key === activeRouteKey ? " is-active" : ""
  return `
    <button class="nav-button${activeClass}" type="button" data-route="${escapeHtml(route.hash)}" data-component-uid="CMP-0005" data-action-uid="ACT-0101">
      ${icon(route.icon)}
      <span>${escapeHtml(route.title)}</span>
    </button>
  `
}

function renderWalletRoute(route, activeRouteKey) {
  const activeClass = route.key === activeRouteKey ? " is-active" : ""
  return `
    <button class="wallet-link${activeClass}" type="button" data-route="${escapeHtml(route.hash)}" data-component-uid="CMP-0006" data-action-uid="ACT-0101">
      ${icon(route.icon)}
      <span>${escapeHtml(route.title)}</span>
    </button>
  `
}
