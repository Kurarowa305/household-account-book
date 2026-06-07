import { renderNavigation } from "./navigation.js"
import { renderToast } from "./toast.js"

export function renderAppShell(activeRouteKey) {
  return `
    <div class="app-shell" data-component-uid="CMP-0001">
      ${renderNavigation(activeRouteKey)}
      <main class="main">
        ${renderToast()}
        <div id="app" class="view"></div>
      </main>
    </div>
  `
}
