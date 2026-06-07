import { strings } from "../constants/strings.js"
import { icon } from "../utils/html.js"
import { renderWalletDialog } from "../components/wallets/walletDialog.js"
import { renderWalletGrid } from "../components/wallets/walletGrid.js"

export function renderWalletsPage(viewModel) {
  return `
    <main class="page page-wallets section-stack" data-screen-uid="SCR-0005">
      <section class="panel" data-component-uid="CMP-0501">
        <header>
          <h2>${strings.wallets.wallets}</h2>
          <button class="secondary-button" type="button" data-open-wallet-dialog data-component-uid="CMP-0502" data-action-uid="ACT-0502">
            ${icon("plus")}
            <span>${strings.wallets.addWallet}</span>
          </button>
        </header>
        ${renderWalletGrid(viewModel)}
      </section>
      ${renderWalletDialog()}
    </main>
  `
}
