import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderWalletGrid(viewModel) {
  return `
    <div class="wallet-grid" data-component-uid="CMP-0503">
      ${viewModel.wallets
        .map(
          (wallet) => `
            <article class="wallet-card ${wallet.id === viewModel.currentWalletId ? "is-active" : ""}" data-component-uid="CMP-0504">
              <button class="wallet-select" type="button" data-wallet-id="${escapeHtml(wallet.id)}" data-component-uid="CMP-0505" data-action-uid="ACT-0501">
                <h3>${escapeHtml(wallet.name)}</h3>
              </button>
              <details class="wallet-menu" data-component-uid="CMP-0506">
                <summary aria-label="${strings.wallets.walletActions}" title="${strings.wallets.walletActions}">
                  ${icon("more-vertical")}
                </summary>
                <button class="danger-menu-button" type="button" data-delete-wallet="${escapeHtml(wallet.id)}" data-component-uid="CMP-0507" data-action-uid="ACT-0504">${strings.common.delete}</button>
              </details>
            </article>
          `,
        )
        .join("")}
    </div>
  `
}
