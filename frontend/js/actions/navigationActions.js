export function navigateToHash(hash) {
  console.log("navigateScreen action fired", { hash })
  window.location.hash = hash
}

export function selectPortKeyCategory(state, category) {
  console.log("selectPortKeyCategory action fired", { category })
  state.historyCategory = category || "all"
  window.location.hash = "#/port-keys"
}

export function selectReportMonth(state, month) {
  console.log("selectReportMonth action fired", { month })
  state.selectedMonth = month
  state.inputDate = `${month}-15`
  window.location.hash = "#/reports"
}
