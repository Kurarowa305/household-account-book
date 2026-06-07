import { categoryMeta } from "../constants/categoryMeta.js"
import { appMockState } from "./appMockState.js"
import {
  activeHouseholdItems,
  budgetFor,
  budgetGoalFor,
  budgetHistoryRows,
  canDeletePortKeyEntry,
  currentWallet,
  historyRowsForSelectedCategory,
  selectedDate,
} from "../utils/ledgerCalculations.js"

export function createPortKeysViewModel(state = appMockState) {
  const wallet = currentWallet(state)
  const selectedCategory = state.historyCategory || "all"
  const rows = historyRowsForSelectedCategory(state, wallet)
  return {
    screenUid: "SCR-0002",
    selectedCategory,
    selectedDate: selectedDate(state),
    canEdit: wallet.role === "edit",
    categories: Object.entries(categoryMeta).map(([key, meta]) => ({ key, ...meta })),
    wallet,
    budgetAmount: budgetFor(state, wallet),
    goalComment: budgetGoalFor(state, wallet),
    fixedSettings: wallet.fixedSettings,
    dailyItems: activeHouseholdItems(wallet),
    rows,
    budgetRows: budgetHistoryRows(state, wallet),
    canDeleteEntry: (entry) => canDeletePortKeyEntry(state, entry, wallet),
  }
}

export const portKeysMockViewModel = createPortKeysViewModel(appMockState)
