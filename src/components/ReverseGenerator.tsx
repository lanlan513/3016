import { useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Wand2, Sparkles, ArrowRight, RefreshCw } from 'lucide-react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { generateAestheticVariants } from '@/utils/variantGenerator'
import VariantCard from './VariantCard'
import { cn } from '@/lib/utils'

export default function ReverseGenerator() {
  const {
    result,
    variants,
    variantStatus,
    activeVariantId,
    setVariants,
    setVariantStatus,
    setActiveVariantId,
  } = useAnalysisStore()

  const handleGenerate = useCallback(async () => {
    if (!result) return
    setVariantStatus('generating')
    await new Promise((r) => setTimeout(r, 800))
    try {
      const generatedVariants = generateAestheticVariants(result)
      await new Promise((r) => setTimeout(r, 600))
      setVariants(generatedVariants)
    } catch {
      setVariantStatus('error')
    }
  }, [result, setVariants, setVariantStatus])

  if (!result) return null

  const hasVariants = variantStatus === 'complete' && variants.length > 0

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Wand2 size={18} className="text-neutral-400" />
        <div>
          <h2 className="analysis-section-title mb-0">审美反向生成器</h2>
          <p className="font-sans text-[11px] text-neutral-400 tracking-wide mt-1">
            Reverse Aesthetic Generator · 从理解走向创造
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!hasVariants && variantStatus !== 'generating' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="relative p-8 md:p-12 overflow-hidden cursor-pointer group"
              style={{
                background: 'linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)',
                border: '1px solid #E5E5E5',
              }}
              onClick={handleGenerate}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 transition-all duration-500 group-hover:w-1.5" />

              <div className="absolute top-6 right-6 w-16 h-16 border border-neutral-200 rotate-12 opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-6" />
              <div className="absolute bottom-6 left-12 w-8 h-8 border border-neutral-300 -rotate-12 opacity-40 transition-all duration-500 group-hover:opacity-80" />

              <div className="relative max-w-lg">
                <div className="w-16 h-16 bg-neutral-950 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                  <Sparkles size={28} className="text-white" />
                </div>

                <h3 className="font-display text-2xl md:text-3xl tracking-wide text-neutral-900 leading-tight mb-4">
                  从解构到创造
                </h3>
                <p className="font-sans text-[13px] text-neutral-600 leading-relaxed mb-6">
                  基于当前图片的分析结果，系统将自动生成三种风格偏移的审美变体方案。
                  探索极简化、情绪强化与结构解构三种路径，发现更多可能性。
                </p>

                <button
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-950 text-white font-sans text-[12px] tracking-wider transition-all duration-300 hover:bg-neutral-800 group-hover:gap-3"
                >
                  生成变体方案
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {variantStatus === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-6"
          >
            <div className="relative w-20 h-20">
              <div
                className="absolute inset-0 border border-neutral-300"
                style={{
                  animation: 'spin 3s linear infinite',
                  clipPath: 'polygon(0 0, 100% 0, 100% 2px, 0 2px)',
                }}
              />
              <div
                className="absolute inset-2 border border-neutral-400"
                style={{
                  animation: 'spin 2s linear infinite reverse',
                  clipPath: 'polygon(100% 0, 100% 100%, calc(100% - 2px) 100%, calc(100% - 2px) 0)',
                }}
              />
              <div
                className="absolute inset-4 border border-neutral-500"
                style={{
                  animation: 'spin 1.5s linear infinite',
                  clipPath: 'polygon(0 100%, 100% 100%, 100% calc(100% - 2px), 0 calc(100% - 2px))',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={20} className="text-neutral-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-sans text-sm text-neutral-600 tracking-wide">
                正在生成审美变体...
              </p>
              <p className="font-sans text-[11px] text-neutral-400 tracking-wider mt-2">
                探索极简化 · 情绪强化 · 结构解构
              </p>
            </div>
          </motion.div>
        )}

        {variantStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="font-sans text-sm text-neutral-500 mb-4">
              生成出错，请重试
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-600 font-sans text-[12px] tracking-wide hover:border-neutral-500 hover:text-neutral-800 transition-colors duration-200"
            >
              <RefreshCw size={12} />
              重新生成
            </button>
          </motion.div>
        )}

        {hasVariants && (
          <motion.div
            key="variants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500">
                    3 Aesthetic Variants · 三种审美变体
                  </span>
                </div>
                <h3 className="font-display text-2xl tracking-wide text-neutral-900 leading-tight">
                  从一张图片，探索三种可能
                </h3>
              </div>
              <button
                onClick={handleGenerate}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 text-[11px] font-sans tracking-wider transition-all duration-300',
                  'border border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:text-neutral-800'
                )}
              >
                <RefreshCw size={12} />
                重新生成
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {variants.map((variant, index) => (
                <VariantCard
                  key={variant.id}
                  variant={variant}
                  index={index}
                  isActive={activeVariantId === variant.id}
                  onClick={() => setActiveVariantId(variant.id)}
                />
              ))}
            </div>

            <div className="mt-10 p-6 md:p-8 bg-neutral-50 border border-neutral-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h4 className="font-display text-lg tracking-wide text-neutral-900 mb-2">
                    变体生成说明
                  </h4>
                  <p className="font-sans text-[12px] text-neutral-500 leading-relaxed max-w-lg">
                    以上变体基于原始图片的色彩、构图与风格特征，通过算法模拟不同审美取向的偏移路径。
                    点击卡片可展开查看色彩、构图、标签的详细变化轨迹。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: v.accentColor }}
                      />
                      <span className="font-sans text-[10px] tracking-wide text-neutral-600">
                        {v.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
