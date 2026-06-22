import Header from '@/components/Header'
import UploadZone from '@/components/UploadZone'
import AnalysisPanel from '@/components/AnalysisPanel'
import AestheticMovements from '@/components/AestheticMovements'
import AestheticWhitepaper from '@/components/AestheticWhitepaper'
import AestheticsAcademy from '@/components/AestheticsAcademy'
import LearningCard from '@/components/LearningCard'
import ReverseGenerator from '@/components/ReverseGenerator'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, ArrowUpRight, GraduationCap, Lightbulb, ChevronRight } from 'lucide-react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { cn } from '@/lib/utils'

export default function Home() {
  const {
    status,
    result,
    learningMode,
    learningCards,
    activeCardId,
    academyOpen,
    setAcademyOpen,
    learningProgress,
  } = useAnalysisStore()

  const hasResult = status === 'complete'
  const hasCards = learningMode && learningCards.length > 0

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="flex-1 min-w-0">
        <Header />

        <main
          className={cn(
            'pb-24 transition-all duration-500 ease-out',
            academyOpen ? 'lg:pr-0' : ''
          )}
          style={{ maxWidth: academyOpen ? '100%' : '100%' }}
        >
          <div className="max-w-[960px] mx-auto px-6">
            <motion.section
              className="text-center pt-12 pb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className="font-display text-5xl md:text-6xl tracking-tight text-neutral-950 leading-tight">
                {hasResult
                  ? learningMode
                    ? '学习生成中'
                    : '解构完成'
                  : learningMode
                  ? '审美训练'
                  : '视觉解构'}
              </h1>
              <p className="font-sans text-base text-neutral-400 mt-4 tracking-wide max-w-md mx-auto leading-relaxed">
                {learningMode
                  ? hasResult
                    ? '根据你的图片，解锁以下美学概念卡片'
                    : '上传图片，系统将为你匹配对应的美学知识点'
                  : hasResult
                  ? '以下是对您图片的视觉语言分析'
                  : '上传一张图片，揭示其色彩、构图与风格的底层设计语言'}
              </p>
              <div className="section-divider mt-10" />
            </motion.section>

            {learningMode && !hasResult && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-12"
              >
                <div className="relative p-6 md:p-8 overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
                  border: '1px solid #E5E5E5',
                }}>
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: '#1A1A1A' }} />
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-14 h-14 shrink-0 bg-neutral-950 flex items-center justify-center">
                      <GraduationCap size={26} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-2xl tracking-wide text-neutral-900 leading-tight">
                        你现在是训练者，不仅是观察者
                      </h2>
                      <p className="font-sans text-[13px] text-neutral-600 mt-3 leading-relaxed">
                        每上传一张图片，系统会自动识别其背后的美学原理，并为你生成专属学习卡片。
                        点击概念词深入探索，完成学习后标记为"已掌握"，追踪你的审美成长轨迹。
                      </p>
                      <div className="mt-5 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Lightbulb size={14} className="text-amber-500" />
                          <span className="font-sans text-xs text-neutral-600 tracking-wide">
                            {learningProgress.unlockedConcepts.length > 0
                              ? `已解锁 ${learningProgress.unlockedConcepts.length} 个概念`
                              : '20+ 美学概念待解锁'}
                          </span>
                        </div>
                        <button
                          onClick={() => setAcademyOpen(true)}
                          className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wide text-neutral-800 border-b border-neutral-300 hover:border-neutral-800 pb-0.5 transition-colors duration-200"
                        >
                          查看课程体系
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <UploadZone />
            </motion.section>

            <AnimatePresence>
              {hasCards && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="mt-16"
                >
                  <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                        <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500">
                          Learning Cards · 学习卡片
                        </span>
                      </div>
                      <h2 className="font-display text-3xl tracking-wide text-neutral-900 leading-tight">
                        从这张图片，学习这些
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-display text-2xl text-neutral-900 leading-none">
                          {learningCards.filter(c => c.completed).length}
                          <span className="text-neutral-300">/{learningCards.length}</span>
                        </p>
                        <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-400 mt-1">
                          已掌握
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {learningCards.map((card, index) => (
                      <LearningCard
                        key={card.id}
                        card={card}
                        index={index}
                        isActive={activeCardId === card.id || (!activeCardId && index === 0)}
                      />
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasResult && result && !learningMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-16"
                >
                  <div className="md:hidden mb-10 flex justify-center">
                    <AestheticWhitepaper />
                  </div>

                  <AestheticMovements tags={result.tags} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnalysisPanel />

            <AnimatePresence>
              {hasResult && !learningMode && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="mt-20"
                >
                  <div className="section-divider mb-10" />
                  <ReverseGenerator />
                </motion.section>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasResult && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-24"
                >
                  <div className="relative p-10 md:p-14 bg-neutral-950 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 border border-neutral-800 -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-neutral-900 -translate-x-1/4 translate-y-1/4" />
                    <div className="relative max-w-2xl mx-auto text-center">
                      <Sparkles size={28} className="mx-auto text-neutral-500 mb-6" />
                      <h2
                        className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-5"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        沉淀与分享<br />你的审美洞察
                      </h2>
                      <p className="font-sans text-sm text-neutral-400 tracking-wide leading-relaxed mb-8 max-w-lg mx-auto">
                        将当前分析结果导出为排版精致的审美白皮书卡片，
                        支持图片和 PDF 两种格式，优雅地保存与分享你的发现。
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <div className="sm:hidden">
                          <AestheticWhitepaper />
                        </div>
                        <div className="hidden sm:block">
                          <AestheticWhitepaper />
                        </div>
                        <div className="flex items-center gap-1.5 font-sans text-[11px] tracking-wider text-neutral-600">
                          <ArrowUpRight size={12} />
                          <span>支持 PNG & PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="py-8 border-t border-neutral-100">
          <p className="text-center font-sans text-[11px] text-neutral-300 tracking-widest uppercase">
            Visual Deconstruct &mdash; 解构视觉，重构审美
          </p>
        </footer>
      </div>

      <AestheticsAcademy />
    </div>
  )
}
