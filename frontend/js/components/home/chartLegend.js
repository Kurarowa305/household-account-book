import { categoryMeta } from "../../constants/categoryMeta.js"
import { escapeHtml } from "../../utils/html.js"

export function renderChartLegend() {
  const primaryItems = [
    { label: categoryMeta.budget.label, color: categoryMeta.budget.color },
    { label: "Expenses", color: categoryMeta.food.color },
  ]
  const detailItems = Object.entries(categoryMeta)
    .filter(([key]) => !["budget", "savings"].includes(key))
    .map(([, meta]) => ({ label: meta.label, color: meta.color }))

  return `
    <div class="chart-legend" aria-label="Chart legend" data-component-uid="CMP-0106">
      <div class="chart-legend-primary">
        <div class="chart-legend-card chart-legend-summary">
          ${primaryItems
            .map(
              (item) => `
                <div class="chart-legend-row">
                  <span class="legend-swatch" style="background:${escapeHtml(item.color)}"></span>
                  <strong>${escapeHtml(item.label)}</strong>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
      <ul class="chart-legend-list">
        ${detailItems
          .map(
            (item) => `
              <li><span class="legend-swatch" style="background:${escapeHtml(item.color)}"></span>${escapeHtml(item.label)}</li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `
}
