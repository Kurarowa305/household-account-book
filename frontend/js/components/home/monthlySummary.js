import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { escapeHtml } from "../../utils/html.js"
import { renderChartLegend } from "./chartLegend.js"

export function renderMonthlySummary(viewModel) {
  return `
    <section class="summary-section" data-component-uid="CMP-0104">
      <header>
        <h2>${strings.home.monthlySummary}</h2>
      </header>
      <div class="summary-grid">
        <div class="chart-box chart-shell" data-component-uid="CMP-0105">
          <canvas id="monthlyDoublePie" aria-label="Monthly expenditure chart"></canvas>
          ${renderChartLegend()}
        </div>
        <div class="summary-copy" data-component-uid="CMP-0107">
          <div class="goal-comment">
            <p class="metric-meta">${strings.home.goalComment}</p>
            <strong>${escapeHtml(viewModel.goalComment || strings.home.noGoalComment)}</strong>
          </div>
          <div>
            <div class="summary-line"><span>${strings.home.budgets}</span><strong>${amountText(viewModel.budget)}</strong></div>
            <div class="summary-line"><span>${strings.home.expenses}</span><strong>${amountText(viewModel.spent)}</strong></div>
            <hr class="summary-rule" />
            <div class="summary-line"><span>${strings.home.remaining}</span><strong>${amountText(viewModel.remaining)}</strong></div>
          </div>
        </div>
      </div>
    </section>
  `
}
