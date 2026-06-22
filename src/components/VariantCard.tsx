import { motion } from 'motion/react'
import type { AestheticVariant } from '@/types/analysis'
import { ChevronDown, ChevronUp, Sparkles, Palette, Layout, Tags, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface VariantCardProps {
  variant: AestheticVariant
  index: number
  isActive: boolean
  onClick: () => void
}

const typeIcons: Record<string, typeof Sparkles> = {
  minimalist: Palette,
  emotional: Sparkles,
  deconstructive: Layout,
}

const categoryLabels: Record<string, string> = {
  color: '色彩',
  composition: '构图',
  mood: '氛围',
}

export default function VariantCard({ variant, index, isActive, onClick }: VariantCardProps) {
  const [expanded, setExpanded] = useState(false)
  const Icon = typeIcons[variant.type] || Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={cn(
        'variant-card-container relative cursor-pointer',
        isActive && 'z-10'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'variant-card-inner bg-white border overflow-hidden transition-all duration-500 ease-out',
          isActive ? 'border-neutral-800 shadow-[0_8px_32px_rgba(0,0,0,0.08)]' : 'border-neutral-200 hover:border-neutral-400 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
        )}
      >
        <div
          className="absolute top-0 left-0 w-full h-[2px] transition-all duration-700 ease-out"
          style={{ backgroundColor: variant.accentColor }}
        />

        <div className="p-6">
          <div className="variant-card-header flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 shrink-0 flex items-center justify-center"
                style={{ backgroundColor: variant.accentColor + '15' }}
              >
                <Icon size={20} style={{ color: variant.accentColor }} />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide text-neutral-900 leading-tight">
                  {variant.name}
                </h3>
                <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-400 mt-1">
                  {variant.nameEn}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="movement-expand-btn"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          <p className="font-sans text-[13px] text-neutral-600 mt-4 leading-relaxed">
            {variant.description}
          </p>

          <div
            className="mt-5 h-1.5 w-full flex overflow-hidden"
            style={{ border: '1px solid #F5F5F5' }}
          >
            {variant.palette.map((swatch, i) => (
              <div
                key={i}
                className="h-full transition-all duration-500"
                style={{
                  backgroundColor: swatch.hex,
                  width: `${swatch.percentage}%`,
                }}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {variant.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center px-2.5 py-1 rounded-full border border-neutral-200 text-[11px] font-sans tracking-wide text-neutral-600 bg-neutral-50"
              >
                <span
                  className="inline-block w-1 h-1 rounded-full mr-1.5"
                  style={{ backgroundColor: variant.accentColor }}
                />
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3 text-[11px] font-sans tracking-wide text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Palette size={12} />
              {variant.palette.length} 色
            </span>
            <span className="w-px h-3 bg-neutral-200" />
            <span className="flex items-center gap-1.5">
              <Layout size={12} />
              {variant.composition.length} 线
            </span>
            <span className="w-px h-3 bg-neutral-200" />
            <span className="flex items-center gap-1.5">
              <Tags size={12} />
              {variant.tags.length} 标签
            </span>
          </div>
        </div>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="variant-card-details px-6 pb-6 pt-2 border-t border-neutral-100 mt-2"
          >
            <div className="variant-detail-section mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Quote size={12} style={{ color: variant.accentColor }} />
                <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                  Design Philosophy
                </span>
              </div>
              <p
                className="font-display text-base leading-relaxed"
                style={{ color: variant.accentColor }}
              >
                {variant.philosophy}
              </p>
            </div>

            <div className="variant-detail-section mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Palette size={12} style={{ color: variant.accentColor }} />
                <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                  色彩变化轨迹
                </span>
              </div>
              <p className="font-sans text-[12px] text-neutral-600 leading-relaxed">
                {variant.colorTrajectory.description}
              </p>
              <div className="mt-3 space-y-2">
                {variant.colorTrajectory.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-sans text-[10px] text-neutral-400 w-16 shrink-0">
                      {step.label}
                    </span>
                    <div className="flex-1 h-2 flex overflow-hidden rounded-sm">
                      {step.value.map((swatch, j) => (
                        <div
                          key={j}
                          className="h-full"
                          style={{
                            backgroundColor: swatch.hex,
                            width: `${swatch.percentage}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="variant-detail-section mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Layout size={12} style={{ color: variant.accentColor }} />
                <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                  构图变化轨迹
                </span>
              </div>
              <p className="font-sans text-[12px] text-neutral-600 leading-relaxed">
                {variant.compositionTrajectory.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-sm border text-[11px] font-sans tracking-wide"
                  style={{
                    borderColor: variant.accentColor + '40',
                    color: variant.accentColor,
                    backgroundColor: variant.accentColor + '08',
                  }}
                >
                  {variant.compositionTrajectory.transformation}
                </span>
              </div>
            </div>

            <div className="variant-detail-section">
              <div className="flex items-center gap-2 mb-3">
                <Tags size={12} style={{ color: variant.accentColor }} />
                <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                  风格标签变化
                </span>
              </div>
              <p className="font-sans text-[12px] text-neutral-600 leading-relaxed mb-3">
                {variant.tagTrajectory.description}
              </p>
              {variant.tagTrajectory.added.length > 0 && (
                <div className="mb-2">
                  <span className="font-sans text-[10px] text-neutral-400 mr-2">新增:</span>
                  {variant.tagTrajectory.added.map((name) => (
                    <span
                      key={name}
                      className="inline-block mr-2 mb-1 px-2 py-0.5 rounded-sm text-[10px] font-sans"
                      style={{
                        backgroundColor: variant.accentColor + '15',
                        color: variant.accentColor,
                      }}
                    >
                      + {name}
                    </span>
                  ))}
                </div>
              )}
              {variant.tagTrajectory.removed.length > 0 && (
                <div>
                  <span className="font-sans text-[10px] text-neutral-400 mr-2">移除:</span>
                  {variant.tagTrajectory.removed.map((name) => (
                    <span
                      key={name}
                      className="inline-block mr-2 mb-1 px-2 py-0.5 rounded-sm text-[10px] font-sans bg-neutral-100 text-neutral-400 line-through"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {variant.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className="inline-block px-2 py-0.5 text-[10px] font-sans text-neutral-500 border rounded-sm border-neutral-200 hover:bg-neutral-50 transition-colors duration-200"
                  >
                    {tag.name}
                    <span className="ml-1 text-neutral-300">{categoryLabels[tag.category]}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
