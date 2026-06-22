import type { StyleTag as StyleTagType } from '@/types/analysis'
import { Tags } from 'lucide-react'

interface StyleTagCloudProps {
  tags: StyleTagType[]
}

const categoryColors: Record<string, string> = {
  color: 'border-neutral-300',
  composition: 'border-neutral-400',
  mood: 'border-neutral-200',
}

const categoryLabels: Record<string, string> = {
  color: '色彩',
  composition: '构图',
  mood: '氛围',
}

export default function StyleTagCloud({ tags }: StyleTagCloudProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <Tags size={18} className="text-neutral-400" />
        <h2 className="analysis-section-title mb-0">风格标签</h2>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {tags.map((tag, i) => (
          <div
            key={tag.name}
            className={`tag-pill ${categoryColors[tag.category]} opacity-0 animate-fade-in-up`}
            style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'forwards' }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 bg-neutral-400" />
            <span>{tag.name}</span>
            <span className="ml-2 text-[10px] text-neutral-400 font-sans">
              {categoryLabels[tag.category]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
