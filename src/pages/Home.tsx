import Header from '@/components/Header'
import UploadZone from '@/components/UploadZone'
import AnalysisPanel from '@/components/AnalysisPanel'
import AestheticMovements from '@/components/AestheticMovements'
import AestheticWhitepaper from '@/components/AestheticWhitepaper'
import { motion, AnimatePresence } from 'motion/react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export default function Home() {
  const { status, result } = useAnalysisStore()
  const hasResult = status === 'complete'

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[960px] mx-auto px-6 pb-24">
        <motion.section
          className="text-center pt-12 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-display text-5xl md:text-6xl tracking-tight text-neutral-950 leading-tight">
            {hasResult ? '解构完成' : '视觉解构'}
          </h1>
          <p className="font-sans text-base text-neutral-400 mt-4 tracking-wide max-w-md mx-auto leading-relaxed">
            {hasResult
              ? '以下是对您图片的视觉语言分析'
              : '上传一张图片，揭示其色彩、构图与风格的底层设计语言'}
          </p>
          <div className="section-divider mt-10" />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <UploadZone />
        </motion.section>

        <AnimatePresence>
          {hasResult && result && (
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
      </main>

      <footer className="py-8 border-t border-neutral-100">
        <p className="text-center font-sans text-[11px] text-neutral-300 tracking-widest uppercase">
          Visual Deconstruct &mdash; 解构视觉，重构审美
        </p>
      </footer>
    </div>
  )
}
