import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Lightbulb,
  Eye,
  Target,
  ArrowRight,
  Palette,
  Frame,
  Sparkles,
  Zap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { LearningCard as LearningCardType, CourseCategory, AestheticConcept } from '@/types/analysis'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { cn } from '@/lib/utils'
import { coursePaths } from '@/utils/courseData'

const categoryConfig: Record<
  CourseCategory,
  { icon: typeof Palette; label: string; accent: string }
> = {
  color: { icon: Palette, label: '色彩', accent: '#E63946' },
  composition: { icon: Frame, label: '构图', accent: '#2A9D8F' },
  movement: { icon: Sparkles, label: '流派', accent: '#6A4C93' },
}

function DifficultyBadge({ level }: { level: 1 | 2 | 3 }) {
  const labels = ['', '入门', '进阶', '高阶']
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-600 font-sans text-[10px] tracking-wide">
      {Array.from({ length: 3 }).map((_, i) => (
        <Zap
          key={i}
          size={10}
          className={i < level ? 'text-neutral-700 fill-neutral-700' : 'text-neutral-300'}
        />
      ))}
      <span className="ml-0.5">{labels[level]}</span>
    </span>
  )
}

function ConceptVisualizer({ concept }: { concept: AestheticConcept }) {
  const category = categoryConfig[concept.category]
  const Icon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${category.accent}08 0%, ${category.accent}15 100%)`,
        border: `1px solid ${category.accent}20`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: concept.category === 'color'
          ? `linear-gradient(90deg, transparent 49.5%, ${category.accent} 49.5%, ${category.accent} 50.5%, transparent 50.5%), linear-gradient(0deg, transparent 49.5%, ${category.accent} 49.5%, ${category.accent} 50.5%, transparent 50.5%)`
          : concept.category === 'composition'
          ? `linear-gradient(0deg, ${category.accent} 1px, transparent 1px), linear-gradient(90deg, ${category.accent} 1px, transparent 1px)`
          : 'radial-gradient(circle, ' + category.accent + ' 1px, transparent 1px)',
        backgroundSize: concept.category === 'composition' ? '33.33% 33.33%' : '24px 24px',
      }} />

      <div className="relative p-5">
        <motion.div
          initial={{ rotate: -8, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-start justify-between gap-4"
        >
          <div
            className="w-12 h-12 flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${category.accent}12` }}
          >
            <Icon size={24} style={{ color: category.accent }} />
          </div>

          <div className="flex flex-col items-end gap-2">
            <DifficultyBadge level={concept.difficulty} />
            <span
              className="inline-flex items-center px-2 py-0.5 font-sans text-[10px] tracking-widest uppercase"
              style={{
                backgroundColor: `${category.accent}12`,
                color: category.accent,
              }}
            >
              {category.label}理论
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4"
        >
          <h4 className="font-display text-2xl tracking-wide text-neutral-900 leading-tight">
            {concept.name}
          </h4>
          <p className="font-sans text-[13px] text-neutral-600 mt-2 leading-relaxed">
            {concept.detail}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ExamplesSection({ concept }: { concept: AestheticConcept }) {
  const [activeExample, setActiveExample] = useState(0)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb size={14} className="text-amber-500" />
        <span className="font-sans text-[11px] tracking-widest uppercase text-neutral-500">
          典型案例
        </span>
      </div>

      <div className="space-y-2">
        {concept.examples.map((example, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveExample(idx)}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + idx * 0.1, duration: 0.4 }}
            className={cn(
              'w-full p-4 text-left border transition-all duration-300',
              activeExample === idx
                ? 'border-neutral-900 bg-neutral-950 text-white'
                : 'border-neutral-100 bg-white hover:border-neutral-300'
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'font-display text-lg shrink-0 w-6 text-center leading-none pt-0.5',
                  activeExample === idx ? 'text-white' : 'text-neutral-300'
                )}
              >
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-sans text-sm tracking-wide',
                    activeExample === idx ? 'text-white' : 'text-neutral-800'
                  )}
                >
                  {example.description}
                </p>
                <AnimatePresence>
                  {activeExample === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p
                        className={cn(
                          'font-sans text-[11px] mt-2 flex items-center gap-1.5',
                          activeExample === idx ? 'text-neutral-400' : 'text-neutral-500'
                        )}
                      >
                        <Eye size={11} />
                        {example.visualHint}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <ArrowRight
                size={14}
                className={cn(
                  'shrink-0 mt-0.5 transition-transform duration-300',
                  activeExample === idx
                    ? 'text-white translate-x-1'
                    : 'text-neutral-300'
                )}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function ContrastSection({ concept }: { concept: AestheticConcept }) {
  if (!concept.contrastExample) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="relative overflow-hidden border border-dashed border-neutral-300 bg-neutral-50/50"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-900 via-neutral-400 to-neutral-900 opacity-30" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-neutral-700" />
          <span className="font-sans text-[11px] tracking-widest uppercase text-neutral-600">
            反例对比
          </span>
          <span className="font-sans text-[10px] text-neutral-400">
            / 理解边界，更好掌握
          </span>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 shrink-0 border border-neutral-300 bg-white flex items-center justify-center">
            <span className="font-display text-sm text-neutral-500">×</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm text-neutral-700 tracking-wide leading-relaxed">
              {concept.contrastExample.description}
            </p>
            <p className="font-sans text-[11px] text-neutral-500 mt-2 flex items-center gap-1.5">
              <Eye size={11} />
              {concept.contrastExample.visualHint}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface LearningCardProps {
  card: LearningCardType
  index: number
  isActive: boolean
}

export default function LearningCard({ card, index, isActive }: LearningCardProps) {
  const {
    expandLearningCard,
    collapseLearningCard,
    completeLearningCard,
    setActiveCardId,
    markConceptViewed,
  } = useAnalysisStore()

  const [hoverConcept, setHoverConcept] = useState(false)
  const conceptRef = useRef<HTMLButtonElement>(null)
  const category = categoryConfig[card.concept.category]
  const path = coursePaths.find((p) => p.id === card.concept.category)
  const Icon = category.icon

  const { concept, relevance, evidence, expanded, completed } = card

  useEffect(() => {
    if (expanded) {
      markConceptViewed(concept.id)
    }
  }, [expanded, concept.id, markConceptViewed])

  const handleToggleExpand = () => {
    if (expanded) {
      collapseLearningCard(card.id)
    } else {
      expandLearningCard(card.id)
      setActiveCardId(card.id)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className={cn(
        'border bg-white transition-all duration-300',
        isActive
          ? 'border-neutral-900 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
          : 'border-neutral-200 hover:border-neutral-300',
        completed ? 'bg-neutral-50/70' : ''
      )}
      style={
        isActive && !completed
          ? { borderTop: `3px solid ${category.accent}` }
          : undefined
      }
    >
      <div
        className={cn(
          'p-5 md:p-6',
          expanded ? '' : 'cursor-pointer'
        )}
        onClick={!expanded ? handleToggleExpand : undefined}
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <motion.div
              whileHover={!expanded ? { scale: 1.05 } : undefined}
              whileTap={!expanded ? { scale: 0.95 } : undefined}
              className={cn(
                'w-14 h-14 flex items-center justify-center border-2 transition-colors duration-300',
                isActive ? 'border-neutral-900' : 'border-neutral-200',
                completed ? 'bg-neutral-900' : 'bg-white'
              )}
              style={
                !completed && isActive
                  ? { borderColor: category.accent }
                  : undefined
              }
            >
              {completed ? (
                <CheckCircle2 size={26} className="text-white" />
              ) : (
                <Icon
                  size={24}
                  style={{ color: isActive ? category.accent : '#8A8A8A' }}
                />
              )}
            </motion.div>

            <div className="flex flex-col items-center gap-0.5">
              <span
                className="font-display text-2xl leading-none"
                style={{
                  color: completed ? '#ABABAB' : category.accent,
                }}
              >
                {relevance}
              </span>
              <span className="font-sans text-[9px] tracking-widest uppercase text-neutral-400">
                匹配度
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 font-sans text-[10px] tracking-widest uppercase"
                    style={{
                      backgroundColor: completed ? '#F5F5F5' : `${category.accent}10`,
                      color: completed ? '#ABABAB' : category.accent,
                    }}
                  >
                    <Icon size={10} className="mr-1" />
                    {category.label} · {path?.nameEn}
                  </span>
                  {!completed && (
                    <DifficultyBadge level={concept.difficulty} />
                  )}
                  {completed && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 font-sans text-[10px] tracking-wide">
                      <CheckCircle2 size={10} />
                      已学习
                    </span>
                  )}
                </div>

                <button
                  ref={conceptRef}
                  onClick={(e) => {
                    e.stopPropagation()
                    setHoverConcept(true)
                    handleToggleExpand()
                  }}
                  onMouseEnter={() => setHoverConcept(true)}
                  onMouseLeave={() => setHoverConcept(false)}
                  className={cn(
                    'text-left inline-block transition-all duration-300 relative',
                    completed ? 'text-neutral-500' : 'text-neutral-900 hover:underline decoration-2 underline-offset-4'
                  )}
                  style={
                    !completed && hoverConcept
                      ? { color: category.accent }
                      : undefined
                  }
                >
                  <h3 className="font-display text-xl md:text-2xl tracking-wide leading-tight">
                    {concept.name}
                  </h3>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 origin-left"
                    style={{ backgroundColor: category.accent }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoverConcept && !completed ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleExpand()
                }}
                className={cn(
                  'shrink-0 w-9 h-9 flex items-center justify-center border transition-all duration-200 hover:scale-105',
                  expanded
                    ? 'border-neutral-300 bg-white'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                )}
              >
                {expanded ? (
                  <ChevronUp size={16} className="text-neutral-600" />
                ) : (
                  <ChevronDown size={16} className="text-neutral-500" />
                )}
              </button>
            </div>

            <p
              className={cn(
                'font-sans text-[13px] mt-2.5 leading-relaxed',
                completed ? 'text-neutral-400' : 'text-neutral-600'
              )}
            >
              {concept.summary}
            </p>

            <div className="mt-3.5 flex items-start gap-2">
              <div
                className="w-1 h-full min-h-[28px] mt-0.5 shrink-0 rounded-full"
                style={{ backgroundColor: category.accent }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-sans text-[12px] leading-relaxed',
                    completed ? 'text-neutral-400' : 'text-neutral-500'
                  )}
                >
                  <span className="font-medium text-neutral-700">识别依据：</span>
                  {evidence}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-6 space-y-6 border-t border-neutral-100 bg-neutral-50/30">
              <div className="pt-5">
                <ConceptVisualizer concept={concept} />
              </div>

              <ExamplesSection concept={concept} />
              <ContrastSection concept={concept} />

              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <p className="font-sans text-[11px] text-neutral-400 tracking-wide">
                  {completed
                    ? '已完成本概念的学习'
                    : '点击下方按钮，标记为已掌握'}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => collapseLearningCard(card.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 text-neutral-500 font-sans text-xs tracking-wide hover:border-neutral-300 hover:text-neutral-700 transition-all duration-200"
                  >
                    <ChevronUp size={13} />
                    收起
                  </button>

                  {!completed ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => completeLearningCard(card.id)}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white font-sans text-xs tracking-wide hover:bg-neutral-800 transition-colors duration-200"
                      style={{ boxShadow: `0 0 0 1px ${category.accent}30` }}
                    >
                      <Circle size={12} className="opacity-60" />
                      标记已掌握
                    </motion.button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-100 text-neutral-500 font-sans text-xs tracking-wide">
                      <CheckCircle2 size={12} />
                      已掌握
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
