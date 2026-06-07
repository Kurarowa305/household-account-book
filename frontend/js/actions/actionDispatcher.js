import { showToast } from "../components/shell/toast.js"
import { selectPortKeyCategory, navigateToHash, selectReportMonth } from "./navigationActions.js"
import {
  addBankEntryAction,
  addDailyGoodsEntryAction,
  addDailyGoodsMasterItemAction,
  addFoodEntryAction,
  addSpecialEntryAction,
  addVariableCostsAction,
  closeDialog,
  deleteCurrentMonthEntryAction,
  deleteDailyGoodsMasterItemAction,
  openDailyGoodsItemDialog,
  saveBudgetAction,
  saveFixedCostsAction,
  updateInputDate,
} from "./portKeyActions.js"
import {
  deleteYearMockAction,
  editAnnualCommentAction,
  exportAnnualReportMockAction,
  exportMonthlyReportMockAction,
  saveMonthlyCommentAction,
  startNewFiscalYearMockAction,
} from "./reportActions.js"
import {
  addShoppingDailyGoodsAction,
  addShoppingFoodAction,
  deleteShoppingItemAction,
  sendLineMockAction,
  toggleLineScheduleAction,
  toggleShoppingDoneAction,
} from "./shoppingActions.js"
import {
  closeWalletDialog,
  createWalletMockAction,
  deleteWalletMockAction,
  openWalletDialog,
  selectWalletAction,
} from "./walletActions.js"

export function bindActionDispatcher({ root, state, render }) {
  root.addEventListener("click", (event) => {
    const closeDialogButton = event.target.closest("[data-close-dialog]")
    if (closeDialogButton) {
      closeDialog(closeDialogButton)
      return
    }

    const closeWalletButton = event.target.closest("[data-close-wallet-dialog]")
    if (closeWalletButton) {
      closeWalletDialog(closeWalletButton)
      return
    }

    const actionElement = event.target.closest("[data-action-uid]")
    if (!actionElement || !root.contains(actionElement)) return
    const message = dispatchClickAction(actionElement.dataset.actionUid, actionElement, state, root)
    if (message) showToast(message)
    if (shouldRenderAfterClick(actionElement.dataset.actionUid)) render()
  })

  root.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-action-uid]")
    if (!form || !root.contains(form)) return
    event.preventDefault()
    const message = dispatchSubmitAction(form.dataset.actionUid, form, state)
    if (message) showToast(message)
    render()
  })

  root.addEventListener("change", (event) => {
    const target = event.target.closest("[data-action-uid]")
    if (!target || !root.contains(target)) return
    const message = dispatchChangeAction(target.dataset.actionUid, target, state)
    if (message) showToast(message)
    if (shouldRenderAfterChange(target.dataset.actionUid)) render()
  })
}

function dispatchClickAction(actionUid, target, state, root) {
  switch (actionUid) {
    case "ACT-0101":
      navigateToHash(target.dataset.route || target.dataset.routeTarget || "#/home")
      return ""
    case "ACT-0102":
      selectPortKeyCategory(state, target.dataset.categoryTab || target.dataset.historyCategory)
      return ""
    case "ACT-0103":
      selectReportMonth(state, target.dataset.reportMonth)
      return ""
    case "ACT-0205":
      return openDailyGoodsItemDialog(target)
    case "ACT-0207":
      return deleteDailyGoodsMasterItemAction(state, target.dataset.deleteDailyItem)
    case "ACT-0211":
      return deleteCurrentMonthEntryAction(state, target.dataset.deleteEntry)
    case "ACT-0301":
      return saveMonthlyCommentAction(state, root)
    case "ACT-0302":
      return exportMonthlyReportMockAction(state, root)
    case "ACT-0304":
      return exportAnnualReportMockAction(state)
    case "ACT-0305":
      return deleteYearMockAction(state)
    case "ACT-0306":
      return startNewFiscalYearMockAction(state)
    case "ACT-0404":
      return sendLineMockAction(state)
    case "ACT-0406":
      return deleteShoppingItemAction(state, target.dataset.shoppingDelete)
    case "ACT-0501":
      return selectWalletAction(state, target.dataset.walletId)
    case "ACT-0502":
      return openWalletDialog(target)
    case "ACT-0504":
      return deleteWalletMockAction(state, target.dataset.deleteWallet)
    default:
      return ""
  }
}

function dispatchSubmitAction(actionUid, form, state) {
  switch (actionUid) {
    case "ACT-0201":
      return saveBudgetAction(state, form)
    case "ACT-0202":
      return addBankEntryAction(state, form)
    case "ACT-0203":
      return addFoodEntryAction(state, form)
    case "ACT-0204":
      return addDailyGoodsEntryAction(state, form)
    case "ACT-0206":
      return addDailyGoodsMasterItemAction(state, form)
    case "ACT-0208":
      return addSpecialEntryAction(state, form)
    case "ACT-0209":
      return saveFixedCostsAction(state, form)
    case "ACT-0210":
      return addVariableCostsAction(state, form)
    case "ACT-0401":
      return addShoppingFoodAction(state, form)
    case "ACT-0402":
      return addShoppingDailyGoodsAction(state, form)
    case "ACT-0503":
      return createWalletMockAction(state, form)
    default:
      return ""
  }
}

function dispatchChangeAction(actionUid, target, state) {
  switch (actionUid) {
    case "ACT-0200":
      updateInputDate(state, target.value)
      return ""
    case "ACT-0303":
      return editAnnualCommentAction(state, target)
    case "ACT-0403":
      return toggleLineScheduleAction(state, target.checked)
    case "ACT-0405":
      return toggleShoppingDoneAction(state, target.dataset.shoppingDone, target.checked)
    default:
      return ""
  }
}

function shouldRenderAfterClick(actionUid) {
  return ["ACT-0102", "ACT-0103", "ACT-0207", "ACT-0211", "ACT-0305", "ACT-0306", "ACT-0406", "ACT-0501", "ACT-0504"].includes(actionUid)
}

function shouldRenderAfterChange(actionUid) {
  return ["ACT-0200", "ACT-0403", "ACT-0405"].includes(actionUid)
}
