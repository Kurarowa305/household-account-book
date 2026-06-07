import { actionRegistry } from "../../metadata/actionRegistry.js"
import { componentRegistry } from "../../metadata/componentRegistry.js"
import { screenRegistry } from "../../metadata/screenRegistry.js"
import { renderActionInspector } from "./actionInspector.js"
import { renderComponentInspector } from "./componentInspector.js"
import { renderScreenInspector } from "./screenInspector.js"
import { bindPreviewInspection, renderScreenPreview } from "./screenPreview.js"
import { renderStyleInspector } from "./styleInspector.js"

const screenList = document.querySelector("#screenList")
const previewRoot = document.querySelector("#previewRoot")
const previewTitle = document.querySelector("#previewTitle")
const previewSource = document.querySelector("#previewSource")
const screenInspector = document.querySelector("#screenInspector")
const componentInspector = document.querySelector("#componentInspector")
const actionInspector = document.querySelector("#actionInspector")
const styleInspector = document.querySelector("#styleInspector")

let activeScreen = screenRegistry[0]
let selectedElement = null

function renderPortal() {
  renderScreenList()
  previewTitle.textContent = activeScreen.title
  previewSource.textContent = activeScreen.source
  renderScreenPreview(activeScreen, previewRoot)
  clearSelection()
}

function renderScreenList() {
  screenList.innerHTML = screenRegistry
    .map(
      (screen) => `
        <button type="button" class="${screen.uid === activeScreen.uid ? "is-active" : ""}" data-screen-uid="${screen.uid}">
          <strong>${screen.title}</strong><br />
          <span>${screen.uid}</span>
        </button>
      `,
    )
    .join("")
}

function clearSelection() {
  selectedElement = null
  renderScreenInspector(screenInspector, activeScreen, activeScreen.uid)
  renderComponentInspector(componentInspector, null, "")
  renderActionInspector(actionInspector, null, "")
  renderStyleInspector(styleInspector, null)
}

screenList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-screen-uid]")
  if (!button) return
  activeScreen = screenRegistry.find((screen) => screen.uid === button.dataset.screenUid) || screenRegistry[0]
  renderPortal()
})

bindPreviewInspection(previewRoot, ({ element, screenUid, componentUid, actionUid }) => {
  selectedElement?.classList.remove("is-design-selected")
  selectedElement = element
  selectedElement?.classList.add("is-design-selected")
  const screen = screenRegistry.find((item) => item.uid === screenUid)
  const component = componentRegistry.find((item) => item.uid === componentUid)
  const action = actionRegistry.find((item) => item.uid === actionUid)
  renderScreenInspector(screenInspector, screen, screenUid)
  renderComponentInspector(componentInspector, component, componentUid)
  renderActionInspector(actionInspector, action, actionUid)
  renderStyleInspector(styleInspector, element)
})

renderPortal()
