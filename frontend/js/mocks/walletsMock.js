import { appMockState } from "./appMockState.js"
import { activeWallets } from "../utils/ledgerCalculations.js"

export function createWalletsViewModel(state = appMockState) {
  return {
    screenUid: "SCR-0005",
    currentWalletId: state.currentWalletId,
    wallets: activeWallets(state),
  }
}

export const walletsMockViewModel = createWalletsViewModel(appMockState)
