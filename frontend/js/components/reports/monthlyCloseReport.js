import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { escapeHtml, icon } from "../../utils/html.js"
import { renderMetricCard } from "../shared/metricCard.js"
import { renderCategoryTotalsTable } from "./categoryTotalsTable.js"

export function renderMonthlyCloseReport(viewModel) {
  return `
    <h2 class="report-heading">${strings.reports.monthlyCloseReport}</h2>
    <section class="report-card" data-component-uid="CMP-0310">
      <div class="annual-grid" data-component-uid="CMP-0311">
        ${renderMetricCard({ label: "Budget", value: amountText(viewModel.budget), componentUid: "CMP-0311" })}
        ${renderMetricCard({ label: "Expenses", value: amountText(viewModel.spent), componentUid: "CMP-0311" })}
        ${renderMetricCard({ label: "Remaining", value: amountText(viewModel.remaining), componentUid: "CMP-0311" })}
      </div>
      <div class="content-grid">
        <div class="chart-box" data-component-uid="CMP-0312">
          <h2>${strings.reports.breakdown}</h2>
          <canvas id="reportPie" aria-label="Report breakdown chart"></canvas>
        </div>
        <div>
          <h2>${strings.reports.categoryTotals}</h2>
          ${renderCategoryTotalsTable(viewModel)}
        </div>
      </div>
      <label class="field" data-component-uid="CMP-0314">
        <span class="field-label">${strings.common.comment}</span>
        <textarea id="monthlyComment" rows="3">${escapeHtml(viewModel.monthlyComment)}</textarea>
      </label>
      <div class="panel-actions no-print">
        <button class="primary-button" type="button" data-action="monthly-print-close" data-component-uid="CMP-0315" data-action-uid="ACT-0302">
          ${icon("file-down")}
          <span>${strings.reports.exportPdfAndClose}</span>
        </button>
        <button class="secondary-button" type="button" data-action="save-monthly-comment" data-component-uid="CMP-0316" data-action-uid="ACT-0301">
          ${icon("save")}
          <span>${strings.reports.saveComment}</span>
        </button>
      </div>
    </section>
  `
}
