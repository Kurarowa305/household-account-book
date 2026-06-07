export function renderToast() {
  return `<div id="toast" class="toast" role="status" aria-live="polite" data-component-uid="CMP-0003"></div>`
}

let toastTimer = null

export function showToast(message) {
  const toast = document.querySelector("#toast")
  if (!toast) return
  toast.textContent = message
  toast.classList.add("is-visible")
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600)
}
