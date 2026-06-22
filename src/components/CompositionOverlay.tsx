import type { CompositionLine } from '@/types/analysis'
import { useRef, useEffect, useMemo } from 'react'

interface CompositionOverlayProps {
  lines: CompositionLine[]
  imageWidth: number
  imageHeight: number
}

export default function CompositionOverlay({ lines, imageWidth, imageHeight }: CompositionOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const { detectedLines, guideLines } = useMemo(() => {
    const detected = lines.filter((l) => !l.isGuide)
    const guide = lines.filter((l) => l.isGuide)
    return { detectedLines: detected, guideLines: guide }
  }, [lines])

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
        const isGuide = path.getAttribute('data-guide') === 'true'
        if (isGuide) {
          path.style.strokeDasharray = '6,6'
          path.style.opacity = '0'
          path.style.animation = `fade-in 0.8s ease-out forwards`
        } else {
          path.style.strokeDasharray = `${length}`
          path.style.strokeDashoffset = `${length}`
          path.style.animation = `draw-line 1.5s ease-out forwards`
        }
      }
    })
  }, [detectedLines, guideLines])

  const w = imageWidth
  const h = imageHeight

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
      style={{ mixBlendMode: 'difference' }}
    >
      {guideLines.map((line, i) => {
        const x1 = line.startPoint.x * w
        const y1 = line.startPoint.y * h
        const x2 = line.endPoint.x * w
        const y2 = line.endPoint.y * h
        return (
          <line
            key={`guide-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
            data-guide="true"
            style={{ animationDelay: `${i * 100 + 500}ms` }}
          />
        )
      })}

      {detectedLines.map((line, i) => {
        const x1 = line.startPoint.x * w
        const y1 = line.startPoint.y * h
        const x2 = line.endPoint.x * w
        const y2 = line.endPoint.y * h
        const opacity = Math.max(0.3, Math.min(0.9, line.strength * 2))
        return (
          <line
            key={`detected-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`rgba(255,255,255,${opacity})`}
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        )
      })}
    </svg>
  )
}
