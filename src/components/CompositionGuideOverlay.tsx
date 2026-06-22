import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import type { GuideMode } from '@/store/useAnalysisStore'

interface Region {
  id: string
  points: string
  label: string
  desc: string
  tension: string
}

interface CompositionGuideOverlayProps {
  mode: GuideMode
  imageWidth: number
  imageHeight: number
}

const PHI = 0.618
const PHI_INV = 1 - PHI

function buildThirdsRegions(w: number, h: number): Region[] {
  const cols = [0, w / 3, (2 * w) / 3, w]
  const rows = [0, h / 3, (2 * h) / 3, h]

  const labels = [
    ['左上', '上方', '右上'],
    ['左侧', '中心', '右侧'],
    ['左下', '下方', '右下'],
  ]

  const descs = [
    [
      '视觉起点，适合放置叙事性主体，引导视线进入画面',
      '提供纵向呼吸空间，天际线或地平线的理想位置',
      '视觉出口，呼应左侧主体，形成对角张力',
    ],
    [
      '视线自然着陆区，适合放置垂直主体',
      '最稳定也最静态的位置，对称构图的锚点',
      '视觉终点区，制造留白与余韵',
    ],
    [
      '画面的重力锚点，支撑整体构图平衡',
      '画面的基底，地面的重量感由此建立',
      '视觉落脚点，与左上形成对角平衡',
    ],
  ]

  const tensions = [
    [
      '★★★☆ 叙事张力',
      '★★☆☆ 呼吸张力',
      '★★★☆ 呼应张力',
    ],
    [
      '★★★☆ 纵向张力',
      '★☆☆☆ 静态张力',
      '★★☆☆ 留白张力',
    ],
    [
      '★★★★ 重力张力',
      '★★☆☆ 基底张力',
      '★★★☆ 平衡张力',
    ],
  ]

  const regions: Region[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      regions.push({
        id: `thirds-${r}-${c}`,
        points: `${cols[c]},${rows[r]} ${cols[c + 1]},${rows[r]} ${cols[c + 1]},${rows[r + 1]} ${cols[c]},${rows[r + 1]}`,
        label: labels[r][c],
        desc: descs[r][c],
        tension: tensions[r][c],
      })
    }
  }
  return regions
}

function buildGoldenRegions(w: number, h: number): Region[] {
  const xLines = [0, w * PHI_INV, w * PHI, w]
  const yLines = [0, h * PHI_INV, h * PHI, h]

  const labels = [
    ['左上黄金区', '上方黄金带', '右上黄金区'],
    ['左侧黄金带', '黄金螺旋心', '右侧黄金带'],
    ['左下黄金区', '下方黄金带', '右下黄金区'],
  ]

  const descs = [
    [
      '螺旋起始区域，视觉叙事从这里展开，天然引导视线流转',
      '比例 0.382 : 0.618 分割的上方窄带，提供精致的空间层次',
      '螺旋经过的第二个引力点，与左下形成黄金对角',
    ],
    [
      '窄长的黄金比例带，视线在此加速流向螺旋中心',
      '画面中最具吸引力的焦点，螺旋的汇聚处，1.618 的和谐在此凝结',
      '宽广的黄金比例带，视觉的休憩区，为螺旋提供呼吸',
    ],
    [
      '螺旋旋至的深度引力点，画面最富纵深感的位置',
      '黄金比例的宽幅基底，稳重而优雅的视觉地基',
      '螺旋的终点回望处，与左上起点形成完美对称',
    ],
  ]

  const tensions = [
    [
      '★★★★ 起始张力',
      '★★★☆ 层次张力',
      '★★★★ 引力张力',
    ],
    [
      '★★★☆ 流向张力',
      '★★★★★ 聚焦张力',
      '★★☆☆ 休憩张力',
    ],
    [
      '★★★★★ 纵深张力',
      '★★★☆ 稳重张力',
      '★★★☆ 对称张力',
    ],
  ]

  const regions: Region[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      regions.push({
        id: `golden-${r}-${c}`,
        points: `${xLines[c]},${yLines[r]} ${xLines[c + 1]},${yLines[r]} ${xLines[c + 1]},${yLines[r + 1]} ${xLines[c]},${yLines[r + 1]}`,
        label: labels[r][c],
        desc: descs[r][c],
        tension: tensions[r][c],
      })
    }
  }
  return regions
}

function buildDiagonalRegions(w: number, h: number): Region[] {
  const cx = w / 2
  const cy = h / 2

  return [
    {
      id: 'diag-top',
      points: `0,0 ${w},0 ${cx},${cy}`,
      label: '上方三角区',
      desc: '视线向中心汇聚的加速区，画面最轻盈的部分',
      tension: '★★★☆ 升腾张力',
    },
    {
      id: 'diag-right',
      points: `${w},0 ${w},${h} ${cx},${cy}`,
      label: '右侧三角区',
      desc: '视线从右向左的自然回流区，制造悬念与动态张力',
      tension: '★★★★ 回流张力',
    },
    {
      id: 'diag-bottom',
      points: `${w},${h} 0,${h} ${cx},${cy}`,
      label: '下方三角区',
      desc: '画面的重力区，视觉重量自然下沉，稳如磐石',
      tension: '★★★★ 沉降张力',
    },
    {
      id: 'diag-left',
      points: `0,${h} 0,0 ${cx},${cy}`,
      label: '左侧三角区',
      desc: '视线的自然入口，符合从左至右的阅读习惯',
      tension: '★★★☆ 导入张力',
    },
  ]
}

function GoldenSpiral({ w, h, animate }: { w: number; h: number; animate: boolean }) {
  const pathRef = useRef<SVGPathElement>(null)

  const d = useMemo(() => {
    const arc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)
      const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0
      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
    }

    const x0 = w * PHI
    const y0 = h * PHI_INV
    const r1 = w * PHI_INV
    const r2 = h * PHI_INV
    const r3 = w * PHI_INV * PHI_INV
    const r4 = h * PHI_INV * PHI_INV
    const r5 = w * PHI_INV * PHI_INV * PHI_INV

    return [
      arc(x0, y0, r1, Math.PI, Math.PI * 1.5),
      arc(x0 - r1 * PHI, y0, r2, Math.PI * 1.5, Math.PI * 2),
      arc(x0, y0 + r2 * PHI, r3, 0, Math.PI * 0.5),
      arc(x0 - r3, y0, r4, Math.PI * 0.5, Math.PI),
      arc(x0, y0 + r4 - r4 * PHI, r5, Math.PI * 1.5, Math.PI * 2),
    ].join(' ')
  }, [w, h])

  useEffect(() => {
    if (!pathRef.current || !animate) return
    const path = pathRef.current
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    path.style.animation = `draw-spiral 2s cubic-bezier(0.22, 1, 0.36, 1) forwards`
    path.style.animationDelay = '200ms'
  }, [d, animate])

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth={1}
      strokeLinecap="round"
    />
  )
}

function IntersectionPoints({ points, animate }: { points: { cx: number; cy: number }[]; animate: boolean }) {
  return (
    <>
      {points.map((pt, i) => (
        <g key={`pt-${i}`} style={{ opacity: animate ? 0 : 1 }} className={animate ? 'animate-fade-in' : ''}>
          <circle
            cx={pt.cx}
            cy={pt.cy}
            r={5}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={0.8}
            style={{ animationDelay: `${i * 100 + 300}ms`, animationFillMode: 'forwards' }}
          />
          <circle
            cx={pt.cx}
            cy={pt.cy}
            r={2.5}
            fill="rgba(255,255,255,0.6)"
            style={{ animationDelay: `${i * 100 + 400}ms`, animationFillMode: 'forwards' }}
          />
        </g>
      ))}
    </>
  )
}

function GuideLines({ lines, animate }: { lines: { x1: number; y1: number; x2: number; y2: number }[]; animate: boolean }) {
  return (
    <>
      {lines.map((line, i) => (
        <line
          key={`gl-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.8}
          strokeDasharray="8,6"
          style={{
            opacity: animate ? 0 : 1,
            animation: animate ? `fade-in-guide 0.6s ease-out ${i * 80}ms forwards` : undefined,
          }}
        />
      ))}
    </>
  )
}

export default function CompositionGuideOverlay({ mode, imageWidth, imageHeight }: CompositionGuideOverlayProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevModeRef = useRef<GuideMode>(null)

  const w = imageWidth
  const h = imageHeight

  useEffect(() => {
    if (mode !== prevModeRef.current && mode !== null) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      prevModeRef.current = mode
      return () => clearTimeout(timer)
    }
    prevModeRef.current = mode
  }, [mode])

  const regions = useMemo(() => {
    if (!mode) return []
    switch (mode) {
      case 'thirds': return buildThirdsRegions(w, h)
      case 'golden': return buildGoldenRegions(w, h)
      case 'diagonal': return buildDiagonalRegions(w, h)
      default: return []
    }
  }, [mode, w, h])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const guideLines = useMemo(() => {
    if (!mode) return null
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []

    if (mode === 'thirds') {
      lines.push(
        { x1: 0, y1: h / 3, x2: w, y2: h / 3 },
        { x1: 0, y1: (2 * h) / 3, x2: w, y2: (2 * h) / 3 },
        { x1: w / 3, y1: 0, x2: w / 3, y2: h },
        { x1: (2 * w) / 3, y1: 0, x2: (2 * w) / 3, y2: h },
      )
    }

    if (mode === 'golden') {
      lines.push(
        { x1: 0, y1: h * PHI_INV, x2: w, y2: h * PHI_INV },
        { x1: 0, y1: h * PHI, x2: w, y2: h * PHI },
        { x1: w * PHI_INV, y1: 0, x2: w * PHI_INV, y2: h },
        { x1: w * PHI, y1: 0, x2: w * PHI, y2: h },
      )
    }

    if (mode === 'diagonal') {
      lines.push(
        { x1: 0, y1: 0, x2: w, y2: h },
        { x1: w, y1: 0, x2: 0, y2: h },
      )
    }

    return lines
  }, [mode, w, h])

  const intersectionPoints = useMemo(() => {
    if (!mode || mode === 'diagonal') return []
    const points: { cx: number; cy: number }[] = []
    const xs = mode === 'thirds' ? [w / 3, (2 * w) / 3] : [w * PHI_INV, w * PHI]
    const ys = mode === 'thirds' ? [h / 3, (2 * h) / 3] : [h * PHI_INV, h * PHI]
    for (const x of xs) {
      for (const y of ys) {
        points.push({ cx: x, cy: y })
      }
    }
    return points
  }, [mode, w, h])

  const hovered = regions.find((r) => r.id === hoveredRegion)

  if (!mode) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredRegion(null)}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ mixBlendMode: 'difference' }}
      >
        <defs>
          <radialGradient id="regionHighlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
        </defs>

        {regions.map((region) => (
          <polygon
            key={region.id}
            points={region.points}
            fill={hoveredRegion === region.id ? 'url(#regionHighlight)' : 'transparent'}
            stroke="none"
            style={{ cursor: 'pointer', transition: 'fill 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
        ))}

        {guideLines && <GuideLines lines={guideLines} animate={isAnimating} />}

        {mode === 'golden' && <GoldenSpiral w={w} h={h} animate={isAnimating} />}

        {intersectionPoints.length > 0 && <IntersectionPoints points={intersectionPoints} animate={isAnimating} />}
      </svg>

      {hovered && (
        <div
          className="absolute pointer-events-none z-10 max-w-[240px] px-3.5 py-3 bg-neutral-900/90 border border-neutral-700/40 backdrop-blur-md animate-fade-in-tooltip"
          style={{
            left: Math.min(tooltipPos.x + 16, containerRef.current ? containerRef.current.clientWidth - 256 : tooltipPos.x + 16),
            top: Math.max(tooltipPos.y - 90, 8),
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="font-sans text-[11px] font-medium text-neutral-100 tracking-wide leading-tight">
              {hovered.label}
            </p>
            <span className="font-sans text-[9px] text-amber-300/80 tracking-wider whitespace-nowrap">
              {hovered.tension}
            </span>
          </div>
          <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">
            {hovered.desc}
          </p>
        </div>
      )}
    </div>
  )
}
