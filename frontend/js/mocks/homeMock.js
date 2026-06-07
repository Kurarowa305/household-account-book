import { categoryMeta } from "../constants/categoryMeta.js"
import { appMockState } from "./appMockState.js"
import {
  annualSavingsFor,
  budgetFor,
  budgetGoalFor,
  buildAnnualRows,
  categoryTotal,
  currentWallet,
  getBreakdownData,
  hasRecordedMonth,
  spentFor,
  totalSavingsFor,
} from "../utils/ledgerCalculations.js"

export function createHomeViewModel(state = appMockState) {
  const wallet = currentWallet(state)
  const budget = budgetFor(state, wallet)
  const spent = spentFor(state, wallet)
  return {
    screenUid: "SCR-0001",
    walletName: wallet.name,
    totalSavings: totalSavingsFor(state, wallet),
    annualSavings: annualSavingsFor(state, wallet),
    budget,
    spent,
    remaining: budget - spent,
    goalComment: budgetGoalFor(state, wallet),
    categories: Object.entries(categoryMeta).map(([key, meta]) => ({
      key,
      ...meta,
      total: categoryTotal(key, state, wallet),
    })),
    breakdown: getBreakdownData(state, wallet),
    archiveRows: buildAnnualRows(state, wallet).map((row) => ({
      month: row.month,
      recorded: hasRecordedMonth(state, row),
    })),
    shoppingOpenCount: state.shoppingList.filter((item) => !item.done).length,
  }
}

export const homeMockViewModel = createHomeViewModel(appMockState)
