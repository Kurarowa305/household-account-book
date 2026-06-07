import { strings } from "../constants/strings.js"

export function saveMonthlyCommentAction(state, root) {
  const value = root.querySelector("#monthlyComment")?.value.trim() || ""
  console.log("saveMonthlyComment action fired", { value })
  state.monthlyComment = value
  return strings.toast.commentSaved
}

export function exportMonthlyReportMockAction(state, root) {
  const value = root.querySelector("#monthlyComment")?.value.trim() || ""
  console.log("exportMonthlyReportMock action fired", { month: state.selectedMonth, comment: value })
  state.monthlyComment = value
  return "Monthly report export mocked"
}

export function editAnnualCommentAction(state, target) {
  const month = target.dataset.annualComment
  const record = state.annualRecords.find((item) => item.month === month)
  console.log("editAnnualComment action fired", { month, comment: target.value })
  if (record) record.comment = target.value.trim()
  return strings.toast.commentSaved
}

export function exportAnnualReportMockAction(state) {
  console.log("exportAnnualReportMock action fired", { fiscalYear: state.fiscalYear })
  return "Annual report export mocked"
}

export function deleteYearMockAction(state) {
  console.log("deleteYearMock action fired", { fiscalYear: state.fiscalYear })
  state.archives = []
  return "Year data delete mocked"
}

export function startNewFiscalYearMockAction(state) {
  console.log("startNewFiscalYearMock action fired", { fiscalYear: state.fiscalYear + 1 })
  state.fiscalYear += 1
  state.selectedMonth = `${state.fiscalYear}-01`
  state.activeMonth = state.selectedMonth
  state.inputDate = `${state.fiscalYear}-01-15`
  return "New fiscal year mocked"
}
