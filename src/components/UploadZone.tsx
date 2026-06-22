import { useCallback, useRef, useState } from 'react'
import { Upload, Image as ImageIcon, X, RefreshCw } from 'lucide-react'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { cn } from '@/lib/utils'

export default function UploadZone() {
  const { imageUrl, setImage, reset } = useAnalysisStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-auto max-h-[500px] object-contain"
          />
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/95 border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-all duration-200 hover:scale-105"
            title="删除图片"
          >
            <X size={16} />
          </button>
          <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/0 transition-colors duration-300" />
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={handleClickUpload}
            className="inline-flex items-center gap-2 px-5 py-2 border border-neutral-200 text-sm text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all duration-200"
          >
            <RefreshCw size={14} />
            重新上传
          </button>
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
