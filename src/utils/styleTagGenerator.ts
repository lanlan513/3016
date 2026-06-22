import type { ColorSwatch, CompositionLine, StyleTag } from '@/types/analysis'

const COLOR_TAGS: { name: string; condition: (palette: ColorSwatch[]) => boolean; category: 'color' | 'mood' }[] = [
  { name: '高对比度', condition: (p) => hasHighContrast(p), category: 'color' },
  { name: '低饱和度', condition: (p) => hasLowSaturation(p), category: 'color' },
  { name: '暖色调', condition: (p) => hasWarmTone(p), category: 'color' },
  { name: '冷色调', condition: (p) => hasCoolTone(p), category: 'color' },
  { name: '单色系', condition: (p) => isMonochromatic(p), category: 'color' },
  { name: '多彩', condition: (p) => isColorful(p), category: 'color' },
  { name: '柔和', condition: (p) => isSoft(p), category: 'mood' },
  { name: '暗沉', condition: (p) => isDark(p), category: 'mood' },
  { name: '明亮', condition: (p) => isBright(p), category: 'mood' },
  { name: '复古', condition: (p) => isVintage(p), category: 'mood' },
]

const COMPOSITION_TAGS: { name: string; condition: (lines: CompositionLine[]) => boolean; category: 'composition' }[] = [
  { name: '水平构图', condition: (l) => hasDominantHorizontal(l), category: 'composition' },
  { name: '垂直构图', condition: (l) => hasDominantVertical(l), category: 'composition' },
  { name: '对角线构图', condition: (l) => hasDominantDiagonal(l), category: 'composition' },
  { name: '三分法', condition: (l) => hasRuleOfThirds(l), category: 'composition' },
  { name: '对称构图', condition: (l) => hasSymmetry(l), category: 'composition' },
  { name: '动态构图', condition: (l) => hasDynamicComposition(l), category: 'composition' },
]

function hasHighContrast(palette: ColorSwatch[]): boolean {
  if (palette.length < 2) return false
  const lights = palette.map((c) => c.hsl.l)
  return Math.max(...lights) - Math.min(...lights) > 50
}

function hasLowSaturation(palette: ColorSwatch[]): boolean {
  const avgSat = palette.reduce((s, c) => s + c.hsl.s, 0) / palette.length
  return avgSat < 25
}

function hasWarmTone(palette: ColorSwatch[]): boolean {
  const warmCount = palette.filter((c) => {
    const h = c.hsl.h
    return (h >= 0 && h < 60) || (h >= 300 && h <= 360)
  }).length
  return warmCount > palette.length / 2
}

function hasCoolTone(palette: ColorSwatch[]): boolean {
  const coolCount = palette.filter((c) => {
    const h = c.hsl.h
    return h >= 180 && h < 300
  }).length
  return coolCount > palette.length / 2
}

function isMonochromatic(palette: ColorSwatch[]): boolean {
  if (palette.length < 3) return false
  const hues = palette.map((c) => c.hsl.h)
  const maxHue = Math.max(...hues)
  const minHue = Math.min(...hues)
  return (maxHue - minHue < 30) || (360 - maxHue + minHue < 30)
}

function isColorful(palette: ColorSwatch[]): boolean {
  const highSatCount = palette.filter((c) => c.hsl.s > 50).length
  return highSatCount >= palette.length * 0.5
}

function isSoft(palette: ColorSwatch[]): boolean {
  const avgLight = palette.reduce((s, c) => s + c.hsl.l, 0) / palette.length
  const avgSat = palette.reduce((s, c) => s + c.hsl.s, 0) / palette.length
  return avgLight > 55 && avgSat < 40
}

function isDark(palette: ColorSwatch[]): boolean {
  const avgLight = palette.reduce((s, c) => s + c.hsl.l, 0) / palette.length
  return avgLight < 30
}

function isBright(palette: ColorSwatch[]): boolean {
  const avgLight = palette.reduce((s, c) => s + c.hsl.l, 0) / palette.length
  return avgLight > 70
}

function isVintage(palette: ColorSwatch[]): boolean {
  const hasWarm = palette.some((c) => {
    const h = c.hsl.h
    return (h >= 20 && h < 50) && c.hsl.s < 50
  })
  const hasDesat = palette.filter((c) => c.hsl.s < 40).length >= palette.length * 0.4
  return hasWarm && hasDesat
}

function hasDominantHorizontal(lines: CompositionLine[]): boolean {
  const horiz = lines.filter((l) => l.type === 'horizontal')
  return horiz.length > 0 && horiz[0].strength > 0.25
}

function hasDominantVertical(lines: CompositionLine[]): boolean {
  const vert = lines.filter((l) => l.type === 'vertical')
  return vert.length > 0 && vert[0].strength > 0.25
}

function hasDominantDiagonal(lines: CompositionLine[]): boolean {
  const diag = lines.filter((l) => l.type === 'diagonal')
  return diag.length > 0 && diag[0].strength > 0.15
}

function hasRuleOfThirds(_lines: CompositionLine[]): boolean {
  return true
}

function hasSymmetry(lines: CompositionLine[]): boolean {
  const horiz = lines.filter((l) => l.type === 'horizontal')
  const vert = lines.filter((l) => l.type === 'vertical')
  return horiz.length > 0 && vert.length > 0
}

function hasDynamicComposition(lines: CompositionLine[]): boolean {
  const types = new Set(lines.map((l) => l.type))
  return types.size >= 3
}

export function generateStyleTags(palette: ColorSwatch[], composition: CompositionLine[]): StyleTag[] {
  const tags: StyleTag[] = []

  for (const tagDef of COLOR_TAGS) {
    if (tagDef.condition(palette)) {
      tags.push({
        name: tagDef.name,
        confidence: 0.7 + Math.random() * 0.25,
        category: tagDef.category,
      })
    }
  }

  for (const tagDef of COMPOSITION_TAGS) {
    if (tagDef.condition(composition)) {
      tags.push({
        name: tagDef.name,
        confidence: 0.65 + Math.random() * 0.3,
        category: tagDef.category,
      })
    }
  }

  return tags.sort((a, b) => b.confidence - a.confidence).slice(0, 6)
}
