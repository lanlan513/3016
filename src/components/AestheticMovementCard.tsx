import { useState } from 'react'
import type { AestheticMovement as AestheticMovementType } from '@/types/analysis'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, MapPin, Clock, Quote, Users, Compass } from 'lucide-react'

interface AestheticMovementCardProps {
  movement: AestheticMovementType
  index: number
}

export default function AestheticMovementCard({ movement, index }: AestheticMovementCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="movement-card-container"
    >
      <motion.div
        className="movement-card-inner"
        layout
        transition={{ layout: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }}
      >
        <motion.div layout="position" className="movement-card-front">
          <div className="movement-accent-bar" style={{ backgroundColor: movement.accentColor }} />

          <div className="movement-card-header">
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-1">
                <h3 className="font-display text-2xl tracking-wide text-neutral-900">
                  {movement.name}
                </h3>
                <span className="font-sans text-xs tracking-widest text-neutral-400 uppercase">
                  {movement.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-1.5 font-sans text-[11px] text-neutral-400">
                  <Clock size={11} />
                  {movement.era}
                </span>
                <span className="inline-flex items-center gap-1.5 font-sans text-[11px] text-neutral-400">
                  <MapPin size={11} />
                  {movement.origin}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="movement-expand-btn"
              style={{ '--accent': movement.accentColor } as React.CSSProperties}
            >
              <span className="font-sans text-[11px] tracking-wide mr-1.5">
                {isExpanded ? '收起' : '查看详情'}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ChevronDown size={14} strokeWidth={1.5} />
              </motion.div>
            </button>
          </div>

          <motion.div layout="position" className="mt-4">
            <div className="flex items-start gap-2">
              <Quote size={14} className="text-neutral-300 mt-0.5 shrink-0" />
              <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                {movement.philosophy}
              </p>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="movement-card-details">
                <div className="movement-detail-section">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={13} className="text-neutral-400" />
                    <span className="font-sans text-[11px] tracking-widest text-neutral-400 uppercase">
                      代表人物
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {movement.representatives.map((person) => (
                      <span
                        key={person}
                        className="movement-chip"
                        style={{ borderColor: movement.accentColor }}
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="movement-detail-section">
                  <div className="flex items-center gap-2 mb-3">
                    <Compass size={13} className="text-neutral-400" />
                    <span className="font-sans text-[11px] tracking-widest text-neutral-400 uppercase">
                      标志性设计原则
                    </span>
                  </div>
                  <div className="space-y-2">
                    {movement.principles.map((principle, i) => (
                      <motion.div
                        key={principle}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: movement.accentColor }}
                        />
                        <span className="font-sans text-sm text-neutral-600 leading-relaxed">
                          {principle}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="movement-detail-section">
                  <span className="font-sans text-[11px] tracking-widest text-neutral-400 uppercase">
                    匹配标签
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {movement.matchedTags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
