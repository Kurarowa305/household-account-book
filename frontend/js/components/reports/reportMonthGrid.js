import { strings } from "../../constants/strings.js"
import { escapeHtml } from "../../utils/html.js"
import { formatShortMonth } from "../../utils/formatters.js"

export function renderReportMonthGrid(viewModel) {
  return `
    <section class="report-months" data-component-uid="CMP-0301">
      <header>
        <h2>${strings.reports.monthlyReports}</h2>
      </header>
      <div class="report-month-grid">
        ${viewModel.annualRows.map((row) => renderReportMonthButton(row, viewModel.selectedMonth)).join("")}
      </div>
    </section>
  `
}

function renderReportMonthButton(row, selectedMonth) {
  const enabledAttributes = row.recorded ? `data-report-month="${escapeHtml(row.month)}" data-action-uid="ACT-0103"` : "disabled"
  return `
    <button class="report-month-button month-card ${row.month === selectedMonth ? "is-active" : ""} ${row.recorded ? "" : "is-disabled"}" type="button" data-component-uid="CMP-0302" ${enabledAttributes}>
      <span>${escapeHtml(formatShortMonth(row.month))}</span>
    </button>
  `
}
