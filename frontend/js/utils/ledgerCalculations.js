import { categoryMeta, categoryOrder } from "../constants/categoryMeta.js"
import { appMockState } from "../mocks/appMockState.js"

const SAVINGS_CARRYOVER = 584958

export function activeWallets(state = appMockState) {
  return state.wallets.filter((wallet) => !wallet.deletedAt)
}

export function currentWallet(state = appMockState) {
  const wallets = activeWallets(state)
  return wallets.find((wallet) => wallet.id === state.currentWalletId) || wallets[0] || state.wallets[0]
}

export function activeHouseholdItems(wallet = currentWallet()) {
  const deletedItems = new Set(wallet.deletedHouseholdItems || [])
  return wallet.householdItems.filter((item) => !deletedItems.has(item))
}

export function monthEntries(wallet = currentWallet(), month = appMockState.selectedMonth) {
  return wallet.entries.filter((entry) => entry.date.startsWith(month))
}

export function expenseEntries(wallet = currentWallet(), month = appMockState.selectedMonth) {
  return monthEntries(wallet, month).filter((entry) => !["budget", "savings"].includes(entry.category))
}

export function budgetEntryFor(wallet = currentWallet(), month = appMockState.selectedMonth) {
  const entries = monthEntries(wallet, month).filter((entry) => entry.category === "budget")
  return entries[entries.length - 1] || null
}

export function budgetFor(state = appMockState, wallet = currentWallet(state), month = state.selectedMonth) {
  const budgetEntry = budgetEntryFor(wallet, month)
  if (budgetEntry) return Number(budgetEntry.amount || 0)
  const annualRecord = state.annualRecords.find((record) => record.month === month)
  return Number(annualRecord?.budget || 0)
}

export function budgetGoalFor(state = appMockState, wallet = currentWallet(state), month = state.selectedMonth) {
  const budgetEntry = budgetEntryFor(wallet, month)
  if (budgetEntry?.comment) return budgetEntry.comment
  const annualRecord = state.annualRecords.find((record) => record.month === month)
  return annualRecord?.budgetGoal || ""
}

export function spentFor(state = appMockState, wallet = currentWallet(state), month = state.selectedMonth) {
  return expenseEntries(wallet, month).reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
}

export function categoryTotal(category, state = appMockState, wallet = currentWallet(state), month = state.selectedMonth) {
  if (category === "budget") return budgetFor(state, wallet, month)
  return monthEntries(wallet, month)
    .filter((entry) => category === "all" || entry.category === category)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
}

export function categoryLabelTotal(category, label, state = appMockState, wallet = currentWallet(state), month = state.selectedMonth) {
  return monthEntries(wallet, month)
    .filter((entry) => entry.category === category && entry.label === label)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
}

export function selectedDate(state = appMockState) {
  if (state.inputDate?.startsWith(state.selectedMonth)) return state.inputDate
  return `${state.selectedMonth}-15`
}

export function getBreakdownData(state = appMockState, wallet = currentWallet(state), month = state.selectedMonth) {
  return Object.entries(categoryMeta)
    .filter(([key]) => !["budget", "savings"].includes(key))
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      value: categoryTotal(key, state, wallet, month),
      color: meta.color,
    }))
    .filter((item) => item.value > 0)
}

export function getMinPrices(state = appMockState, wallet = currentWallet(state)) {
  const prices = new Map()
  wallet.entries
    .filter((entry) => entry.category === "daily" && entry.store && Number(entry.amount) > 0)
    .forEach((entry) => {
      const current = prices.get(entry.label)
      if (!current || Number(entry.amount) < current.price) {
        prices.set(entry.label, {
          item: entry.label,
          price: Number(entry.amount),
          store: entry.store,
          month: entry.date.slice(0, 7),
        })
      }
    })
  return Array.from(prices.values()).sort((a, b) => a.item.localeCompare(b.item))
}

export function buildAnnualRows(state = appMockState, wallet = currentWallet(state)) {
  const byMonth = new Map(state.annualRecords.map((record) => [record.month, { ...record }]))
  Array.from({ length: 12 }, (_, index) => `${state.fiscalYear}-${String(index + 1).padStart(2, "0")}`).forEach((month) => {
    if (!byMonth.has(month)) {
      byMonth.set(month, {
        month,
        budget: 0,
        spent: 0,
        food: 0,
        savings: 0,
        savingsDeposits: 0,
        savingsWithdrawals: 0,
        dailyItems: {},
        minPrices: [],
        special: [],
        budgetGoal: "",
        comment: "",
      })
    }
  })

  const live = byMonth.get(state.selectedMonth)
  if (live) {
    live.budget = budgetFor(state, wallet)
    live.budgetGoal = budgetGoalFor(state, wallet)
    live.spent = spentFor(state, wallet)
    live.food = categoryTotal("food", state, wallet)
    const savingsEntries = monthEntries(wallet, state.selectedMonth).filter((entry) => entry.category === "savings")
    live.savingsDeposits = savingsEntries.reduce((sum, entry) => sum + Math.max(Number(entry.amount || 0), 0), 0)
    live.savingsWithdrawals = savingsEntries.reduce((sum, entry) => sum + Math.max(-Number(entry.amount || 0), 0), 0)
    live.savings = live.savingsDeposits - live.savingsWithdrawals
    live.dailyItems = expenseEntries(wallet, state.selectedMonth)
      .filter((entry) => entry.category === "daily")
      .reduce((items, entry) => {
        items[entry.label] = (items[entry.label] || 0) + Number(entry.amount || 0)
        return items
      }, {})
    live.minPrices = getMinPrices(state, wallet)
    live.special = expenseEntries(wallet, state.selectedMonth)
      .filter((entry) => entry.category === "special")
      .map((entry) => ({ label: entry.label, amount: entry.amount }))
    live.comment = state.monthlyComment
  }

  return Array.from(byMonth.values()).sort((a, b) => a.month.localeCompare(b.month))
}

function savingsFlowForRow(row) {
  const hasFlow = row.savingsDeposits !== undefined || row.savingsWithdrawals !== undefined
  const netSavings = Number(row.savings || 0)
  return {
    deposits: hasFlow ? Number(row.savingsDeposits || 0) : Math.max(netSavings, 0),
    withdrawals: hasFlow ? Number(row.savingsWithdrawals || 0) : Math.max(-netSavings, 0),
  }
}

function savingsAmountForRow(row) {
  const flow = savingsFlowForRow(row)
  return Number(row.budget || 0) + flow.deposits - (Number(row.spent || 0) + flow.withdrawals)
}

export function annualSavingsFor(state = appMockState, wallet = currentWallet(state)) {
  return buildAnnualRows(state, wallet)
    .filter((row) => row.month.startsWith(`${state.fiscalYear}-`) && hasRecordedMonth(state, row))
    .reduce((sum, row) => sum + savingsAmountForRow(row), 0)
}

export function totalSavingsFor(state = appMockState, wallet = currentWallet(state)) {
  return SAVINGS_CARRYOVER + annualSavingsFor(state, wallet)
}

export function hasRecordedMonth(state = appMockState, row) {
  const flow = savingsFlowForRow(row)
  return (
    Number(row.spent || 0) > 0 ||
    Number(row.savings || 0) !== 0 ||
    flow.deposits > 0 ||
    flow.withdrawals > 0 ||
    state.archives.some((archive) => archive.month === row.month)
  )
}

export function budgetHistoryRows(state = appMockState, wallet = currentWallet(state)) {
  const annualRows = buildAnnualRows(state, wallet)
  const rowsByMonth = new Map()

  annualRows
    .filter((row) => Number(row.budget || 0) > 0 && row.month <= state.selectedMonth)
    .forEach((row) => {
      rowsByMonth.set(row.month, {
        month: row.month,
        amount: Number(row.budget || 0),
        comment: budgetGoalFor(state, wallet, row.month),
        expenses: Number(row.spent || 0),
        isDeficit: Number(row.spent || 0) > Number(row.budget || 0),
      })
    })

  wallet.entries
    .filter((entry) => entry.category === "budget")
    .forEach((entry) => {
      const month = entry.date.slice(0, 7)
      const annualRow = annualRows.find((row) => row.month === month)
      const spent = annualRow ? Number(annualRow.spent || 0) : spentFor(state, wallet, month)
      rowsByMonth.set(month, {
        month,
        amount: Number(entry.amount || 0),
        comment: entry.comment || budgetGoalFor(state, wallet, month),
        expenses: spent,
        isDeficit: spent > Number(entry.amount || 0),
      })
    })

  return Array.from(rowsByMonth.values()).sort((a, b) => b.month.localeCompare(a.month))
}

export function historyRowsForSelectedCategory(state = appMockState, wallet = currentWallet(state)) {
  const selected = state.historyCategory || "all"
  if (selected === "budget") return budgetHistoryRows(state, wallet)
  return monthEntries(wallet, state.selectedMonth)
    .filter((entry) => selected === "all" || entry.category === selected)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function canDeletePortKeyEntry(state = appMockState, entry, wallet = currentWallet(state)) {
  return wallet.role === "edit" && entry.date.startsWith(state.activeMonth || state.selectedMonth)
}

export function categoryTotalsForReport(state = appMockState, wallet = currentWallet(state)) {
  return categoryOrder.flatMap((key) => {
    const meta = categoryMeta[key]
    if (key !== "variable") {
      return [{ portKey: meta.portKey, label: meta.label, value: categoryTotal(key, state, wallet) }]
    }
    return ["Electricity", "Gas", "Water"].map((label) => ({
      portKey: meta.portKey,
      label,
      value: categoryLabelTotal("variable", label, state, wallet),
    }))
  })
}
