import { escapeHtml } from "../../utils/html.js"

export function renderInputField({ label, name, type = "text", value = "", placeholder = "", attributes = "" }) {
  return `
    <label class="field">
      <span class="field-label">${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${attributes} />
    </label>
  `
}

export function renderTextareaField({ label, name, rows = 3, value = "", placeholder = "", attributes = "" }) {
  return `
    <label class="field full">
      <span class="field-label">${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" rows="${rows}" placeholder="${escapeHtml(placeholder)}" ${attributes}>${escapeHtml(value)}</textarea>
    </label>
  `
}

export function renderSelectField({ label, name, options, attributes = "" }) {
  return `
    <label class="field">
      <span class="field-label">${escapeHtml(label)}</span>
      <select name="${escapeHtml(name)}" ${attributes}>
        ${options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("")}
      </select>
    </label>
  `
}
