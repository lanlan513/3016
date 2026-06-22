import type { CompositionLine } from '@/types/analysis'
import CompositionOverlay from './CompositionOverlay'
import { Grid3x3 } from 'lucide-react'
import { useAnalysisStore } from '@/store/useAnalysisStore'

interface CompositionAnalyzerProps {
  composition: CompositionLine[]
}

export default function CompositionAnalyzer({ composition }: CompositionAnalyzerProps) {
  const { imageUrl } = useAnalysisStore()

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Grid3x3 size={18} className="text-neutral-400" />
        <h2 className="analysis-section-title mb-0">构图分析</h2>
      </div>

      <div className="relative w-full max-w-[640px] mx-auto overflow-hidden border border-neutral-200">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Composition analysis"
            className="w-full h-auto block"
          />
        )}
        {imageUrl && (
          <CompositionOverlay
            lines={composition}
            imageWidth={640}
            imageHeight={400}
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {composition.filter((l) => l.strength >= 0.1).map((line, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-100 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 100 + 500}ms`, animationFillMode: 'forwards' }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: line.type === 'horizontal' ? '#1A1A1A' : line.type === 'vertical' ? '#6A6A6A' : '#ABABAB' }}
            />
            <span className="font-sans text-xs text-neutral-600">
              {line.type === 'horizontal' ? '水平线' : line.type === 'vertical' ? '垂直线' : '对角线'}
            </span>
            <span className="font-sans text-[10px] text-neutral-400">
              {Math.round(line.strength * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
