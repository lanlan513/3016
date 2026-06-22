import { useEffect, useCallback, useRef } from 'react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { loadImageToCanvas, extractPalette } from '@/utils/colorExtractor'
import { analyzeComposition } from '@/utils/compositionAnalyzer'
import { generateStyleTags } from '@/utils/styleTagGenerator'
import PaletteExtractor from './PaletteExtractor'
import ColorMatrix from './ColorMatrix'
import CompositionAnalyzer from './CompositionAnalyzer'
import StyleTagCloud from './StyleTagCloud'
import { motion, AnimatePresence } from 'motion/react'

export default function AnalysisPanel() {
  const { status, result, imageFile, setStatus, setResult } = useAnalysisStore()
  const analyzedRef = useRef<string | null>(null)

  const runAnalysis = useCallback(async () => {
    if (!imageFile) return

    const fileKey = imageFile.name + imageFile.size
    if (analyzedRef.current === fileKey) return
    analyzedRef.current = fileKey

    setStatus('analyzing')

    try {
      const { imageData } = await loadImageToCanvas(imageFile)

      await new Promise((r) => setTimeout(r, 600))

      const palette = extractPalette(imageData, 6)

      await new Promise((r) => setTimeout(r, 400))

      const composition = analyzeComposition(imageData)

      await new Promise((r) => setTimeout(r, 300))

      const tags = generateStyleTags(palette, composition)

      setResult({ palette, composition, tags })
    } catch {
      setStatus('error')
    }
  }, [imageFile, setStatus, setResult])

  useEffect(() => {
    if (status === 'loading' && imageFile) {
      runAnalysis()
    }
  }, [status, imageFile, runAnalysis])

  if (status === 'idle') return null

  return (
    <div className="w-full mt-16">
      <AnimatePresence>
        {status === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-6"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border border-neutral-300 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 border border-neutral-400 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 border border-neutral-500 animate-spin" style={{ animationDuration: '1.5s' }} />
            </div>
            <p className="font-sans text-sm text-neutral-400 tracking-wider">
              正在解构视觉语言...
            </p>
          </motion.div>
        )}

        {status === 'complete' && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-20"
          >
            <div>
              <PaletteExtractor palette={result.palette} />
            </div>

            <div className="section-divider" />

            <div>
              <ColorMatrix palette={result.palette} />
            </div>

            <div className="section-divider" />

            <div>
              <CompositionAnalyzer composition={result.composition} />
            </div>

            <div className="section-divider" />

            <div>
              <StyleTagCloud tags={result.tags} />
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-sans text-sm text-neutral-500">
              分析出错，请重新上传图片
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
