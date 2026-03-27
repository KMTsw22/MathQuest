import type { VisualData } from './agents/types'

const WRAP = (content: string, bg = '#f8fafc') =>
  `<div style="font-family:system-ui,sans-serif;background:${bg};border:1px solid #e2e8f0;border-radius:12px;padding:16px;overflow:hidden">${content}</div>`

// ── 1. Counting Objects (K-3) ───────────────────────────────────────────

function renderCountingObjects(d: Extract<VisualData, { type: 'counting_objects' }>): string {
  function emojiRow(count: number, emoji: string, label: string, border: string, bg: string): string {
    const rows: string[] = []
    for (let i = 0; i < count; i += 5) {
      const row = Array.from({ length: Math.min(5, count - i) }, () => emoji).join('')
      rows.push(`<div style="font-size:30px;letter-spacing:4px;line-height:1.3">${row}</div>`)
    }
    return `
      <div style="background:${bg};border:2.5px solid ${border};border-radius:10px;padding:10px 14px;text-align:center;min-width:64px">
        ${rows.join('')}
        <div style="font-size:12px;font-weight:700;color:#374151;margin-top:5px">${count} ${label}</div>
      </div>`
  }

  const opSymbol = d.operation === 'add' ? '+' : d.operation === 'subtract' ? '−' : ''

  if (!d.group_b || d.operation === 'count') {
    const { count, emoji, label } = d.group_a
    return WRAP(`
      <div style="text-align:center">
        <div style="font-size:13px;color:#6b7280;margin-bottom:8px;font-weight:600">Count the ${label}:</div>
        ${emojiRow(count, emoji, label, '#fbbf24', '#fffbeb')}
      </div>`, '#fffbeb')
  }

  return WRAP(`
    <div style="display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap">
      ${emojiRow(d.group_a.count, d.group_a.emoji, d.group_a.label, '#fbbf24', '#fffbeb')}
      <div style="font-size:36px;font-weight:900;color:#6b7280">${opSymbol}</div>
      ${emojiRow(d.group_b.count, d.group_b.emoji, d.group_b.label, '#86efac', '#f0fdf4')}
      <div style="font-size:36px;font-weight:900;color:#6b7280">=</div>
      <div style="background:#f1f5f9;border:2.5px dashed #94a3b8;border-radius:10px;padding:10px 20px;text-align:center;min-width:64px">
        <div style="font-size:34px;color:#94a3b8;font-weight:900">?</div>
      </div>
    </div>`, '#fff8f0')
}

// ── 2. Right Triangle ───────────────────────────────────────────────────

function renderRightTriangle(d: Extract<VisualData, { type: 'right_triangle' }>): string {
  const { leg_a, leg_b, find } = d
  const hyp = Math.sqrt(leg_a ** 2 + leg_b ** 2)

  const PAD = 44
  const MAX = 160
  const scale = Math.min(MAX / Math.max(leg_a, leg_b), 28)

  const px = PAD                      // right-angle vertex
  const py = PAD + leg_a * scale
  const ax = PAD                      // top of vertical leg (A)
  const ay = PAD
  const bx = PAD + leg_b * scale      // end of horizontal leg (B)
  const by = PAD + leg_a * scale
  const W = bx + PAD
  const H = py + PAD

  const aLabel = find === 'leg_a'      ? '?' : String(leg_a)
  const bLabel = find === 'leg_b'      ? '?' : String(leg_b)
  const hLabel = find === 'hypotenuse' ? '?  units' : `${hyp % 1 === 0 ? hyp : hyp.toFixed(2)} units`

  // Midpoint of hypotenuse + perpendicular offset for label
  const hmx = (ax + bx) / 2
  const hmy = (ay + by) / 2
  const angle = Math.atan2(by - ay, bx - ax)
  const offset = 18
  const lx = hmx - Math.sin(angle) * offset
  const ly = hmy + Math.cos(angle) * offset

  const RA = 12  // right angle mark size

  return WRAP(`
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#6b7280"/>
        </marker>
      </defs>

      <!-- Filled triangle -->
      <polygon points="${ax},${ay} ${px},${py} ${bx},${by}"
               fill="#EFF6FF" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Right-angle mark -->
      <path d="M${px},${py - RA} L${px + RA},${py - RA} L${px + RA},${py}"
            fill="none" stroke="#2563EB" stroke-width="1.8"/>

      <!-- Leg A label (vertical) -->
      <text x="${px - 14}" y="${(ay + py) / 2 + 5}" fill="#1d4ed8"
            font-size="14" font-weight="700" text-anchor="middle"
            transform="rotate(-90,${px - 14},${(ay + py) / 2 + 5})">${aLabel}</text>

      <!-- Leg B label (horizontal) -->
      <text x="${(px + bx) / 2}" y="${py + 20}" fill="#1d4ed8"
            font-size="14" font-weight="700" text-anchor="middle">${bLabel}</text>

      <!-- Hypotenuse label -->
      <text x="${lx}" y="${ly}" fill="${find === 'hypotenuse' ? '#dc2626' : '#059669'}"
            font-size="13" font-weight="800" text-anchor="middle">${hLabel}</text>

      <!-- Formula hint -->
      <text x="${W / 2}" y="${H - 6}" fill="#9ca3af"
            font-size="10" text-anchor="middle">a² + b² = c²</text>
    </svg>`, '#eff6ff')
}

// ── 3. Area Model ───────────────────────────────────────────────────────

function renderAreaModel(d: Extract<VisualData, { type: 'area_model' }>): string {
  const a = d.factor_a
  const b = d.factor_b

  // Integer × integer
  if (typeof a === 'number' && typeof b === 'number') {
    // Decompose each factor into tens + ones
    const aH = Math.floor(a / 10) * 10
    const aL = a % 10
    const bH = Math.floor(b / 10) * 10
    const bL = b % 10

    if (aH === 0 || bH === 0) {
      // Single-digit or can't decompose — show simple box
      return WRAP(`
        <div style="text-align:center">
          <div style="font-size:13px;color:#6b7280;margin-bottom:8px;font-weight:600">
            ${a} × ${b} = ?
          </div>
          <div style="display:inline-block;border:3px solid #2563eb;border-radius:6px;
                      background:#dbeafe;padding:20px 32px;font-size:22px;font-weight:900;color:#1e40af">
            ${a} × ${b}
          </div>
        </div>`)
    }

    const cols = [aH, aL].filter(v => v > 0)
    const rows = [bH, bL].filter(v => v > 0)
    const cells = rows.flatMap(r => cols.map(c => ({ r, c, val: r * c })))
    const total = cells.reduce((s, x) => s + x.val, 0)
    const bgCols = ['#dbeafe', '#bfdbfe']
    const bgRows = ['#dcfce7', '#bbf7d0']

    const colW = 72
    const rowH = 52

    const svgW = 44 + cols.length * colW
    const svgH = 44 + rows.length * rowH

    const colHeaders = cols.map((c, ci) =>
      `<rect x="${44 + ci * colW}" y="0" width="${colW}" height="36" rx="4" fill="${bgCols[ci % 2]}"/>
       <text x="${44 + ci * colW + colW / 2}" y="23" font-size="14" font-weight="700"
             fill="#1e40af" text-anchor="middle">${c}</text>`).join('')

    const rowHeaders = rows.map((r, ri) =>
      `<rect x="0" y="${44 + ri * rowH}" width="40" height="${rowH}" rx="4" fill="${bgRows[ri % 2]}"/>
       <text x="20" y="${44 + ri * rowH + rowH / 2 + 5}" font-size="14" font-weight="700"
             fill="#166534" text-anchor="middle">${r}</text>`).join('')

    const cellsSvg = rows.flatMap((r, ri) =>
      cols.map((c, ci) => {
        const x = 44 + ci * colW
        const y = 44 + ri * rowH
        const bg = ci === 0 && ri === 0 ? '#bfdbfe' : ci === 1 && ri === 0 ? '#93c5fd' :
                   ci === 0 ? '#bbf7d0' : '#86efac'
        return `<rect x="${x}" y="${y}" width="${colW}" height="${rowH}" fill="${bg}"
                      stroke="#fff" stroke-width="2"/>
                <text x="${x + colW / 2}" y="${y + rowH / 2 + 6}" font-size="15" font-weight="800"
                      fill="#1f2937" text-anchor="middle">${r * c}</text>`
      })
    ).join('')

    return WRAP(`
      <div>
        <div style="font-size:13px;color:#6b7280;margin-bottom:8px;font-weight:600;text-align:center">
          Area Model: ${a} × ${b}
        </div>
        <svg viewBox="0 0 ${svgW} ${svgH}" style="width:100%;max-width:${svgW}px;display:block;margin:0 auto"
             xmlns="http://www.w3.org/2000/svg">
          ${colHeaders}${rowHeaders}${cellsSvg}
        </svg>
        <div style="text-align:center;margin-top:10px;font-size:14px;color:#374151">
          ${cells.map(x => x.val).join(' + ')} = <strong style="color:#2563eb;font-size:16px">${total}</strong>
        </div>
      </div>`)
  }

  // Fraction × fraction
  return WRAP(`
    <div style="text-align:center">
      <div style="font-size:14px;font-weight:700;color:#374151;margin-bottom:10px">
        ${a} × ${b} = ?
      </div>
      <div style="font-size:13px;color:#6b7280">Use the area model to solve</div>
    </div>`)
}

// ── 4. Number Line ──────────────────────────────────────────────────────

function renderNumberLine(d: Extract<VisualData, { type: 'number_line' }>): string {
  const { start, end, step_denominator, highlight, jumps } = d
  const denom = step_denominator || 4
  const PAD = 36
  const W = 340
  const H = jumps && jumps.length > 0 ? 100 : 72
  const lineY = jumps && jumps.length > 0 ? 64 : 44
  const lineX0 = PAD
  const lineX1 = W - PAD
  const lineLen = lineX1 - lineX0

  function xOf(val: number) {
    return lineX0 + ((val - start) / (end - start)) * lineLen
  }

  const marks: number[] = []
  for (let n = start * denom; n <= end * denom; n++) {
    marks.push(n / denom)
  }

  const marksSvg = marks.map(v => {
    const x = xOf(v)
    const isInt = Number.isInteger(v)
    const label = isInt ? String(Math.round(v)) : `${Math.round(v * denom)}/${denom}`
    return `
      <line x1="${x}" y1="${lineY - (isInt ? 10 : 6)}" x2="${x}" y2="${lineY + (isInt ? 10 : 6)}"
            stroke="${isInt ? '#1f2937' : '#9ca3af'}" stroke-width="${isInt ? 2 : 1.2}"/>
      <text x="${x}" y="${lineY + 22}" font-size="${isInt ? 12 : 10}" font-weight="${isInt ? '700' : '400'}"
            fill="${isInt ? '#1f2937' : '#6b7280'}" text-anchor="middle">${label}</text>`
  }).join('')

  const highlightSvg = highlight != null ? (() => {
    const x = xOf(highlight)
    return `
      <circle cx="${x}" cy="${lineY}" r="7" fill="#dc2626"/>
      <line x1="${x}" y1="${lineY - 20}" x2="${x}" y2="${lineY - 9}" stroke="#dc2626" stroke-width="2"/>
      <text x="${x}" y="${lineY - 24}" font-size="13" font-weight="800" fill="#dc2626" text-anchor="middle">▼</text>`
  })() : ''

  const jumpsSvg = (jumps ?? []).map(j => {
    const x0 = xOf(j.from)
    const x1 = xOf(j.to)
    const cy = lineY - 28
    const cx = (x0 + x1) / 2
    return `
      <path d="M${x0},${lineY} Q${cx},${cy} ${x1},${lineY}"
            fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrBlue)"/>
      <text x="${cx}" y="${cy - 5}" font-size="11" font-weight="700" fill="#2563eb"
            text-anchor="middle">${j.label}</text>`
  }).join('')

  return WRAP(`
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#2563eb"/>
        </marker>
      </defs>
      <!-- Main line -->
      <line x1="${lineX0 - 8}" y1="${lineY}" x2="${lineX1 + 8}" y2="${lineY}"
            stroke="#1f2937" stroke-width="2.5"/>
      <!-- Arrowheads -->
      <polygon points="${lineX1+8},${lineY} ${lineX1+2},${lineY-4} ${lineX1+2},${lineY+4}"
               fill="#1f2937"/>
      ${marksSvg}
      ${highlightSvg}
      ${jumpsSvg}
    </svg>`)
}

// ── 5. Fraction Bar ─────────────────────────────────────────────────────

function parseFrac(s: string): [number, number] {
  const parts = s.split('/')
  return [parseInt(parts[0]), parseInt(parts[1] ?? '1')]
}

function renderFractionBar(d: Extract<VisualData, { type: 'fraction_bar' }>): string {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  const BAR_W = 280
  const BAR_H = 32
  const GAP = 10

  const bars = d.fractions.map((frac, fi) => {
    const [num, den] = parseFrac(frac)
    const y = fi * (BAR_H + GAP)

    const cells = Array.from({ length: den }, (_, i) => {
      const x = (i / den) * BAR_W
      const w = BAR_W / den
      const filled = i < num
      return `<rect x="${x}" y="${y}" width="${w}" height="${BAR_H}" rx="2"
                    fill="${filled ? COLORS[fi % COLORS.length] : '#f1f5f9'}"
                    stroke="#fff" stroke-width="2"/>`
    }).join('')

    const label = `<text x="-8" y="${y + BAR_H / 2 + 5}" font-size="13" font-weight="700"
                         fill="${COLORS[fi % COLORS.length]}" text-anchor="end">${frac}</text>`
    return cells + label
  })

  const H = d.fractions.length * (BAR_H + GAP)
  const equal = d.compare && d.fractions.length === 2 && (() => {
    const [n0, d0] = parseFrac(d.fractions[0])
    const [n1, d1] = parseFrac(d.fractions[1])
    return n0 * d1 === n1 * d0
  })()

  return WRAP(`
    <div>
      <div style="font-size:13px;color:#6b7280;margin-bottom:10px;font-weight:600;text-align:center">
        ${d.compare ? 'Are these equal?' : 'Fraction Bars'}
      </div>
      <svg viewBox="-36 0 ${BAR_W + 40} ${H + 4}" style="width:100%;max-width:${BAR_W + 40}px;display:block;margin:0 auto"
           xmlns="http://www.w3.org/2000/svg">
        ${bars.join('')}
      </svg>
      ${d.compare ? `<div style="text-align:center;margin-top:10px;font-size:14px;font-weight:700;color:${equal ? '#16a34a' : '#dc2626'}">
        ${d.fractions[0]} ${equal ? '=' : '≠'} ${d.fractions[1]} ${equal ? '✓' : '✗'}
      </div>` : ''}
    </div>`)
}

// ── 6. Tape Diagram ─────────────────────────────────────────────────────

function renderTapeDiagram(d: Extract<VisualData, { type: 'tape_diagram' }>): string {
  const total = d.parts.reduce((s, p) => s + p.value, 0)
  const BAR_W = 280
  const BAR_H = 44

  let cursor = 0
  const segments = d.parts.map(p => {
    const x = (cursor / total) * BAR_W
    const w = (p.value / total) * BAR_W
    cursor += p.value
    return `
      <rect x="${x}" y="0" width="${w}" height="${BAR_H}" fill="${p.color}"
            stroke="#fff" stroke-width="2" rx="0"/>
      <text x="${x + w / 2}" y="${BAR_H / 2 - 4}" font-size="13" font-weight="700"
            fill="#fff" text-anchor="middle">${p.value}</text>
      <text x="${x + w / 2}" y="${BAR_H / 2 + 10}" font-size="10" font-weight="600"
            fill="rgba(255,255,255,0.85)" text-anchor="middle">${p.label}</text>`
  }).join('')

  return WRAP(`
    <div>
      <div style="font-size:13px;color:#6b7280;margin-bottom:8px;font-weight:600;text-align:center">
        Total: ${d.total}
      </div>
      <svg viewBox="0 0 ${BAR_W} ${BAR_H + 28}" style="width:100%;max-width:${BAR_W}px;display:block;margin:0 auto"
           xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${BAR_W}" height="${BAR_H}" rx="6" fill="#f1f5f9"/>
        ${segments}
        <text x="${BAR_W / 2}" y="${BAR_H + 20}" font-size="12" fill="#6b7280"
              text-anchor="middle" font-weight="600">Total = ${total}</text>
      </svg>
    </div>`)
}

// ── 7. Place Value Chart ────────────────────────────────────────────────

function renderPlaceValue(d: Extract<VisualData, { type: 'place_value' }>): string {
  const n = Math.abs(d.number)
  const digits = String(n).split('').map(Number)
  const places = ['Billions','Hundred Millions','Ten Millions','Millions','Hundred Thousands',
                  'Ten Thousands','Thousands','Hundreds','Tens','Ones']
  const relevant = places.slice(places.length - digits.length)
  const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
                  '#06b6d4','#ec4899','#84cc16','#f97316','#6366f1']
  const colColors = COLORS.slice(COLORS.length - digits.length)

  const headers = relevant.map((p, i) =>
    `<th style="border:2px solid #fff;background:${colColors[i]};color:#fff;
                padding:8px 6px;font-size:12px;font-weight:700;min-width:60px;
                text-align:center">${p}</th>`).join('')

  const cells = digits.map((d, i) =>
    `<td style="border:2px solid #e5e7eb;background:#f9fafb;
                text-align:center;font-size:28px;font-weight:900;
                color:${colColors[i]};padding:12px 6px">${d}</td>`).join('')

  return WRAP(`
    <div style="overflow-x:auto">
      <table style="border-collapse:collapse;width:100%;font-family:system-ui">
        <thead><tr>${headers}</tr></thead>
        <tbody><tr>${cells}</tr></tbody>
      </table>
    </div>`)
}

// ── 8. Geometry Shape ───────────────────────────────────────────────────

function renderGeometryShape(d: Extract<VisualData, { type: 'geometry_shape' }>): string {
  const dims = d.dimensions
  const W = 260
  const H = 180

  if (d.shape === 'rectangle') {
    const w = dims.width ?? dims.w ?? 6
    const h = dims.height ?? dims.h ?? 4
    const scale = Math.min((W - 80) / w, (H - 80) / h)
    const rw = w * scale
    const rh = h * scale
    const rx = (W - rw) / 2
    const ry = (H - rh) / 2

    const wLabel = `${w}${dims.unit ?? ' units'}`
    const hLabel = `${h}${dims.unit ?? ' units'}`

    return WRAP(`
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto"
           xmlns="http://www.w3.org/2000/svg">
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}"
              fill="#dbeafe" stroke="#2563eb" stroke-width="2.5" rx="2"/>
        <!-- Width label -->
        <text x="${W / 2}" y="${ry - 10}" font-size="14" font-weight="700"
              fill="#1d4ed8" text-anchor="middle">${wLabel}</text>
        <!-- Height label -->
        <text x="${rx - 12}" y="${H / 2 + 5}" font-size="14" font-weight="700"
              fill="#1d4ed8" text-anchor="middle"
              transform="rotate(-90,${rx - 12},${H / 2 + 5})">${hLabel}</text>
        <!-- Find label -->
        <text x="${W / 2}" y="${ry + rh / 2 + 6}" font-size="15" font-weight="800"
              fill="#dc2626" text-anchor="middle">
          Find: ${d.find}
        </text>
      </svg>`)
  }

  if (d.shape === 'circle') {
    const r = dims.radius ?? dims.r ?? 5
    const scale = Math.min((W - 80) / (r * 2), (H - 60) / (r * 2))
    const cr = r * scale
    const cx = W / 2
    const cy = H / 2

    return WRAP(`
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="${cx}" cy="${cy}" r="${cr}" fill="#ede9fe" stroke="#7c3aed" stroke-width="2.5"/>
        <line x1="${cx}" y1="${cy}" x2="${cx + cr}" y2="${cy}"
              stroke="#7c3aed" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="${cx + cr / 2}" y="${cy - 8}" font-size="13" font-weight="700"
              fill="#7c3aed" text-anchor="middle">r = ${r}</text>
        <text x="${cx}" y="${cy + cr + 22}" font-size="14" font-weight="700"
              fill="#dc2626" text-anchor="middle">Find: ${d.find}</text>
      </svg>`)
  }

  if (d.shape === 'triangle') {
    const base = dims.base ?? 6
    const height = dims.height ?? dims.h ?? 4
    const scale = Math.min((W - 80) / base, (H - 80) / height)
    const bw = base * scale
    const bh = height * scale
    const x0 = (W - bw) / 2
    const y0 = (H - bh) / 2

    return WRAP(`
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto"
           xmlns="http://www.w3.org/2000/svg">
        <polygon points="${x0},${y0 + bh} ${x0 + bw / 2},${y0} ${x0 + bw},${y0 + bh}"
                 fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
        <!-- Base label -->
        <text x="${W / 2}" y="${y0 + bh + 20}" font-size="13" font-weight="700"
              fill="#065f46" text-anchor="middle">base = ${base}</text>
        <!-- Height line -->
        <line x1="${x0 + bw / 2}" y1="${y0}" x2="${x0 + bw / 2}" y2="${y0 + bh}"
              stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>
        <text x="${x0 + bw / 2 + 18}" y="${y0 + bh / 2 + 5}" font-size="13" font-weight="700"
              fill="#065f46">h = ${height}</text>
        <text x="${W / 2}" y="${y0 + bh + 38}" font-size="14" font-weight="700"
              fill="#dc2626" text-anchor="middle">Find: ${d.find}</text>
      </svg>`)
  }

  return WRAP(`<div style="text-align:center;padding:20px;color:#6b7280">${d.shape} — ${d.find}</div>`)
}

// ── 9. Equation Display ─────────────────────────────────────────────────

function renderEquationDisplay(d: Extract<VisualData, { type: 'equation_display' }>): string {
  return WRAP(`
    <div style="text-align:center;padding:12px 0">
      <div style="font-size:28px;font-weight:800;color:#1e40af;letter-spacing:2px;margin-bottom:8px">
        ${d.equation}
      </div>
      <div style="font-size:13px;color:#dc2626;font-weight:700">
        Find: <em>${d.find}</em>
      </div>
    </div>`, '#eff6ff')
}

// ── 10. Coordinate Plane ────────────────────────────────────────────────

function renderCoordinatePlane(d: Extract<VisualData, { type: 'coordinate_plane' }>): string {
  const [xMin, xMax] = d.x_range
  const [yMin, yMax] = d.y_range
  const PAD = 36
  const W = 260
  const H = 220
  const plotW = W - PAD * 2
  const plotH = H - PAD * 2

  function px(x: number) { return PAD + ((x - xMin) / (xMax - xMin)) * plotW }
  function py(y: number) { return H - PAD - ((y - yMin) / (yMax - yMin)) * plotH }

  const xTicks = Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i)
  const yTicks = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i)

  const gridLines = [
    ...xTicks.map(x => `<line x1="${px(x)}" y1="${PAD}" x2="${px(x)}" y2="${H - PAD}" stroke="#e5e7eb" stroke-width="1"/>`),
    ...yTicks.map(y => `<line x1="${PAD}" y1="${py(y)}" x2="${W - PAD}" y2="${py(y)}" stroke="#e5e7eb" stroke-width="1"/>`),
  ].join('')

  const axes = `
    <line x1="${PAD}" y1="${py(0)}" x2="${W - PAD}" y2="${py(0)}" stroke="#374151" stroke-width="2"/>
    <line x1="${px(0)}" y1="${PAD}" x2="${px(0)}" y2="${H - PAD}" stroke="#374151" stroke-width="2"/>`

  const xLabels = xTicks.filter(x => x !== 0).map(x =>
    `<text x="${px(x)}" y="${py(0) + 16}" font-size="10" fill="#6b7280" text-anchor="middle">${x}</text>`).join('')
  const yLabels = yTicks.filter(y => y !== 0).map(y =>
    `<text x="${px(0) - 8}" y="${py(y) + 4}" font-size="10" fill="#6b7280" text-anchor="end">${y}</text>`).join('')

  const lineSvg = d.line ? (() => {
    const { slope: m, y_intercept: b } = d.line
    const x0 = xMin; const y0 = m * x0 + b
    const x1 = xMax; const y1 = m * x1 + b
    return `<line x1="${px(x0)}" y1="${py(y0)}" x2="${px(x1)}" y2="${py(y1)}"
                  stroke="#2563eb" stroke-width="2.5"/>`
  })() : ''

  const pointsSvg = (d.points ?? []).map(p =>
    `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="5" fill="#dc2626" stroke="#fff" stroke-width="2"/>
     ${p.label ? `<text x="${px(p.x) + 8}" y="${py(p.y) - 6}" font-size="11" font-weight="700" fill="#dc2626">(${p.x},${p.y})</text>` : ''}`
  ).join('')

  return WRAP(`
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto"
         xmlns="http://www.w3.org/2000/svg">
      ${gridLines}${axes}${xLabels}${yLabels}${lineSvg}${pointsSvg}
    </svg>`)
}

// ── Main entry point ────────────────────────────────────────────────────

export function renderVisual(data: VisualData): string {
  try {
    switch (data.type) {
      case 'counting_objects':  return renderCountingObjects(data)
      case 'right_triangle':    return renderRightTriangle(data)
      case 'area_model':        return renderAreaModel(data)
      case 'number_line':       return renderNumberLine(data)
      case 'fraction_bar':      return renderFractionBar(data)
      case 'tape_diagram':      return renderTapeDiagram(data)
      case 'place_value':       return renderPlaceValue(data)
      case 'geometry_shape':    return renderGeometryShape(data)
      case 'equation_display':  return renderEquationDisplay(data)
      case 'coordinate_plane':  return renderCoordinatePlane(data)
      default:
        return WRAP(`<div style="color:#9ca3af;text-align:center;padding:16px">Visual not available</div>`)
    }
  } catch (e) {
    return WRAP(`<div style="color:#9ca3af;text-align:center;padding:16px">Visual render error</div>`)
  }
}
