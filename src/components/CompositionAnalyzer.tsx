import { useState, useRef, useEffect } from 'react'
import type { CompositionLine } from '@/types/analysis'
import CompositionOverlay from './CompositionOverlay'
import CompositionGuideOverlay from './CompositionGuideOverlay'
import { Grid3x3, Layers, Diamond, Triangle, Minus } from 'lucide-react'
import { useAnalysisStore, type GuideMode } from '@/store/useAnalysisStore'

interface CompositionAnalyzerProps {
  composition: CompositionLine[]
}

const guideOptions: { mode: GuideMode; label: string; icon: typeof Grid3x3 }[] = [
  { mode: null, label: '关闭', icon: Minus },
  { mode: 'thirds', label: '三分法', icon: Grid3x3 },
  { mode: 'golden', label: '黄金分割', icon: Diamond },
  { mode: 'diagonal', label: '对角线', icon: Triangle },
]

export default function CompositionAnalyzer({ composition }: CompositionAnalyzerProps) {
  const { imageUrl, guideMode, setGuideMode } = useAnalysisStore()
  const imgRef = useRef<HTMLImageElement>(null)
  const [dimensions, setDimensions] = useState({ width: 640, height: 400 })

  useEffect(() => {
    if (!imgRef.current || !imageUrl) return
    const img = imgRef.current
    const updateDimensions = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
    }
    if (img.complete) {
      updateDimensions()
    } else {
      img.addEventListener('load', updateDimensions)
      return () => img.removeEventListener('load', updateDimensions)
    }
  }, [imageUrl])

  const detectedLines = composition.filter((l) => !l.isGuide && l.strength > 0.05)
  const guideLines = composition.filter((l) => l.isGuide)

  const typeLabels: Record<string, { name: string; desc: string }> = {
    horizontal: { name: '水平主导', desc: '画面以横向线条为主，传递稳定、宁静、开阔的视觉感受' },
    vertical: { name: '垂直主导', desc: '画面以纵向线条为主，传递挺拔、庄严、向上的视觉感受' },
    diagonal: { name: '对角主导', desc: '画面以斜线为主，传递动感、张力、活力的视觉感受' },
  }

  const dominantType = detectedLines.length > 0 ? detectedLines[0].type : null

  const lineTypeLabels: Record<string, string> = {
    horizontal: '主水平线',
    vertical: '主垂直线',
    diagonal: '主对角线',
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Grid3x3 size={18} className="text-neutral-400" />
        <h2 className="analysis-section-title mb-0">构图分析</h2>
      </div>

      <div className="relative w-full max-w-[640px] mx-auto overflow-hidden border border-neutral-200 bg-neutral-50">
        {imageUrl && (
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Composition analysis"
            className="w-full h-auto block"
          />
        )}
        {imageUrl && (
          <CompositionOverlay
            lines={composition}
            imageWidth={dimensions.width}
            imageHeight={dimensions.height}
          />
        )}
        {imageUrl && guideMode && (
          <CompositionGuideOverlay
            mode={guideMode}
            imageWidth={dimensions.width}
            imageHeight={dimensions.height}
          />
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-1">
        <span className="font-sans text-[10px] text-neutral-400 tracking-widest uppercase mr-3">
          构图辅助线
        </span>
        {guideOptions.map((opt) => {
          const Icon = opt.icon
          const isActive = guideMode === opt.mode
          return (
            <button
              key={opt.label}
              onClick={() => setGuideMode(opt.mode)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-200
                font-sans text-[11px] tracking-wide
                ${isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-700'
                }
              `}
            >
              <Icon size={12} strokeWidth={isActive ? 2 : 1.5} />
              {opt.label}
            </button>
          )
        })}
      </div>

      <div className="mt-8 space-y-6">
        {dominantType && (
          <div className="flex items-start gap-4 p-5 bg-neutral-50 border border-neutral-100 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="mt-0.5">
              <Layers size={16} className="text-neutral-400" />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-neutral-900">
                {typeLabels[dominantType]?.name || '混合构图'}
              </p>
              <p className="font-sans text-xs text-neutral-500 mt-1 leading-relaxed">
                {typeLabels[dominantType]?.desc || '画面包含多种方向的线条元素，视觉层次丰富'}
              </p>
            </div>
          </div>
        )}

        {detectedLines.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {detectedLines.slice(0, 4).map((line, i) => (
              <div
                key={`detected-${i}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 100 + 300}ms`, animationFillMode: 'forwards' }}
              >
                <div
                  className="w-4 h-px bg-neutral-900"
                  style={{ transform: `rotate(${line.angle}deg)` }}
                />
                <span className="font-sans text-xs text-neutral-700">
                  {line.label || lineTypeLabels[line.type] || line.type}
                </span>
                <span className="font-sans text-[10px] text-neutral-400">
                  强度 {Math.round(line.strength * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {guideLines.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
            <span className="font-sans text-[11px] text-neutral-400 tracking-wide">
              参考构图：
            </span>
            <span className="font-sans text-[11px] text-neutral-500">
              三分法（{guideLines.length} 条辅助线）
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
