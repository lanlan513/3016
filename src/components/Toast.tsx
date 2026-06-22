import { useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface ToastProps {
  visible: boolean
  message: string
  icon?: 'copy' | 'check'
  onClose: () => void
  duration?: number
}

export default function Toast({ visible, message, icon = 'check', onClose, duration = 1800 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-1/2 bottom-12 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 text-white rounded-full shadow-lg">
            <div className="flex items-center justify-center">
              {icon === 'copy' ? (
                <Copy size={14} className="opacity-90" />
              ) : (
                <Check size={14} className="opacity-90" />
              )}
            </div>
            <span className="font-sans text-xs tracking-wide whitespace-nowrap">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
