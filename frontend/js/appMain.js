import { bindActionDispatcher } from "./actions/actionDispatcher.js"
import { renderAppShell } from "./components/shell/appShell.js"
import { appMockState } from "./mocks/appMockState.js"
import { createHomeViewModel } from "./mocks/homeMock.js"
import { createPortKeysViewModel } from "./mocks/portKeysMock.js"
import { createReportsViewModel } from "./mocks/reportsMock.js"
import { createShoppingListViewModel } from "./mocks/shoppingListMock.js"
import { createWalletsViewModel } from "./mocks/walletsMock.js"
import { renderHomePage, mountHomePage } from "./pages/homePage.js"
import { renderPortKeysPage } from "./pages/portKeysPage.js"
import { renderReportsPage, mountReportsPage } from "./pages/reportsPage.js"
import { renderShoppingListPage } from "./pages/shoppingListPage.js"
import { renderWalletsPage } from "./pages/walletsPage.js"
import { ensureDefaultHash, getRouteByHash } from "./router.js"

const root = document.querySelector("#root")
let resizeTimer = null

function render() {
  const route = getRouteByHash()
  root.innerHTML = renderAppShell(route.key)
  const app = root.querySelector("#app")
  const { html, mount, viewModel } = renderCurrentRoute(route.key)
  app.innerHTML = html
  root.querySelector("#activeWalletLabel").textContent = appMockState.wallets.find((wallet) => wallet.id === appMockState.currentWalletId)?.name || "Main Wallet"
  mount?.(app, viewModel)
  if (window.lucide) window.lucide.createIcons()
}

function renderCurrentRoute(routeKey) {
  if (routeKey === "portKeys") {
    const viewModel = createPortKeysViewModel(appMockState)
    return { html: renderPortKeysPage(viewModel), viewModel }
  }
  if (routeKey === "reports") {
    const viewModel = createReportsViewModel(appMockState)
    return { html: renderReportsPage(viewModel), mount: mountReportsPage, viewModel }
  }
  if (routeKey === "shoppingList") {
    const viewModel = createShoppingListViewModel(appMockState)
    return { html: renderShoppingListPage(viewModel), viewModel }
  }
  if (routeKey === "wallets") {
    const viewModel = createWalletsViewModel(appMockState)
    return { html: renderWalletsPage(viewModel), viewModel }
  }
  const viewModel = createHomeViewModel(appMockState)
  return { html: renderHomePage(viewModel), mount: mountHomePage, viewModel }
}

bindActionDispatcher({ root, state: appMockState, render })
window.addEventListener("hashchange", render)
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(render, 120)
})

ensureDefaultHash()
render()
