import { strings } from "../constants/strings.js"

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getFormText(form, name) {
  return String(form.elements[name]?.value || "").trim()
}

export function addShoppingFoodAction(state, form) {
  const label = getFormText(form, "label")
  console.log("addShoppingFood action fired", { label })
  state.shoppingList.push({ id: uid("shop"), type: "Food", label: label || "Food Item", store: "", price: null, done: false })
  return strings.toast.added
}

export function addShoppingDailyGoodsAction(state, form) {
  const label = getFormText(form, "label")
  console.log("addShoppingDailyGoods action fired", { label })
  state.shoppingList.push({ id: uid("shop"), type: "Daily Goods", label: label || "Daily Goods", store: "", price: null, done: false })
  return strings.toast.added
}

export function toggleLineScheduleAction(state, checked) {
  console.log("toggleLineSchedule action fired", { checked })
  state.lineSchedule = checked
  return checked ? strings.toast.scheduledEnabled : strings.toast.scheduledDisabled
}

export function sendLineMockAction(state) {
  const count = state.shoppingList.filter((item) => !item.done).length
  console.log("sendLineMock action fired", { count })
  return `${strings.shopping.lineSendQueued}: ${count} items`
}

export function toggleShoppingDoneAction(state, itemId, checked) {
  console.log("toggleShoppingDone action fired", { itemId, checked })
  const item = state.shoppingList.find((row) => row.id === itemId)
  if (item) item.done = checked
  return strings.toast.saved
}

export function deleteShoppingItemAction(state, itemId) {
  console.log("deleteShoppingItem action fired", { itemId })
  state.shoppingList = state.shoppingList.filter((item) => item.id !== itemId)
  return strings.toast.deleted
}
