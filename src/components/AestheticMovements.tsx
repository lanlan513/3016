import { useMemo } from 'react'
import type { StyleTag } from '@/types/analysis'
import { matchMovements } from '@/utils/movementMatcher'
import AestheticMovementCard from './AestheticMovementCard'
import { BookOpen } from 'lucide-react'

interface AestheticMovementsProps {
  tags: StyleTag[]
}

export default function AestheticMovements({ tags }: AestheticMovementsProps) {
  const movements = useMemo(() => matchMovements(tags), [tags])

  if (movements.length === 0) return null

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={18} className="text-neutral-400" />
        <h2 className="analysis-section-title mb-0">历史与流派审美</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {movements.map((movement, i) => (
          <AestheticMovementCard key={movement.id} movement={movement} index={i} />
        ))}
      </div>
    </div>
  )
}
