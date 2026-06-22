import type { ColorSwatch as ColorSwatchType } from '@/types/analysis'
import ColorSwatch from './ColorSwatch'
import { Droplets } from 'lucide-react'

interface PaletteExtractorProps {
  palette: ColorSwatchType[]
}

export default function PaletteExtractor({ palette }: PaletteExtractorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Droplets size={18} className="text-neutral-400" />
        <h2 className="analysis-section-title mb-0">色彩调色板</h2>
      </div>

      <div className="grid grid-cols-6 gap-4 md:grid-cols-8">
        {palette.map((swatch, i) => (
          <ColorSwatch key={swatch.hex} swatch={swatch} index={i} />
        ))}
      </div>

      <div className="mt-8 h-2 w-full flex overflow-hidden">
        {palette.map((swatch) => (
          <div
            key={swatch.hex}
            className="h-full transition-all duration-500"
            style={{
              backgroundColor: swatch.hex,
              width: `${swatch.percentage}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
