import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { ColorSwatch as ColorSwatchType } from '@/types/analysis'

interface ColorSwatchProps {
  swatch: ColorSwatchType
  index: number
}

export default function ColorSwatch({ swatch, index }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isLight = swatch.hsl.l > 55

  return (
    <div
      className="flex flex-col items-center gap-3 opacity-0 animate-swatch-pop"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <div
        className="relative group cursor-pointer w-full aspect-square transition-all duration-300 hover:scale-110 hover:shadow-lg"
        style={{ backgroundColor: swatch.hex }}
        onClick={() => handleCopy(swatch.hex)}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className={`p-1.5 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </div>
        </div>
      </div>

      <div className="text-center w-full">
        <p className="font-sans text-xs tracking-wider text-neutral-600 uppercase">
          {swatch.hex}
        </p>
        <p className="font-sans text-[10px] text-neutral-400 mt-0.5">
          {swatch.percentage}%
        </p>
      </div>

      {showDetail && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-neutral-200 px-3 py-2 shadow-sm z-10 whitespace-nowrap">
          <p className="font-sans text-[10px] text-neutral-500">
            RGB({swatch.rgb.r}, {swatch.rgb.g}, {swatch.rgb.b})
          </p>
          <p className="font-sans text-[10px] text-neutral-500">
            HSL({swatch.hsl.h}, {swatch.hsl.s}%, {swatch.hsl.l}%)
          </p>
        </div>
      )}
    </div>
  )
}
