import { useCallback, useRef, useState, useEffect } from 'react'
import { Upload, Image as ImageIcon, X, RefreshCw, Grid3x3, Diamond, Triangle, Minus } from 'lucide-react'
import { useAnalysisStore, type GuideMode } from '@/store/useAnalysisStore'
import { cn } from '@/lib/utils'
import CompositionGuideOverlay from './CompositionGuideOverlay'

const guideOptions: { mode: GuideMode; label: string; icon: typeof Grid3x3 }[] = [
  { mode: null, label: '关闭', icon: Minus },
  { mode: 'thirds', label: '三分法', icon: Grid3x3 },
  { mode: 'golden', label: '黄金分割', icon: Diamond },
  { mode: 'diagonal', label: '对角线', icon: Triangle },
]

export default function UploadZone() {
  const { imageUrl, setImage, reset, guideMode, setGuideMode } = useAnalysisStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [dimensions, setDimensions] = useState({ width: 640, height: 400 })

  useEffect(() => {
    if (!imgRef.current || !imageUrl) return
    const img = imgRef.current
    const updateDimensions = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
    }
    if (img.complete) {
      updateDimensions()
    } else {
      img.addEventListener('load', updateDimensions)
      return () => img.removeEventListener('load', updateDimensions)
    }
  }, [imageUrl])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setImage(file, url)
  }, [setImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleClickUpload = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    reset()
  }, [reset])

  if (imageUrl) {
    return (
      <div className="w-full max-w-[640px] mx-auto">
        <div className="relative overflow-hidden border border-neutral-200 bg-neutral-50 group">
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-auto max-h-[500px] object-contain"
          />
          {guideMode && (
            <CompositionGuideOverlay
              mode={guideMode}
              imageWidth={dimensions.width}
              imageHeight={dimensions.height}
            />
          )}
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/95 border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-all duration-200 hover:scale-105 z-20"
            title="删除图片"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleClickUpload}
              className="inline-flex items-center gap-2 px-5 py-2 border border-neutral-200 text-sm text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all duration-200"
            >
              <RefreshCw size={14} />
              重新上传
            </button>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="font-sans text-[10px] text-neutral-400 tracking-widest uppercase mr-2">
              构图辅助线
            </span>
            {guideOptions.map((opt) => {
              const Icon = opt.icon
              const isActive = guideMode === opt.mode
              return (
                <button
                  key={opt.label}
                  onClick={() => setGuideMode(opt.mode)}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1.5 border transition-all duration-200
                    font-sans text-[10px] tracking-wide
                    ${isActive
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-700'
                    }
                  `}
                  title={opt.label}
                >
                  <Icon size={11} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div
      onClick={handleClickUpload}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'w-full max-w-[640px] mx-auto border-2 border-dashed p-16 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-300',
        isDragOver
          ? 'border-neutral-900 bg-neutral-50 scale-[1.01]'
          : 'border-neutral-300 hover:border-neutral-400 bg-transparent animate-pulse-border'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className={cn(
        'w-14 h-14 border border-neutral-300 flex items-center justify-center transition-colors duration-300',
        isDragOver ? 'border-neutral-900 bg-neutral-900 text-white' : 'text-neutral-400'
      )}>
        {isDragOver ? <ImageIcon size={24} /> : <Upload size={24} />}
      </div>
      <div className="text-center">
        <p className="font-sans text-sm text-neutral-500 tracking-wide">
          拖拽图片至此处，或点击上传
        </p>
        <p className="font-sans text-xs text-neutral-400 mt-2">
          支持 JPG、PNG、WebP 格式
        </p>
      </div>
    </div>
  )
}
