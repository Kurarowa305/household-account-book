import { escapeHtml } from "../../utils/html.js"

export function renderDataTable({ headers, rows, footer = "", componentUid = "CMP-9003" }) {
  return `
    <div class="data-table-wrap" data-component-uid="${escapeHtml(componentUid)}">
      <table class="data-table">
        <thead>
          <tr>${headers.map((header) => `<th class="${escapeHtml(header.className || "")}">${escapeHtml(header.label)}</th>`).join("")}</tr>
        </thead>
        <tbody>${rows.join("")}</tbody>
        ${footer}
      </table>
    </div>
  `
}
