import { strings } from "../../constants/strings.js"
import { amountText, formatMonth } from "../../utils/formatters.js"
import { escapeHtml, icon } from "../../utils/html.js"
import { renderMetricCard } from "../shared/metricCard.js"

export function renderAnnualReport(viewModel) {
  return `
    <h2 class="report-heading">${strings.reports.annualReport}</h2>
    <section class="report-card" data-component-uid="CMP-0320">
      <div class="annual-grid" data-component-uid="CMP-0321">
        ${renderMetricCard({ label: strings.reports.totalBudgets, value: amountText(viewModel.annualBudget), componentUid: "CMP-0321" })}
        ${renderMetricCard({ label: strings.reports.totalExpenses, value: amountText(viewModel.annualSpent), componentUid: "CMP-0321" })}
        ${renderMetricCard({ label: strings.home.totalSavings, value: amountText(viewModel.annualSavings), componentUid: "CMP-0321" })}
      </div>
      <div class="content-grid">
        <div class="chart-box" data-component-uid="CMP-0322">
          <h2>${strings.reports.foodTrend}</h2>
          <canvas id="foodLine" aria-label="Food trend chart"></canvas>
        </div>
        <div class="chart-box" data-component-uid="CMP-0323">
          <h2>${strings.reports.dailyGoodsStack}</h2>
          <canvas id="dailyBar" aria-label="Daily goods chart"></canvas>
        </div>
      </div>
      <div>
        <h2>${strings.reports.monthlyComments}</h2>
        <div class="month-comments">
          ${viewModel.annualRows
            .map(
              (row) => `
                <textarea class="month-comment" data-annual-comment="${escapeHtml(row.month)}" data-component-uid="CMP-0324" data-action-uid="ACT-0303" aria-label="${escapeHtml(formatMonth(row.month))} comment">${escapeHtml(row.comment || "")}</textarea>
              `,
            )
            .join("")}
        </div>
      </div>
      <div class="panel-actions no-print">
        <button class="primary-button" type="button" data-action="annual-print" data-component-uid="CMP-0325" data-action-uid="ACT-0304">
          ${icon("file-down")}
          <span>${strings.reports.exportAnnualPdf}</span>
        </button>
        <button class="danger-button" type="button" data-action="delete-year" data-component-uid="CMP-0326" data-action-uid="ACT-0305">
          ${icon("trash-2")}
          <span>${strings.reports.deleteData}</span>
        </button>
        <button class="secondary-button" type="button" data-action="new-fiscal-year" data-component-uid="CMP-0327" data-action-uid="ACT-0306">
          ${icon("calendar-plus")}
          <span>${strings.reports.startNewYear}</span>
        </button>
      </div>
    </section>
  `
}
