import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"

export function renderWalletDialog() {
  return `
    <dialog class="item-dialog" data-wallet-dialog data-component-uid="CMP-0508">
      <form class="dialog-card" data-wallet-form data-action-uid="ACT-0503">
        <header>
          <h3>${strings.wallets.addWallet}</h3>
          <button class="icon-button" type="button" data-close-wallet-dialog aria-label="${strings.common.close}" title="${strings.common.close}">
            ${icon("x")}
          </button>
        </header>
        <label class="field">
          <span class="field-label">${strings.wallets.walletName}</span>
          <input name="walletName" type="text" placeholder="New Wallet" />
        </label>
        <div class="form-actions">
          <button class="secondary-button" type="button" data-close-wallet-dialog>${strings.common.cancel}</button>
          <button class="primary-button" type="submit" data-component-uid="CMP-0509" data-action-uid="ACT-0503">
            ${icon("plus")}
            <span>${strings.common.create}</span>
          </button>
        </div>
      </form>
    </dialog>
  `
}
