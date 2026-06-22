import { useState } from 'react'
import { X, Palette, Frame, Sparkles, ChevronRight, ChevronDown, GraduationCap, BookOpen, CheckCircle2, Circle, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { coursePaths, aestheticConcepts } from '@/utils/courseData'
import type { CourseCategory, CoursePath, CourseLesson } from '@/types/analysis'
import { cn } from '@/lib/utils'

const categoryIcons: Record<CourseCategory, typeof Palette> = {
  color: Palette,
  composition: Frame,
  movement: Sparkles,
}

function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

function LessonItem({
  lesson,
  path,
  unlockedConcepts,
  viewedConcepts,
}: {
  lesson: CourseLesson
  path: CoursePath
  unlockedConcepts: string[]
  viewedConcepts: string[]
}) {
  const [open, setOpen] = useState(false)
  const learnedCount = lesson.conceptIds.filter((id) => unlockedConcepts.includes(id)).length
  const totalCount = lesson.conceptIds.length
  const isComplete = learnedCount === totalCount && totalCount > 0

  return (
    <div className="border border-neutral-100 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-neutral-50 transition-colors duration-200"
      >
        <div className="shrink-0 mt-0.5">
          {isComplete ? (
            <CheckCircle2 size={18} style={{ color: path.accentColor }} />
          ) : (
            <Circle size={18} className="text-neutral-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                'font-sans text-sm tracking-wide truncate',
                isComplete ? 'text-neutral-500' : 'text-neutral-800'
              )}
            >
              {lesson.title}
            </p>
            {open ? (
              <ChevronDown size={14} className="text-neutral-400 shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-neutral-400 shrink-0" />
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar
              value={learnedCount}
              total={totalCount}
              color={path.accentColor}
            />
            <span className="font-sans text-[10px] text-neutral-400 tracking-wide shrink-0">
              {learnedCount}/{totalCount}
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-1.5 border-t border-neutral-50">
              {lesson.conceptIds.map((conceptId) => {
                const concept = aestheticConcepts[conceptId]
                if (!concept) return null
                const isUnlocked = unlockedConcepts.includes(conceptId)
                const isViewed = viewedConcepts.includes(conceptId)
                return (
                  <div
                    key={conceptId}
                    className={cn(
                      'flex items-center gap-2.5 py-2 px-3 transition-all duration-200',
                      isUnlocked ? 'bg-neutral-50' : 'bg-neutral-50/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        isViewed
                          ? 'bg-neutral-400'
                          : isUnlocked
                          ? ''
                          : 'bg-neutral-200'
                      )}
                      style={isUnlocked && !isViewed ? { backgroundColor: path.accentColor } : undefined}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'font-sans text-xs truncate',
                          isUnlocked ? 'text-neutral-700' : 'text-neutral-400'
                        )}
                      >
                        {concept.name}
                      </p>
                      <p className="font-sans text-[10px] text-neutral-400 truncate mt-0.5">
                        {isUnlocked ? concept.summary : '上传图片解锁...'}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-1 h-1 rounded-full',
                            i < concept.difficulty ? '' : 'bg-neutral-200'
                          )}
                          style={i < concept.difficulty ? { backgroundColor: path.accentColor } : undefined}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CourseSection({
  path,
  progress,
  unlockedConcepts,
  viewedConcepts,
  isActive,
  onToggle,
}: {
  path: CoursePath
  progress: { learned: number; total: number }
  unlockedConcepts: string[]
  viewedConcepts: string[]
  isActive: boolean
  onToggle: () => void
}) {
  const Icon = categoryIcons[path.id]
  const pct = progress.total > 0 ? Math.round((progress.learned / progress.total) * 100) : 0

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-4 flex items-start gap-3 border transition-all duration-200 text-left',
          isActive
            ? 'border-neutral-900 bg-white'
            : 'border-neutral-100 bg-white hover:border-neutral-200'
        )}
        style={isActive ? { boxShadow: `inset 3px 0 0 ${path.accentColor}` } : undefined}
      >
        <div
          className="w-10 h-10 border flex items-center justify-center shrink-0"
          style={{
            borderColor: isActive ? path.accentColor : '#E5E5E5',
            backgroundColor: isActive ? `${path.accentColor}08` : 'transparent',
          }}
        >
          <Icon size={18} style={{ color: isActive ? path.accentColor : '#8A8A8A' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-display text-base tracking-wide text-neutral-900">
                {path.name}
              </p>
              <p className="font-sans text-[10px] text-neutral-400 tracking-widest uppercase mt-0.5">
                {path.nameEn}
              </p>
            </div>
            {isActive ? (
              <ChevronDown size={16} className="text-neutral-500 shrink-0" />
            ) : (
              <ChevronRight size={16} className="text-neutral-400 shrink-0" />
            )}
          </div>
          <p className="font-sans text-[11px] text-neutral-500 mt-2 line-clamp-2">
            {path.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <ProgressBar
              value={progress.learned}
              total={progress.total || unlockedConcepts.filter(id => aestheticConcepts[id]?.category === path.id).length}
              color={path.accentColor}
            />
            <span
              className="font-sans text-[10px] tracking-wide shrink-0"
              style={{ color: path.accentColor }}
            >
              {progress.total > 0 ? `${pct}%` : '—'}
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-x border-b border-neutral-100 bg-neutral-50/50">
              <div className="p-3 space-y-1.5">
                {path.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      path={path}
                      unlockedConcepts={unlockedConcepts}
                      viewedConcepts={viewedConcepts}
                    />
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AestheticsAcademy() {
  const {
    academyOpen,
    setAcademyOpen,
    activeCourseTab,
    setActiveCourseTab,
    learningProgress,
  } = useAnalysisStore()

  const totalUnlocked = learningProgress.unlockedConcepts.length
  const totalConcepts = Object.keys(aestheticConcepts).length
  const overallPct = Math.round((totalUnlocked / totalConcepts) * 100)

  return (
    <>
      <AnimatePresence>
        {academyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setAcademyOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[88%] max-w-[400px] bg-white z-50 shadow-2xl border-l border-neutral-100 flex flex-col lg:hidden"
            >
              <AcademyContent
                totalUnlocked={totalUnlocked}
                totalConcepts={totalConcepts}
                overallPct={overallPct}
                onClose={() => setAcademyOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'hidden lg:flex flex-col border-l border-neutral-100 bg-neutral-50/30 shrink-0 transition-all duration-500 ease-out overflow-hidden',
          academyOpen ? 'w-[360px] opacity-100' : 'w-0 opacity-0'
        )}
      >
        {academyOpen && (
          <AcademyContent
            totalUnlocked={totalUnlocked}
            totalConcepts={totalConcepts}
            overallPct={overallPct}
            onClose={() => setAcademyOpen(false)}
          />
        )}
      </aside>
    </>
  )
}

function AcademyContent({
  totalUnlocked,
  totalConcepts,
  overallPct,
  onClose,
}: {
  totalUnlocked: number
  totalConcepts: number
  overallPct: number
  onClose: () => void
}) {
  const { activeCourseTab, setActiveCourseTab, learningProgress } = useAnalysisStore()

  return (
    <div className="flex flex-col h-full overflow-hidden scrollbar-thin">
      <div className="p-5 border-b border-neutral-100 bg-white shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 border border-neutral-900 flex items-center justify-center bg-neutral-900 shrink-0">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl tracking-wide text-neutral-900 leading-none">
                美学学院
              </h2>
              <p className="font-sans text-[10px] text-neutral-400 tracking-widest uppercase mt-1">
                Aesthetics Academy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 transition-all duration-200 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-5 p-4 bg-neutral-950 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-neutral-400" />
              <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                学习进度
              </span>
            </div>
            <span className="font-display text-lg text-white">{overallPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] text-neutral-400">
              已解锁 <span className="text-white">{totalUnlocked}</span> / {totalConcepts} 个概念
            </p>
            <p className="font-sans text-[11px] text-neutral-400">
              已完成 <span className="text-white">{learningProgress.completedCards}</span> 张卡片
            </p>
          </div>
        </motion.div>
      </div>

      <div className="shrink-0 px-5 pt-4 pb-2 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-1.5 mb-3">
          <BookOpen size={14} className="text-neutral-400" />
          <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
            课程路径
          </span>
        </div>
        <div className="flex gap-1.5">
          {coursePaths.map((path) => {
            const Icon = categoryIcons[path.id]
            const isActive = activeCourseTab === path.id
            return (
              <button
                key={path.id}
                onClick={() => setActiveCourseTab(isActive ? null : path.id)}
                className={cn(
                  'flex-1 py-2.5 px-2 flex flex-col items-center gap-1 border transition-all duration-200',
                  isActive
                    ? 'border-neutral-900 bg-neutral-950 text-white'
                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                )}
              >
                <Icon size={16} style={isActive ? { color: path.accentColor } : undefined} />
                <span className="font-sans text-[10px] tracking-wide">{path.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin">
        {coursePaths.map((path) => (
          <CourseSection
            key={path.id}
            path={path}
            progress={learningProgress.categoryProgress[path.id]}
            unlockedConcepts={learningProgress.unlockedConcepts}
            viewedConcepts={learningProgress.viewedConcepts}
            isActive={activeCourseTab === path.id}
            onToggle={() =>
              setActiveCourseTab(activeCourseTab === path.id ? null : path.id)
            }
          />
        ))}

        <div className="pt-4 pb-2">
          <div className="section-divider mx-auto mb-4" />
          <p className="font-sans text-[10px] text-neutral-400 text-center tracking-widest uppercase">
            每次上传图片，解锁对应美学概念
          </p>
        </div>
      </div>
    </div>
  )
}
