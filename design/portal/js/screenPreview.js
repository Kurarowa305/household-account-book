export function renderScreenPreview(screen, previewRoot) {
  previewRoot.innerHTML = screen.render(screen.mock)
  screen.mount?.(previewRoot, screen.mock)
  if (window.lucide) window.lucide.createIcons()
}

export function bindPreviewInspection(previewRoot, onSelect) {
  previewRoot.addEventListener(
    "click",
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      const componentElement = event.target.closest("[data-component-uid]")
      const screenElement = event.target.closest("[data-screen-uid]")
      const actionElement = event.target.closest("[data-action-uid]")
      const selectedElement = componentElement || screenElement
      onSelect({
        element: selectedElement,
        screenUid: screenElement?.dataset.screenUid || "",
        componentUid: componentElement?.dataset.componentUid || "",
        actionUid: actionElement?.dataset.actionUid || "",
      })
    },
    true,
  )

  previewRoot.addEventListener(
    "submit",
    (event) => {
      event.preventDefault()
      event.stopPropagation()
    },
    true,
  )
}
