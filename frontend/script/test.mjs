import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { createServer } from "node:http"
import { existsSync } from "node:fs"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendRoot = path.resolve(scriptDir, "..")
const repoRoot = path.resolve(frontendRoot, "..")

const tests = []

function test(name, fn) {
  tests.push({ name, fn })
}

function repoPath(...segments) {
  return path.join(repoRoot, ...segments)
}

function toModuleUrl(filePath) {
  return pathToFileURL(repoPath(filePath)).href
}

async function importModule(filePath) {
  return import(toModuleUrl(filePath))
}

async function listFiles(dir, predicate = () => true) {
  const base = repoPath(dir)
  const results = []

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
        continue
      }
      const relative = path.relative(repoRoot, absolute).split(path.sep).join("/")
      if (predicate(relative)) results.push(relative)
    }
  }

  await walk(base)
  return results.sort()
}

function assertIncludes(source, expected, message) {
  assert.ok(source.includes(expected), message || `Expected to include ${expected}`)
}

function assertUnique(items, label) {
  const seen = new Set()
  const duplicates = new Set()
  for (const item of items) {
    if (seen.has(item)) duplicates.add(item)
    seen.add(item)
  }
  assert.deepEqual(Array.from(duplicates), [], `${label} has duplicate values`)
}

function checkSyntax(filePath) {
  const result = spawnSync(process.execPath, ["--check", repoPath(filePath)], {
    encoding: "utf8",
  })
  assert.equal(
    result.status,
    0,
    `${filePath} has a syntax error\n${result.stdout || ""}${result.stderr || ""}`,
  )
}

async function loadRegistries() {
  const [{ routes, defaultRoute }, { screenRegistry }, { componentRegistry }, { actionRegistry }] = await Promise.all([
    importModule("frontend/js/constants/routes.js"),
    importModule("design/metadata/screenRegistry.js"),
    importModule("design/metadata/componentRegistry.js"),
    importModule("design/metadata/actionRegistry.js"),
  ])
  return { routes, defaultRoute, screenRegistry, componentRegistry, actionRegistry }
}

async function renderAllHtml() {
  const [{ routes }, { screenRegistry }, { renderAppShell }, { appMockState }, { categoryMeta }, { createPortKeysViewModel }] = await Promise.all([
    importModule("frontend/js/constants/routes.js"),
    importModule("design/metadata/screenRegistry.js"),
    importModule("frontend/js/components/shell/appShell.js"),
    importModule("frontend/js/mocks/appMockState.js"),
    importModule("frontend/js/constants/categoryMeta.js"),
    importModule("frontend/js/mocks/portKeysMock.js"),
  ])

  const shellHtml = routes.map((route) => renderAppShell(route.key)).join("\n")
  const screenHtml = screenRegistry.map((screen) => screen.render(screen.mock)).join("\n")
  const portKeyVariantHtml = ["all", ...Object.keys(categoryMeta)]
    .map((historyCategory) => {
      const state = structuredClone(appMockState)
      state.historyCategory = historyCategory
      const screen = screenRegistry.find((item) => item.key === "portKeys")
      return screen.render(createPortKeysViewModel(state))
    })
    .join("\n")

  return `${shellHtml}\n${screenHtml}\n${portKeyVariantHtml}`
}

async function withStaticServer(callback) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1")
      const requestedPath = decodeURIComponent(url.pathname).replace(/^\/+/, "")
      const filePath = path.normalize(path.join(repoRoot, requestedPath || "frontend/index.html"))

      if (!filePath.startsWith(repoRoot)) {
        response.writeHead(403)
        response.end("Forbidden")
        return
      }

      const body = await readFile(filePath)
      response.writeHead(200, { "content-type": contentType(filePath) })
      response.end(body)
    } catch {
      response.writeHead(404)
      response.end("Not Found")
    }
  })

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  const { port } = server.address()

  try {
    await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8"
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8"
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) return "text/javascript; charset=utf-8"
  return "text/plain; charset=utf-8"
}

test("FE-P0-001: frontend and metadata modules are syntax-valid", async () => {
  const files = [
    ...(await listFiles("frontend/js", (file) => file.endsWith(".js"))),
    ...(await listFiles("design/metadata", (file) => file.endsWith(".js"))),
  ]

  files.forEach(checkSyntax)
})

test("FE-P0-001: importable frontend module graph loads outside the browser entry", async () => {
  const files = await listFiles("frontend/js", (file) => file.endsWith(".js") && file !== "frontend/js/appMain.js")
  for (const file of files) await importModule(file)

  await Promise.all([
    importModule("design/metadata/screenRegistry.js"),
    importModule("design/metadata/componentRegistry.js"),
    importModule("design/metadata/actionRegistry.js"),
  ])
})

test("FE-P0-002: frontend entry HTML keeps required root, CSS, and app module", async () => {
  const html = await readFile(repoPath("frontend/index.html"), "utf8")

  assertIncludes(html, 'id="root"', "frontend/index.html must contain #root")
  assertIncludes(html, 'href="./css/app.css"', "frontend/index.html must load app.css")
  assertIncludes(html, 'src="./js/appMain.js"', "frontend/index.html must load appMain.js")
})

test("FE-P0-003: app.css imports existing files in the expected order", async () => {
  const appCssPath = repoPath("frontend/css/app.css")
  const css = await readFile(appCssPath, "utf8")
  const imports = Array.from(css.matchAll(/@import\s+url\(["'](.+?)["']\);/g)).map((match) => match[1])

  assert.equal(imports[0], "./base.css", "base.css must be imported first")
  assert.equal(imports.at(-1), "./responsive.css", "responsive.css must be imported last")

  for (const importPath of imports) {
    const resolved = path.resolve(path.dirname(appCssPath), importPath)
    assert.ok(existsSync(resolved), `Missing CSS import target: ${importPath}`)
  }

  const componentIndexes = imports.map((value, index) => [value, index]).filter(([value]) => value.startsWith("./components/")).map(([, index]) => index)
  const pageIndexes = imports.map((value, index) => [value, index]).filter(([value]) => value.startsWith("./pages/")).map(([, index]) => index)
  const responsiveIndex = imports.indexOf("./responsive.css")

  assert.ok(componentIndexes.every((index) => index > 0), "component CSS must come after base.css")
  assert.ok(componentIndexes.every((index) => pageIndexes.every((pageIndex) => index < pageIndex)), "component CSS must come before page CSS")
  assert.ok(pageIndexes.every((index) => index < responsiveIndex), "page CSS must come before responsive.css")
})

test("FE-P0-004: routes and screenRegistry stay aligned", async () => {
  const { routes, screenRegistry } = await loadRegistries()

  assert.equal(routes.length, screenRegistry.length, "routes and screenRegistry must have the same number of screens")

  for (const route of routes) {
    const screen = screenRegistry.find((item) => item.uid === route.screenUid)
    assert.ok(screen, `Missing screenRegistry entry for ${route.screenUid}`)
    assert.equal(screen.key, route.key, `${route.screenUid} key mismatch`)
    assert.equal(screen.route, route.hash, `${route.screenUid} route mismatch`)
  }
})

test("FE-P0-005: default route and fallback route resolve to Home", async () => {
  const { defaultRoute } = await importModule("frontend/js/constants/routes.js")
  const { getRouteByHash, ensureDefaultHash } = await importModule("frontend/js/router.js")

  assert.equal(defaultRoute.hash, "#/home", "defaultRoute must be #/home")
  assert.equal(getRouteByHash("").hash, "#/home", "empty hash must resolve to Home")
  assert.equal(getRouteByHash("#/missing").hash, "#/home", "unknown hash must resolve to Home")

  globalThis.window = { location: { hash: "" } }
  ensureDefaultHash()
  assert.equal(globalThis.window.location.hash, "#/home", "ensureDefaultHash must set #/home when hash is empty")

  globalThis.window = { location: { hash: "#/reports" } }
  ensureDefaultHash()
  assert.equal(globalThis.window.location.hash, "#/reports", "ensureDefaultHash must not overwrite an existing hash")
})

test("FE-P0-006: all registered screens render their screen UID", async () => {
  const { screenRegistry } = await loadRegistries()

  for (const screen of screenRegistry) {
    assert.equal(typeof screen.render, "function", `${screen.uid} must provide a render function`)
    const html = screen.render(screen.mock)
    assert.equal(typeof html, "string", `${screen.uid} render result must be a string`)
    assert.ok(html.trim().length > 0, `${screen.uid} render result must not be empty`)
    assertIncludes(html, `data-screen-uid="${screen.uid}"`, `${screen.uid} render result must include its data-screen-uid`)
  }
})

test("FE-P0-007: app shell renders shared application regions", async () => {
  const [{ defaultRoute }, { renderAppShell }] = await Promise.all([
    importModule("frontend/js/constants/routes.js"),
    importModule("frontend/js/components/shell/appShell.js"),
  ])
  const html = renderAppShell(defaultRoute.key)

  assertIncludes(html, 'data-component-uid="CMP-0001"', "app shell component UID is missing")
  assertIncludes(html, 'id="app"', "app shell must contain #app")
  assertIncludes(html, 'id="toast"', "app shell must contain toast")
  assertIncludes(html, 'id="activeWalletLabel"', "app shell must contain the active wallet label")
})

test("FE-P0-008: registered Action UIDs exist in rendered DOM", async () => {
  const [{ actionRegistry }, html] = await Promise.all([loadRegistries(), renderAllHtml()])

  for (const action of actionRegistry) {
    assertIncludes(html, `data-action-uid="${action.uid}"`, `${action.uid} is registered but not rendered`)
  }
})

test("FE-P0-009: registered Component UIDs exist in rendered DOM", async () => {
  const [{ componentRegistry }, html] = await Promise.all([loadRegistries(), renderAllHtml()])

  for (const component of componentRegistry) {
    assertIncludes(html, `data-component-uid="${component.uid}"`, `${component.uid} is registered but not rendered`)
  }
})

test("FE-P0-010: screen, component, and action UIDs are unique", async () => {
  const { screenRegistry, componentRegistry, actionRegistry } = await loadRegistries()

  assertUnique(screenRegistry.map((screen) => screen.uid), "screenRegistry.uid")
  assertUnique(componentRegistry.map((component) => component.uid), "componentRegistry.uid")
  assertUnique(actionRegistry.map((action) => action.uid), "actionRegistry.uid")
})

test("FE-P0-011: display string catalog is available to render modules", async () => {
  const { strings } = await importModule("frontend/js/constants/strings.js")

  assert.equal(strings.app.title, "Household Book", "app title must be defined in strings.js")
  assert.ok(strings.common.save, "common save label must be defined in strings.js")
  assert.ok(strings.toast.saved, "toast saved label must be defined in strings.js")
})

test("FE-P0-012: frontend routes are reachable through a local HTTP server", async () => {
  const { routes } = await importModule("frontend/js/constants/routes.js")

  await withStaticServer(async (baseUrl) => {
    for (const route of routes) {
      const response = await fetch(`${baseUrl}/frontend/index.html${route.hash}`)
      const html = await response.text()

      assert.equal(response.status, 200, `${route.hash} must return frontend/index.html`)
      assertIncludes(html, 'id="root"', `${route.hash} must return the SPA root`)
      assertIncludes(html, './js/appMain.js', `${route.hash} must return the app module reference`)
    }

    const cssResponse = await fetch(`${baseUrl}/frontend/css/app.css`)
    assert.equal(cssResponse.status, 200, "app.css must be reachable over HTTP")

    const appResponse = await fetch(`${baseUrl}/frontend/js/appMain.js`)
    assert.equal(appResponse.status, 200, "appMain.js must be reachable over HTTP")
  })
})

test("FE-P0-013: frontend JavaScript does not depend on unimplemented external data layers", async () => {
  const files = await listFiles("frontend/js", (file) => file.endsWith(".js"))
  const forbiddenPatterns = [
    ["fetch(", /\bfetch\s*\(/],
    ["XMLHttpRequest", /\bXMLHttpRequest\b/],
    ["localStorage", /\blocalStorage\b/],
    ["sessionStorage", /\bsessionStorage\b/],
    ["indexedDB", /\bindexedDB\b/],
    ["sendBeacon", /\bsendBeacon\s*\(/],
  ]

  for (const file of files) {
    const source = await readFile(repoPath(file), "utf8")
    for (const [label, pattern] of forbiddenPatterns) {
      assert.ok(!pattern.test(source), `${file} uses ${label}, but API/adapter/persistence layers are not implemented yet`)
    }
  }
})

let failures = 0

for (const { name, fn } of tests) {
  try {
    await fn()
    console.log(`ok - ${name}`)
  } catch (error) {
    failures += 1
    console.error(`not ok - ${name}`)
    console.error(error?.stack || error)
  }
}

if (failures > 0) {
  console.error(`\n${failures} frontend P0 test(s) failed.`)
  process.exit(1)
}

console.log(`\n${tests.length} frontend P0 tests passed.`)
