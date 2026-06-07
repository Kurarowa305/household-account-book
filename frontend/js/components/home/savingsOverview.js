import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { renderMetricCard } from "../shared/metricCard.js"

export function renderSavingsOverview(viewModel) {
  return `
    <section class="savings-overview-section" data-component-uid="CMP-0101">
      <h2>${strings.home.savings}</h2>
      <div class="savings-overview-grid">
        ${renderMetricCard({ label: strings.home.totalSavings, value: amountText(viewModel.totalSavings), componentUid: "CMP-0102", className: "savings-overview-card" })}
        ${renderMetricCard({ label: strings.home.annualSavings, value: amountText(viewModel.annualSavings), componentUid: "CMP-0103", className: "savings-overview-card" })}
      </div>
    </section>
  `
}
