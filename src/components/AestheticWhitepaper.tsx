import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, FileImage, FileText, Sparkles, Grid3x3, BookOpen, MapPin, Clock, Quote } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { matchMovements } from '@/utils/movementMatcher'
import { getColorEmotion } from '@/utils/colorEmotion'
import type { AestheticMovement as AestheticMovementType } from '@/types/analysis'

const typeLabels: Record<string, { name: string; desc: string }> = {
  horizontal: { name: '水平主导', desc: '画面以横向线条为主，传递稳定、宁静、开阔的视觉感受' },
  vertical: { name: '垂直主导', desc: '画面以纵向线条为主，传递挺拔、庄严、向上的视觉感受' },
  diagonal: { name: '对角主导', desc: '画面以斜线为主，传递动感、张力、活力的视觉感受' },
  curve: { name: '曲线主导', desc: '画面以流动曲线为主，传递优雅、柔和、有机的视觉感受' },
}

export default function AestheticWhitepaper() {
  const { status, result, imageUrl } = useAnalysisStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState<'idle' | 'image' | 'pdf'>('idle')
  const cardRef = useRef<HTMLDivElement>(null)

  const hasResult = status === 'complete' && result && imageUrl
  const canOpen = hasResult

  const openModal = useCallback(() => {
    if (canOpen) {
      setIsOpen(true)
    }
  }, [canOpen])

  const movements: AestheticMovementType[] = result
    ? matchMovements(result.tags)
    : []

  const detectedLines = result
    ? result.composition.filter((l) => !l.isGuide && l.strength > 0.05)
    : []
  const dominantType = detectedLines.length > 0 ? detectedLines[0].type : null

  const exportAsImage = useCallback(async () => {
    if (!cardRef.current) return
    setIsExporting('image')
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        allowTaint: true,
      })
      const link = document.createElement('a')
      link.download = `审美白皮书_${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setIsExporting('idle')
    }
  }, [])

  const exportAsPDF = useCallback(async () => {
    if (!cardRef.current) return
    setIsExporting('pdf')
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        allowTaint: true,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const x = (pdfWidth - imgWidth * ratio) / 2
      const y = (pdfHeight - imgHeight * ratio) / 2
      pdf.addImage(imgData, 'PNG', x, y, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`审美白皮书_${Date.now()}.pdf`)
    } finally {
      setIsExporting('idle')
    }
  }, [])

  return (
    <>
      <button
        onClick={openModal}
        disabled={!canOpen}
        className={`
          inline-flex items-center gap-2 px-5 py-2.5
          font-sans text-xs tracking-widest uppercase
          transition-all duration-300
          ${canOpen
            ? 'bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer'
            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }
        `}
      >
        <Sparkles size={14} />
        <span>导出审美白皮书</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-[900px] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportAsImage}
                    disabled={isExporting !== 'idle'}
                    className="
                      inline-flex items-center gap-2 px-4 py-2
                      bg-white text-neutral-700 border border-neutral-200
                      font-sans text-xs tracking-wider
                      hover:bg-neutral-50 hover:border-neutral-300
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    <FileImage size={14} />
                    <span>{isExporting === 'image' ? '生成中...' : '下载图片'}</span>
                  </button>
                  <button
                    onClick={exportAsPDF}
                    disabled={isExporting !== 'idle'}
                    className="
                      inline-flex items-center gap-2 px-4 py-2
                      bg-white text-neutral-700 border border-neutral-200
                      font-sans text-xs tracking-wider
                      hover:bg-neutral-50 hover:border-neutral-300
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    <FileText size={14} />
                    <span>{isExporting === 'pdf' ? '生成中...' : '下载 PDF'}</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="
                      inline-flex items-center justify-center w-10 h-10
                      bg-white text-neutral-500 border border-neutral-200
                      hover:bg-neutral-50 hover:text-neutral-700 hover:border-neutral-300
                      transition-all duration-200
                    "
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div
                ref={cardRef}
                className="bg-white shadow-2xl overflow-hidden"
                style={{ fontFamily: "'Playfair Display', Georgia, serif, 'DM Sans', system-ui, sans-serif" }}
              >
                <div className="relative" style={{ minHeight: '1200px' }}>
                  <div className="absolute top-0 left-0 w-16 h-full bg-neutral-50" />
                  <div className="absolute top-10 right-10 w-8 h-8 border-2 border-neutral-900" />
                  <div className="absolute bottom-10 right-10 w-4 h-4 bg-neutral-900" />

                  <div className="relative px-12 md:px-20 py-14 md:py-20">
                    <div className="flex items-baseline gap-4 mb-3">
                      <div className="w-12 h-px bg-neutral-400" />
                      <span
                        className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-500"
                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      >
                        Visual Deconstruct
                      </span>
                      <div className="w-12 h-px bg-neutral-400" />
                    </div>

                    <h1
                      className="font-display text-5xl md:text-7xl tracking-tight text-neutral-950 leading-[1.05] mt-6 mb-4"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      审美<br />白皮书
                    </h1>

                    <p
                      className="font-sans text-sm text-neutral-500 tracking-wide max-w-md leading-relaxed mb-12"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      AESTHETIC WHITEPAPER &mdash; 解构视觉语言，沉淀设计美学。
                      基于色彩矩阵、构图分析与艺术流派的深度解析报告。
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
                      <div className="lg:col-span-5">
                        {imageUrl && (
                          <div className="relative">
                            <div className="absolute -top-3 -left-3 w-full h-full border border-neutral-200 -z-10" />
                            <img
                              src={imageUrl}
                              alt="Analyzed artwork"
                              className="w-full h-auto block shadow-lg"
                            />
                            <div
                              className="mt-4 flex items-center gap-2"
                              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                            >
                              <div className="w-6 h-px bg-neutral-300" />
                              <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                                FIG. 01 &mdash; Original Image
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-7">
                        <div className="flex items-start gap-4 mb-10">
                          <div className="w-1 h-16 bg-neutral-900 mt-1 shrink-0" />
                          <div>
                            <h2
                              className="font-display text-3xl text-neutral-900 mb-3"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                              色彩矩阵
                            </h2>
                            <p
                              className="font-sans text-xs tracking-widest uppercase text-neutral-400"
                              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                            >
                              Color Matrix Analysis
                            </p>
                          </div>
                        </div>

                        {result && result.palette.length > 0 && (
                          <div className="space-y-8">
                            <div className="grid grid-cols-5 gap-2">
                              {result.palette.slice(0, 5).map((swatch, i) => {
                                const isLight = swatch.hsl.l > 55
                                return (
                                  <div key={swatch.hex + i} className="flex flex-col items-center gap-2">
                                    <div
                                      className="w-full aspect-square shadow-sm"
                                      style={{ backgroundColor: swatch.hex }}
                                    >
                                      <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <span
                                          className={`font-sans text-[9px] tracking-wider font-medium ${isLight ? 'text-neutral-900/70' : 'text-white/80'}`}
                                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                        >
                                          {swatch.hex}
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className="text-center w-full"
                                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                    >
                                      <p className="font-sans text-[10px] tracking-wider uppercase text-neutral-700">
                                        {swatch.hex}
                                      </p>
                                      <p className="font-sans text-[9px] text-neutral-400 mt-0.5">
                                        {swatch.percentage}%
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>

                            <div className="h-2 w-full flex overflow-hidden">
                              {result.palette.slice(0, 5).map((swatch, i) => (
                                <div
                                  key={`bar-${swatch.hex}-${i}`}
                                  className="h-full"
                                  style={{
                                    backgroundColor: swatch.hex,
                                    width: `${swatch.percentage}%`,
                                  }}
                                />
                              ))}
                            </div>

                            <div
                              className="pt-6 border-t border-neutral-100 space-y-4"
                              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                            >
                              <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                                情绪色谱 / Emotional Palette
                              </p>
                              <div className="grid grid-cols-1 gap-3">
                                {result.palette.slice(0, 3).map((swatch, i) => {
                                  const emotion = getColorEmotion(swatch.hsl)
                                  return (
                                    <div key={swatch.hex + '-e' + i} className="flex items-start gap-4 p-4 bg-neutral-50/60 border border-neutral-100/60">
                                      <div
                                        className="w-8 h-8 shrink-0 shadow-sm"
                                        style={{ backgroundColor: swatch.hex }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <p className="font-display text-base text-neutral-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            {swatch.hex}
                                          </p>
                                          <div className="flex flex-wrap gap-1">
                                            {emotion.tags.slice(0, 2).map((tag, j) => (
                                              <span
                                                key={tag + j}
                                                className="inline-flex px-2 py-0.5 bg-white border border-neutral-200 font-sans text-[9px] tracking-wide text-neutral-600"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
                                          {emotion.description}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="section-divider mt-20 mb-20" style={{ width: '48px', height: '1px', backgroundColor: '#CBCBCB', marginLeft: 0 }} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-7">
                        <div className="flex items-start gap-4 mb-10">
                          <div className="w-1 h-16 bg-neutral-900 mt-1 shrink-0" />
                          <div>
                            <h2
                              className="font-display text-3xl text-neutral-900 mb-3"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                              构图分析
                            </h2>
                            <p
                              className="font-sans text-xs tracking-widest uppercase text-neutral-400"
                              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                            >
                              Composition Analysis
                            </p>
                          </div>
                        </div>

                        {dominantType && (
                          <div
                            className="mb-8 p-6 bg-neutral-50 border border-neutral-100"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <Grid3x3 size={16} className="text-neutral-400" />
                              <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500">
                                主导构图特征
                              </span>
                            </div>
                            <p
                              className="font-display text-2xl text-neutral-900 mb-3"
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                              {typeLabels[dominantType]?.name || '混合构图'}
                            </p>
                            <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                              {typeLabels[dominantType]?.desc || '画面包含多种方向的线条元素，构建出丰富而多层次的视觉叙事空间。'}
                            </p>
                          </div>
                        )}

                        {detectedLines.length > 0 && (
                          <div
                            className="space-y-3"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                              结构线索 / Structural Lines
                            </p>
                            <div className="space-y-2">
                              {detectedLines.slice(0, 4).map((line, i) => (
                                <div
                                  key={`line-${i}`}
                                  className="flex items-center gap-4 p-3 border border-neutral-100 hover:border-neutral-200 transition-colors"
                                >
                                  <div
                                    className="w-10 h-px bg-neutral-900 shrink-0"
                                    style={{ transform: `rotate(${line.angle}deg)` }}
                                  />
                                  <div className="flex-1">
                                    <p className="font-sans text-xs font-medium text-neutral-800">
                                      {line.label ||
                                        (line.type === 'horizontal' ? '主水平线' :
                                         line.type === 'vertical' ? '主垂直线' :
                                         line.type === 'diagonal' ? '主对角线' : '结构曲线')}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-20 h-1 bg-neutral-100 overflow-hidden">
                                      <div
                                        className="h-full bg-neutral-700"
                                        style={{ width: `${Math.round(line.strength * 100)}%` }}
                                      />
                                    </div>
                                    <span className="font-sans text-[10px] text-neutral-500 w-10 text-right">
                                      {Math.round(line.strength * 100)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5">
                        <div
                          className="h-full p-8 border border-neutral-200 bg-neutral-50/30"
                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-6 h-6 border border-neutral-400 flex items-center justify-center">
                              <div className="w-2 h-2 bg-neutral-900" />
                            </div>
                            <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500">
                              Visual Notes
                            </span>
                          </div>
                          <Quote size={28} className="text-neutral-200 mb-5" />
                          <p
                            className="font-display text-2xl text-neutral-800 leading-[1.4] italic mb-6"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            构图是视觉的语法，色彩是情感的词汇，二者共同书写出图像无声的诗。
                          </p>
                          <div className="w-16 h-px bg-neutral-300 mb-4" />
                          <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
                            每一幅成功的图像背后，都隐藏着经过精心排布的视觉秩序。
                            从黄金分割到三分法则，从对称平衡到动态张力，
                            这些构成法则共同塑造了我们对美的直觉感知。
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="section-divider mt-20 mb-20" style={{ width: '48px', height: '1px', backgroundColor: '#CBCBCB', marginLeft: 0 }} />

                    <div>
                      <div className="flex items-start gap-4 mb-12">
                        <div className="w-1 h-16 bg-neutral-900 mt-1 shrink-0" />
                        <div>
                          <h2
                            className="font-display text-3xl text-neutral-900 mb-3"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            流派解构
                          </h2>
                          <p
                            className="font-sans text-xs tracking-widest uppercase text-neutral-400"
                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                          >
                            Aesthetic Movements Deconstructed
                          </p>
                        </div>
                      </div>

                      {movements.length > 0 ? (
                        <div className="space-y-10">
                          {movements.map((movement, index) => (
                            <div
                              key={movement.id}
                              className="relative"
                            >
                              <div
                                className="absolute top-0 left-0 w-full h-[3px]"
                                style={{ backgroundColor: movement.accentColor }}
                              />
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 pb-4">
                                <div className="md:col-span-2">
                                  <div
                                    className="flex items-center justify-center"
                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                  >
                                    <span className="font-display text-6xl text-neutral-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                      0{index + 1}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="md:col-span-10"
                                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                >
                                  <div className="flex items-baseline flex-wrap gap-4 mb-3">
                                    <h3
                                      className="font-display text-3xl tracking-wide text-neutral-900"
                                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                    >
                                      {movement.name}
                                    </h3>
                                    <span className="font-sans text-xs tracking-[0.2em] uppercase text-neutral-400">
                                      {movement.nameEn}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-6 mb-5 text-xs">
                                    <span className="inline-flex items-center gap-1.5 text-neutral-500">
                                      <Clock size={12} />
                                      <span>{movement.era}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-neutral-500">
                                      <MapPin size={12} />
                                      <span>{movement.origin}</span>
                                    </span>
                                  </div>

                                  <div className="flex items-start gap-3 mb-6 p-5 bg-neutral-50/70 border-l-4" style={{ borderLeftColor: movement.accentColor }}>
                                    <Quote size={15} className="text-neutral-300 mt-0.5 shrink-0" />
                                    <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                                      {movement.philosophy}
                                    </p>
                                  </div>

                                  <div className="mb-6">
                                    <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-400 mb-3">
                                      标志性设计原则
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {movement.principles.map((principle, i) => (
                                        <div key={principle + i} className="flex items-start gap-3">
                                          <span
                                            className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{ backgroundColor: movement.accentColor }}
                                          />
                                          <span className="font-sans text-xs text-neutral-700 leading-relaxed">
                                            {principle}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-400 mr-2">
                                      匹配标签
                                    </span>
                                    {movement.matchedTags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="font-sans text-[10px] px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-sm"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="p-10 text-center bg-neutral-50 border border-neutral-100"
                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        >
                          <BookOpen size={32} className="mx-auto text-neutral-300 mb-4" />
                          <p className="font-sans text-sm text-neutral-500">
                            暂无匹配的艺术流派
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-24 pt-10 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-neutral-900 flex items-center justify-center">
                          <div className="w-2 h-2 bg-neutral-900" />
                        </div>
                        <div>
                          <p className="font-display text-sm tracking-wider text-neutral-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            视觉解构
                          </p>
                          <p className="font-sans text-[9px] tracking-widest uppercase text-neutral-400">
                            Visual Deconstruct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-[10px] tracking-widest uppercase text-neutral-400">
                          Generated
                        </p>
                        <p className="font-sans text-xs text-neutral-600 mt-1">
                          {new Date().toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
