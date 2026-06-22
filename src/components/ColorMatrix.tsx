import { useState } from 'react'
import type { ColorSwatch as ColorSwatchType } from '@/types/analysis'
import { getColorEmotion, type ColorEmotion } from '@/utils/colorEmotion'
import { Palette, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Toast from './Toast'

interface ColorMatrixProps {
  palette: ColorSwatchType[]
}

export default function ColorMatrix({ palette }: ColorMatrixProps) {
  const topColors = palette.slice(0, 5)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [copiedHex, setCopiedHex] = useState('')

  const selectedColor = selectedIndex !== null ? topColors[selectedIndex] : null
  const selectedEmotion: ColorEmotion | null = selectedColor
    ? getColorEmotion(selectedColor.hsl)
    : null

  const handleColorClick = (swatch: ColorSwatchType, index: number) => {
    setSelectedIndex(index)
    navigator.clipboard.writeText(swatch.hex)
    setCopiedHex(swatch.hex)
    setToastVisible(true)
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Palette size={18} className="text-neutral-400" />
        <h2 className="analysis-section-title mb-0">色彩矩阵</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-3">
            {topColors.map((swatch, i) => {
              const isLight = swatch.hsl.l > 55
              const isSelected = selectedIndex === i
              return (
                <motion.button
                  key={swatch.hex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => handleColorClick(swatch, i)}
                  className={`
                    group relative flex flex-col items-center gap-2.5 p-0
                    transition-all duration-300 ease-out outline-none
                    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400
                  `}
                  style={{ animationFillMode: 'both' }}
                >
                  <div
                    className={`
                      relative w-full aspect-square overflow-hidden cursor-pointer
                      transition-all duration-300 ease-out
                      ${isSelected
                        ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105 shadow-md'
                        : 'hover:scale-105 hover:shadow-md'
                      }
                    `}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <div
                      className={`
                        absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        ${isLight ? 'text-neutral-900/80' : 'text-white/90'}
                      `}
                    >
                      <span className="font-sans text-[10px] tracking-widest font-medium">
                        点击复制
                      </span>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`
                          absolute top-1.5 right-1.5 w-4 h-4 rounded-full
                          flex items-center justify-center
                          ${isLight ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'}
                        `}
                      >
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  <div className="text-center w-full space-y-0.5">
                    <p className={`
                      font-sans text-xs tracking-wider uppercase transition-colors duration-200
                      ${isSelected ? 'text-neutral-900 font-medium' : 'text-neutral-600'}
                    `}>
                      {swatch.hex}
                    </p>
                    <p className="font-sans text-[10px] text-neutral-400">
                      占比 {swatch.percentage}%
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="mt-6 h-2 w-full flex overflow-hidden rounded-sm">
            {topColors.map((swatch, i) => (
              <motion.div
                key={swatch.hex}
                initial={{ width: 0 }}
                animate={{ width: `${swatch.percentage}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="h-full"
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedColor && selectedEmotion && (
            <motion.div
              key={selectedColor.hex}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="lg:w-72 flex-shrink-0"
            >
              <div className="h-full p-5 bg-neutral-50 border border-neutral-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-neutral-400" />
                  <span className="font-sans text-[11px] tracking-widest uppercase text-neutral-500">
                    情绪标签
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <div>
                    <p className="font-display text-lg text-neutral-900 tracking-wide">
                      {selectedColor.hex}
                    </p>
                    <p className="font-sans text-[11px] text-neutral-400">
                      HSL({selectedColor.hsl.h}, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedEmotion.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className="inline-flex items-center px-3 py-1 bg-white border border-neutral-200
                                 font-sans text-xs tracking-wide text-neutral-700"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1.5">
                      美学解读
                    </p>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                      {selectedEmotion.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <p className="font-sans text-[10px] tracking-wider uppercase text-neutral-400 mb-1.5">
                      文化意涵
                    </p>
                    <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                      {selectedEmotion.cultural}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast
        visible={toastVisible}
        message={`已复制 ${copiedHex}`}
        icon="check"
        onClose={() => setToastVisible(false)}
      />
    </div>
  )
}
