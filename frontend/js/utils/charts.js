import { categoryMeta } from "../constants/categoryMeta.js"
import { shortAmount } from "./formatters.js"

function setupCanvas(root, id) {
  const canvas = root.querySelector(`#${id}`)
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.max(320, Math.floor(rect.width * dpr))
  canvas.height = Math.max(260, Math.floor(rect.height * dpr))
  const ctx = canvas.getContext("2d")
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { canvas, ctx, width: canvas.width / dpr, height: canvas.height / dpr }
}

function drawRingBackground(ctx, cx, cy, radius, width, color = "#eef3ef") {
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = "butt"
  ctx.stroke()
}

function drawRingSlice(ctx, cx, cy, radius, width, start, end, color) {
  if (end <= start) return
  ctx.beginPath()
  ctx.arc(cx, cy, radius, start, end)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = "butt"
  ctx.stroke()
}

export function drawDoublePie(root, id, viewModel) {
  const setup = setupCanvas(root, id)
  if (!setup) return
  const { ctx, width, height } = setup
  const budget = viewModel.budget
  const spent = viewModel.spent
  const breakdown = viewModel.breakdown
  const cx = width / 2
  const cy = height / 2
  const outerRadius = Math.min(width, height) * 0.36
  const innerRadius = outerRadius * 0.69
  const ringWidth = Math.max(22, outerRadius * 0.16)

  ctx.clearRect(0, 0, width, height)
  drawRingBackground(ctx, cx, cy, outerRadius, ringWidth, categoryMeta.budget.color)
  drawRingBackground(ctx, cx, cy, innerRadius, ringWidth, "#eef3ef")

  if (budget > 0) {
    const expenseAngle = Math.min(spent / budget, 1) * Math.PI * 2
    drawRingSlice(ctx, cx, cy, outerRadius, ringWidth, -Math.PI / 2, -Math.PI / 2 + expenseAngle, categoryMeta.food.color)
    if (spent > budget) drawRingSlice(ctx, cx, cy, outerRadius, ringWidth, -Math.PI / 2, Math.PI * 1.5, "#b7353d")
  }

  const breakdownTotal = breakdown.reduce((sum, item) => sum + item.value, 0)
  if (breakdownTotal > 0) {
    let start = -Math.PI / 2
    breakdown.forEach((item) => {
      const angle = (item.value / breakdownTotal) * Math.PI * 2
      drawRingSlice(ctx, cx, cy, innerRadius, ringWidth, start, start + angle, item.color)
      start += angle
    })
  }

  ctx.fillStyle = "#fff"
  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius - ringWidth * 0.72, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#1f2428"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.font = "700 16px sans-serif"
  ctx.fillText("Expenditure", cx, cy - 14)
  ctx.font = "800 25px sans-serif"
  ctx.fillText(`${shortAmount(spent)} yen`, cx, cy + 18)
}

export function drawPie(root, id, data) {
  const setup = setupCanvas(root, id)
  if (!setup) return
  const { ctx, width, height } = setup
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0)
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) * 0.34
  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = "#f0f4ef"
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  if (!total) {
    ctx.fillStyle = "#66706a"
    ctx.font = "700 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("No data", cx, cy)
    return
  }

  let start = -Math.PI / 2
  data.forEach((item) => {
    const angle = (Number(item.value || 0) / total) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, start, start + angle)
    ctx.closePath()
    ctx.fillStyle = item.color
    ctx.fill()
    start += angle
  })
}

export function drawLine(root, id, data) {
  const setup = setupCanvas(root, id)
  if (!setup) return
  const { ctx, width, height } = setup
  const padding = 38
  const values = data.map((item) => Number(item.value || 0))
  const max = Math.max(...values, 1000)
  const plotW = width - padding * 2
  const plotH = height - padding * 2
  ctx.clearRect(0, 0, width, height)

  ctx.strokeStyle = "#d9ded8"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  ctx.strokeStyle = categoryMeta.food.color
  ctx.lineWidth = 3
  ctx.beginPath()
  data.forEach((item, index) => {
    const x = padding + (plotW / Math.max(data.length - 1, 1)) * index
    const y = height - padding - (Number(item.value || 0) / max) * plotH
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  ctx.fillStyle = "#1f2428"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"
  data.forEach((item, index) => {
    const x = padding + (plotW / Math.max(data.length - 1, 1)) * index
    const y = height - padding - (Number(item.value || 0) / max) * plotH
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = categoryMeta.food.color
    ctx.fill()
    if (index % 2 === 0) {
      ctx.fillStyle = "#66706a"
      ctx.fillText(item.label, x, height - 14)
    }
  })
}

export function drawBar(root, id, annualRows) {
  const setup = setupCanvas(root, id)
  if (!setup) return
  const { ctx, width, height } = setup
  const totals = new Map()
  annualRows.forEach((row) => {
    Object.entries(row.dailyItems || {}).forEach(([item, amount]) => {
      totals.set(item, (totals.get(item) || 0) + Number(amount || 0))
    })
  })
  const rows = Array.from(totals.entries())
    .map(([item, amount]) => ({ item, amount }))
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  ctx.clearRect(0, 0, width, height)
  if (!rows.length) {
    ctx.fillStyle = "#66706a"
    ctx.font = "700 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("No data", width / 2, height / 2)
    return
  }

  const padding = 42
  const max = Math.max(...rows.map((row) => row.amount), 1000)
  const barGap = 12
  const barW = Math.max(22, (width - padding * 2 - barGap * (rows.length - 1)) / rows.length)
  const colors = ["#247a73", "#c85e4a", "#b97818", "#505aa8", "#3d8050", "#7d5c2f", "#7a5875", "#4d6f86"]

  rows.forEach((row, index) => {
    const x = padding + index * (barW + barGap)
    const barH = ((height - padding * 2) * row.amount) / max
    const y = height - padding - barH
    ctx.fillStyle = colors[index % colors.length]
    ctx.fillRect(x, y, barW, barH)
    ctx.fillStyle = "#66706a"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(row.item.slice(0, 8), x + barW / 2, height - 14)
  })
}
