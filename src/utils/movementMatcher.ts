import type { StyleTag, AestheticMovement } from '@/types/analysis'
import { aestheticMovements } from './aestheticMovementData'

export function matchMovements(tags: StyleTag[]): AestheticMovement[] {
  const tagNames = new Set(tags.map((t) => t.name))

  const scored = aestheticMovements
    .map((movement) => {
      const matchCount = movement.matchedTags.filter((t) => tagNames.has(t)).length
      const score = matchCount / movement.matchedTags.length
      return { movement, score, matchCount }
    })
    .filter((entry) => entry.matchCount >= 1)
    .sort((a, b) => b.score - a.score || b.matchCount - a.matchCount)

  return scored.slice(0, 3).map((entry) => entry.movement)
}
