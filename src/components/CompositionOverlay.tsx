import type { CompositionLine } from '@/types/analysis'
import { useRef, useEffect } from 'react'

interface CompositionOverlayProps {
  lines: CompositionLine[]
  imageWidth: number
  imageHeight: number
}

export default function CompositionOverlay({ lines, imageWidth, imageHeight }: CompositionOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const paths = svgRef.current.querySelectorAll('line, circle')
    paths.forEach((path) => {
      const length = path instanceof SVGLineElement
        ? Math.sqrt(
            Math.pow(parseFloat(path.getAttribute('x2') || '0') - parseFloat(path.getAttribute('x1') || '0'), 2) +
            Math.pow(parseFloat(path.getAttribute('y2') || '0') - parseFloat(path.getAttribute('y1') || '0'), 2)
          )
        : 0
      if (path instanceof SVGLineElement) {
        path.style.strokeDasharray = `${length}`
        path.style.strokeDashoffset = `${length}`
        path.style.animation = `draw-line 1.5s ease-out forwards`
      }
    })
  }, [lines])

  const w = imageWidth
  const h = imageHeight

  const lineColor = (line: CompositionLine) => {
    if (line.strength < 0.1) return 'rgba(255,255,255,0.2)'
    if (line.strength < 0.2) return 'rgba(255,255,255,0.4)'
    return 'rgba(255,255,255,0.7)'
  }

  const strokeWidth = (line: CompositionLine) => {
    if (line.strength < 0.1) return 0.5
    if (line.strength < 0.2) return 0.8
    return 1.2
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      {lines.map((line, i) => {
        const x1 = line.startPoint.x * w
        const y1 = line.startPoint.y * h
        const x2 = line.endPoint.x * w
        const y2 = line.endPoint.y * h

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={lineColor(line)}
            strokeWidth={strokeWidth(line)}
            strokeLinecap="round"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        )
      })}

      {lines.filter((l) => l.strength >= 0.1).map((line, i) => {
        const cx = (line.startPoint.x + line.endPoint.x) / 2 * w
        const cy = (line.startPoint.y + line.endPoint.y) / 2 * h
        return (
          <circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r={3}
            fill="rgba(255,255,255,0.8)"
            style={{ animationDelay: `${i * 200 + 800}ms` }}
          />
        )
      })}
    </svg>
  )
}
