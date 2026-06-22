import Header from '@/components/Header'
import UploadZone from '@/components/UploadZone'
import AnalysisPanel from '@/components/AnalysisPanel'
import { motion } from 'motion/react'
import { useAnalysisStore } from '@/store/useAnalysisStore'

export default function Home() {
  const { status } = useAnalysisStore()
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

        <AnalysisPanel />
      </main>

      <footer className="py-8 border-t border-neutral-100">
        <p className="text-center font-sans text-[11px] text-neutral-300 tracking-widest uppercase">
          Visual Deconstruct &mdash; 解构视觉，重构审美
        </p>
      </footer>
    </div>
  )
}
