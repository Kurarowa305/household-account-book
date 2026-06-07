import { strings } from "../constants/strings.js"

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function currentWallet(state) {
  return state.wallets.find((wallet) => wallet.id === state.currentWalletId) || state.wallets.find((wallet) => !wallet.deletedAt)
}

function selectedDate(state) {
  return state.inputDate?.startsWith(state.selectedMonth) ? state.inputDate : `${state.selectedMonth}-15`
}

function getFormNumber(form, name) {
  return Number(form.elements[name]?.value || 0)
}

function getFormText(form, name) {
  return String(form.elements[name]?.value || "").trim()
}

function addEntry(state, entry) {
  const wallet = currentWallet(state)
  wallet.entries.push({
    id: uid("entry"),
    date: selectedDate(state),
    store: "",
    ...entry,
    amount: Number(entry.amount || 0),
  })
}

export function updateInputDate(state, value) {
  console.log("changeInputDate action fired", { value })
  state.inputDate = value
  state.selectedMonth = value.slice(0, 7)
}

export function saveBudgetAction(state, form) {
  const wallet = currentWallet(state)
  const amount = getFormNumber(form, "amount")
  const comment = getFormText(form, "comment")
  console.log("saveBudget action fired", { amount, comment })
  wallet.budget = amount
  const existing = wallet.entries.find((entry) => entry.category === "budget" && entry.date.startsWith(state.selectedMonth))
  if (existing) {
    existing.amount = amount
    existing.comment = comment
  } else {
    wallet.entries.push({
      id: uid("entry"),
      date: `${state.selectedMonth}-01`,
      category: "budget",
      label: "Monthly Budget",
      amount,
      comment,
      store: "",
    })
  }
  return strings.toast.saved
}

export function addBankEntryAction(state, form) {
  const direction = getFormText(form, "direction")
  const amount = getFormNumber(form, "amount")
  console.log("addBankEntry action fired", { direction, amount })
  addEntry(state, {
    category: "savings",
    label: direction === "withdrawal" ? "Withdrawal" : "Deposit",
    amount: direction === "withdrawal" ? -amount : amount,
  })
  return strings.toast.added
}

export function addFoodEntryAction(state, form) {
  const label = getFormText(form, "label")
  const amount = getFormNumber(form, "amount")
  console.log("addFoodEntry action fired", { label, amount })
  addEntry(state, { category: "food", label: label || "Food Item", amount })
  return strings.toast.added
}

export function addDailyGoodsEntryAction(state, form) {
  const label = getFormText(form, "label")
  const amount = getFormNumber(form, "amount")
  const store = getFormText(form, "store")
  console.log("addDailyGoodsEntry action fired", { label, amount, store })
  addEntry(state, { category: "daily", label: label || "Daily Goods", amount, store })
  return strings.toast.added
}

export function openDailyGoodsItemDialog(target) {
  console.log("openDailyGoodsItemDialog action fired")
  const dialog = target.closest(".daily-input-shell")?.querySelector("[data-daily-item-dialog]")
  if (!dialog) return ""
  if (dialog.showModal) dialog.showModal()
  else dialog.setAttribute("open", "")
  return ""
}

export function closeDialog(target) {
  const dialog = target.closest("dialog")
  if (dialog?.close) dialog.close()
  else dialog?.removeAttribute("open")
}

export function addDailyGoodsMasterItemAction(state, form) {
  const wallet = currentWallet(state)
  const item = getFormText(form, "newDailyItem")
  console.log("addDailyGoodsMasterItem action fired", { item })
  if (item && !wallet.householdItems.includes(item)) wallet.householdItems.push(item)
  return strings.toast.itemAdded
}

export function deleteDailyGoodsMasterItemAction(state, item) {
  const wallet = currentWallet(state)
  console.log("deleteDailyGoodsMasterItem action fired", { item })
  wallet.deletedHouseholdItems = wallet.deletedHouseholdItems || []
  if (!wallet.deletedHouseholdItems.includes(item)) wallet.deletedHouseholdItems.push(item)
  return strings.toast.deleted
}

export function addSpecialEntryAction(state, form) {
  const label = getFormText(form, "label")
  const amount = getFormNumber(form, "amount")
  console.log("addSpecialEntry action fired", { label, amount })
  addEntry(state, { category: "special", label: label || "Special", amount })
  return strings.toast.added
}

export function saveFixedCostsAction(state, form) {
  const wallet = currentWallet(state)
  const rentAmount = getFormNumber(form, "rentAmount")
  const internetAmount = getFormNumber(form, "internetAmount")
  console.log("saveFixedCosts action fired", { rentAmount, internetAmount })
  wallet.fixedSettings = {
    rent: { amount: rentAmount },
    internet: { amount: internetAmount },
  }
  return strings.toast.saved
}

export function addVariableCostsAction(state, form) {
  const entries = [
    ["electricity", "Electricity"],
    ["gas", "Gas"],
    ["water", "Water"],
  ]
  console.log("addVariableCosts action fired")
  entries.forEach(([name, label]) => {
    const amount = getFormNumber(form, name)
    if (amount > 0) addEntry(state, { category: "variable", label, amount })
  })
  return strings.toast.added
}

export function deleteCurrentMonthEntryAction(state, entryId) {
  const wallet = currentWallet(state)
  console.log("deleteCurrentMonthEntry action fired", { entryId })
  wallet.entries = wallet.entries.filter((entry) => entry.id !== entryId)
  return strings.toast.deleted
}
