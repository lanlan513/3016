import AestheticWhitepaper from './AestheticWhitepaper'
import { GraduationCap, BookOpen, X } from 'lucide-react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

export default function Header() {
  const { learningMode, toggleLearningMode, academyOpen, setAcademyOpen, learningProgress } = useAnalysisStore()
  const totalUnlocked = learningProgress.unlockedConcepts.length

  return (
    <header className="w-full py-8 flex items-center justify-between max-w-[1440px] mx-auto px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border border-neutral-900 flex items-center justify-center">
          <div className="w-3 h-3 bg-neutral-900" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg tracking-wider text-neutral-900 leading-none">
            视觉解构
          </span>
          {learningMode && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-sans text-[10px] tracking-widest uppercase text-neutral-400 mt-1 leading-none"
            >
              学习模式 · Learning Mode
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleLearningMode}
          className={cn(
            'inline-flex items-center gap-2 px-3 md:px-4 py-2 border transition-all duration-300',
            learningMode
              ? 'bg-neutral-900 border-neutral-900 text-white'
              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800'
          )}
          title="学习模式"
        >
          <GraduationCap size={15} className={learningMode ? 'text-amber-400' : ''} />
          <span className="hidden sm:inline font-sans text-[11px] tracking-widest uppercase">
            {learningMode ? '学习中' : '学习模式'}
          </span>
          {learningMode && totalUnlocked > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-amber-400 text-neutral-900 font-sans text-[10px] font-bold rounded-sm"
            >
              {totalUnlocked}
            </motion.span>
          )}
        </button>

        <button
          onClick={() => setAcademyOpen(!academyOpen)}
          className={cn(
            'inline-flex items-center gap-2 px-3 md:px-4 py-2 border transition-all duration-300',
            academyOpen
              ? 'bg-neutral-950 border-neutral-900 text-white'
              : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800'
          )}
          title="美学学院"
        >
          {academyOpen ? (
            <X size={15} />
          ) : (
            <BookOpen size={15} />
          )}
          <span className="hidden sm:inline font-sans text-[11px] tracking-widest uppercase">
            {academyOpen ? '关闭学院' : '美学学院'}
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6 ml-2 pl-4 border-l border-neutral-100">
          <span className="font-sans text-xs tracking-widest text-neutral-400 uppercase">
            Visual Deconstruct
          </span>
          <AestheticWhitepaper />
        </div>
      </div>
    </header>
  )
}
