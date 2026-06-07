import { strings } from "../constants/strings.js"

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function activeWallets(state) {
  return state.wallets.filter((wallet) => !wallet.deletedAt)
}

export function selectWalletAction(state, walletId) {
  console.log("selectWallet action fired", { walletId })
  state.currentWalletId = walletId
  return strings.toast.walletSelected
}

export function openWalletDialog(target) {
  console.log("openWalletDialog action fired")
  const dialog = target.closest(".page-wallets")?.querySelector("[data-wallet-dialog]")
  if (!dialog) return ""
  if (dialog.showModal) dialog.showModal()
  else dialog.setAttribute("open", "")
  return ""
}

export function closeWalletDialog(target) {
  const dialog = target.closest("[data-wallet-dialog]")
  if (dialog?.close) dialog.close()
  else dialog?.removeAttribute("open")
}

export function createWalletMockAction(state, form) {
  const name = String(form.elements.walletName?.value || "").trim() || "New Wallet"
  console.log("createWalletMock action fired", { name })
  const wallet = {
    id: uid("wallet"),
    name,
    role: "edit",
    deletedAt: "",
    budget: 0,
    fixedSettings: { rent: { amount: 0 }, internet: { amount: 0 } },
    householdItems: [],
    deletedHouseholdItems: [],
    entries: [],
  }
  state.wallets.push(wallet)
  state.currentWalletId = wallet.id
  return strings.toast.walletCreated
}

export function deleteWalletMockAction(state, walletId) {
  console.log("deleteWalletMock action fired", { walletId })
  if (activeWallets(state).length <= 1) return "Keep at least one wallet"
  const wallet = state.wallets.find((item) => item.id === walletId)
  if (wallet) wallet.deletedAt = new Date().toISOString()
  if (state.currentWalletId === walletId) state.currentWalletId = activeWallets(state)[0]?.id
  return strings.toast.walletDeleted
}
