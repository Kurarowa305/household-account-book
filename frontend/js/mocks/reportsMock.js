import { appMockState } from "./appMockState.js"
import {
  annualSavingsFor,
  budgetFor,
  buildAnnualRows,
  categoryTotalsForReport,
  currentWallet,
  getBreakdownData,
  hasRecordedMonth,
  spentFor,
} from "../utils/ledgerCalculations.js"

export function createReportsViewModel(state = appMockState) {
  const wallet = currentWallet(state)
  const budget = budgetFor(state, wallet)
  const spent = spentFor(state, wallet)
  const annualRows = buildAnnualRows(state, wallet)
  return {
    screenUid: "SCR-0003",
    selectedMonth: state.selectedMonth,
    monthlyComment: state.monthlyComment,
    budget,
    spent,
    remaining: budget - spent,
    annualRows: annualRows.map((row) => ({
      ...row,
      recorded: hasRecordedMonth(state, row),
    })),
    annualBudget: annualRows.reduce((sum, row) => sum + Number(row.budget || 0), 0),
    annualSpent: annualRows.reduce((sum, row) => sum + Number(row.spent || 0), 0),
    annualSavings: annualSavingsFor(state, wallet),
    breakdown: getBreakdownData(state, wallet),
    categoryTotals: categoryTotalsForReport(state, wallet),
  }
}

export const reportsMockViewModel = createReportsViewModel(appMockState)
