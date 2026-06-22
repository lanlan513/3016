import type {
  AestheticVariant,
  AnalysisResult,
  ColorSwatch,
  CompositionLine,
  StyleTag,
  ColorTrajectory,
  CompositionTrajectory,
  StyleTagTrajectory,
  VariantType,
} from '@/types/analysis'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function cloneColorSwatch(swatch: ColorSwatch): ColorSwatch {
  return {
    hex: swatch.hex,
    rgb: { ...swatch.rgb },
    hsl: { ...swatch.hsl },
    percentage: swatch.percentage,
  }
}

function desaturateColor(swatch: ColorSwatch, factor: number = 0.7): ColorSwatch {
  const newS = Math.max(0, swatch.hsl.s * (1 - factor))
  const newL = swatch.hsl.l
  const rgb = hslToRgb(swatch.hsl.h, newS, newL)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: swatch.hsl.h, s: Math.round(newS), l: newL },
    percentage: swatch.percentage,
  }
}

function increaseContrast(swatch: ColorSwatch, factor: number = 0.25): ColorSwatch {
  const currentL = swatch.hsl.l
  let newL: number
  if (currentL >= 50) {
    newL = Math.min(100, currentL + (100 - currentL) * factor)
  } else {
    newL = Math.max(0, currentL - currentL * factor)
  }
  const rgb = hslToRgb(swatch.hsl.h, swatch.hsl.s, newL)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: swatch.hsl.h, s: swatch.hsl.s, l: Math.round(newL) },
    percentage: swatch.percentage,
  }
}

function pushToWarm(swatch: ColorSwatch, intensity: number = 0.4): ColorSwatch {
  let h = swatch.hsl.h
  const s = Math.min(100, swatch.hsl.s + 15 * intensity)
  if (h >= 0 && h < 60) {
    h = h + (35 - h) * intensity
  } else if (h >= 180 && h < 300) {
    h = (h + 80 * intensity) % 360
  } else if (h >= 300) {
    h = h - (h - 345) * intensity
  }
  const rgb = hslToRgb(h, s, swatch.hsl.l)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: Math.round(h), s: Math.round(s), l: swatch.hsl.l },
    percentage: swatch.percentage,
  }
}

function pushToCool(swatch: ColorSwatch, intensity: number = 0.4): ColorSwatch {
  let h = swatch.hsl.h
  const s = Math.min(100, swatch.hsl.s + 12 * intensity)
  if (h >= 0 && h < 60) {
    h = (h + 200 * intensity) % 360
  } else if (h >= 300) {
    h = (h + 60 * intensity) % 360
  } else if (h >= 60 && h < 180) {
    h = h + (210 - h) * intensity * 0.5
  }
  const rgb = hslToRgb(h, s, swatch.hsl.l)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: Math.round(h), s: Math.round(s), l: swatch.hsl.l },
    percentage: swatch.percentage,
  }
}

function reducePalette(palette: ColorSwatch[], targetCount: number = 3): ColorSwatch[] {
  if (palette.length <= targetCount) return palette.map(cloneColorSwatch)
  const sorted = [...palette].sort((a, b) => b.percentage - a.percentage)
  const topColors = sorted.slice(0, targetCount)
  const totalPct = topColors.reduce((s, c) => s + c.percentage, 0)
  return topColors.map((c) => ({
    ...cloneColorSwatch(c),
    percentage: Math.round((c.percentage / totalPct) * 100),
  }))
}

function boostSaturation(swatch: ColorSwatch, factor: number = 0.5): ColorSwatch {
  const newS = Math.min(100, swatch.hsl.s + (100 - swatch.hsl.s) * factor)
  const rgb = hslToRgb(swatch.hsl.h, newS, swatch.hsl.l)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: swatch.hsl.h, s: Math.round(newS), l: swatch.hsl.l },
    percentage: swatch.percentage,
  }
}

function splitComplementHue(h: number): number[] {
  return [(h + 150) % 360, (h + 210) % 360]
}

function generateMinimalistPalette(original: ColorSwatch[]): ColorSwatch[] {
  const reduced = reducePalette(original, 3)
  return reduced.map((c, i) => {
    if (i === 0) return desaturateColor(increaseContrast(c, 0.15), 0.6)
    return desaturateColor(c, 0.75)
  })
}

function generateEmotionalPalette(original: ColorSwatch[]): ColorSwatch[] {
  const avgL = original.reduce((s, c) => s + c.hsl.l, 0) / original.length
  const isDark = avgL < 45
  return original.map((c) => {
    let result = boostSaturation(c, 0.55)
    result = increaseContrast(result, 0.2)
    if (isDark) {
      result = pushToWarm(result, 0.5)
    } else {
      result = pushToCool(result, 0.35)
    }
    return result
  })
}

function generateDeconstructivePalette(original: ColorSwatch[]): ColorSwatch[] {
  if (original.length === 0) return original
  const primaryHue = original[0].hsl.h
  const complements = splitComplementHue(primaryHue)
  const result: ColorSwatch[] = []
  original.forEach((c, i) => {
    if (i === 0) {
      result.push(boostSaturation(increaseContrast(c, 0.3), 0.6))
    } else if (i < 3) {
      const targetHue = complements[i - 1]
      const newHue = c.hsl.h + (targetHue - c.hsl.h) * 0.6
      const rgb = hslToRgb(newHue, Math.min(100, c.hsl.s + 25), c.hsl.l)
      result.push({
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { h: Math.round(newHue % 360), s: Math.min(100, Math.round(c.hsl.s + 25)), l: c.hsl.l },
        percentage: c.percentage,
      })
    } else {
      const boosted = boostSaturation(c, 0.4)
      const rgb = hslToRgb((boosted.hsl.h + 180) % 360, boosted.hsl.s, boosted.hsl.l)
      result.push({
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { h: (boosted.hsl.h + 180) % 360, s: boosted.hsl.s, l: boosted.hsl.l },
        percentage: c.percentage,
      })
    }
  })
  return result
}

function simplifyComposition(original: CompositionLine[]): CompositionLine[] {
  const realLines = original.filter((l) => !l.isGuide)
  if (realLines.length === 0) return original
  const sorted = [...realLines].sort((a, b) => b.strength - a.strength)
  const strongest = sorted.slice(0, 2)
  return strongest.map((l) => ({
    ...l,
    strength: Math.min(1, l.strength * 1.3),
  }))
}

function dramatizeComposition(original: CompositionLine[]): CompositionLine[] {
  return original
    .filter((l) => !l.isGuide)
    .map((l) => {
      let strength = Math.min(1, l.strength * 1.6)
      if (l.type === 'diagonal') strength = Math.min(1, strength * 1.4)
      return { ...l, strength }
    })
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5)
}

function fragmentComposition(original: CompositionLine[]): CompositionLine[] {
  const realLines = original.filter((l) => !l.isGuide)
  const result: CompositionLine[] = []
  realLines.forEach((l) => {
    result.push({ ...l, strength: l.strength * 0.6 })
    const midX = (l.startPoint.x + l.endPoint.x) / 2
    const midY = (l.startPoint.y + l.endPoint.y) / 2
    result.push({
      type: 'diagonal',
      angle: (l.angle + 45) % 180,
      strength: l.strength * 0.4,
      startPoint: { x: midX, y: l.startPoint.y },
      endPoint: { x: l.endPoint.x, y: midY },
    })
  })
  return result.slice(0, 8)
}

function generateMinimalistTags(original: StyleTag[]): StyleTag[] {
  const minimalistPool: StyleTag[] = [
    { name: '极简主义', confidence: 0.92, category: 'mood' },
    { name: '留白', confidence: 0.88, category: 'composition' },
    { name: '低饱和度', confidence: 0.85, category: 'color' },
    { name: '单色系', confidence: 0.78, category: 'color' },
    { name: '秩序感', confidence: 0.82, category: 'composition' },
    { name: '宁静', confidence: 0.86, category: 'mood' },
  ]
  const existingNames = new Set(original.map((t) => t.name))
  const result = original
    .filter((t) => ['低饱和度', '单色系', '水平构图', '垂直构图', '对称构图', '柔和'].includes(t.name))
    .map((t) => ({ ...t, confidence: Math.min(1, t.confidence + 0.1) }))
  for (const tag of minimalistPool) {
    if (!existingNames.has(tag.name) && result.length < 6) {
      result.push(tag)
    }
  }
  return result.slice(0, 6)
}

function generateEmotionalTags(original: StyleTag[]): StyleTag[] {
  const emotionalPool: StyleTag[] = [
    { name: '戏剧张力', confidence: 0.89, category: 'mood' },
    { name: '高对比度', confidence: 0.91, category: 'color' },
    { name: '情绪化', confidence: 0.87, category: 'mood' },
    { name: '强烈', confidence: 0.84, category: 'mood' },
    { name: '动态构图', confidence: 0.82, category: 'composition' },
    { name: '对角线构图', confidence: 0.79, category: 'composition' },
  ]
  const result = original
    .filter((t) => ['高对比度', '暖色调', '冷色调', '明亮', '暗沉', '动态构图', '对角线构图'].includes(t.name))
    .map((t) => ({ ...t, confidence: Math.min(1, t.confidence + 0.12) }))
  for (const tag of emotionalPool) {
    if (!result.find((r) => r.name === tag.name) && result.length < 6) {
      result.push(tag)
    }
  }
  return result.slice(0, 6)
}

function generateDeconstructiveTags(original: StyleTag[]): StyleTag[] {
  const deconstructivePool: StyleTag[] = [
    { name: '解构主义', confidence: 0.93, category: 'mood' },
    { name: '碎片化', confidence: 0.86, category: 'composition' },
    { name: '打破秩序', confidence: 0.88, category: 'composition' },
    { name: '冲突感', confidence: 0.84, category: 'mood' },
    { name: '实验性', confidence: 0.81, category: 'mood' },
    { name: '多层次', confidence: 0.79, category: 'composition' },
  ]
  const result = original
    .filter((t) => ['动态构图', '多彩', '高对比度'].includes(t.name))
    .map((t) => ({ ...t, confidence: Math.min(1, t.confidence + 0.08) }))
  for (const tag of deconstructivePool) {
    if (!result.find((r) => r.name === tag.name) && result.length < 6) {
      result.push(tag)
    }
  }
  return result.slice(0, 6)
}

function generateColorTrajectory(
  original: ColorSwatch[],
  target: ColorSwatch[],
  variantType: VariantType
): ColorTrajectory {
  const descriptions: Record<VariantType, string> = {
    minimalist: '减少色彩数量，降低饱和度，以明度差异建立层次',
    emotional: '提升饱和度与对比度，向暖/冷极端偏移，强化色彩情绪',
    deconstructive: '引入互补色与分裂互补色，制造色彩张力与冲突',
  }
  const step1 = original.map((c, i) => {
    const t = target[i] || target[target.length - 1]
    if (!t) return cloneColorSwatch(c)
    const hsl = {
      h: Math.round(c.hsl.h + (t.hsl.h - c.hsl.h) * 0.33),
      s: Math.round(c.hsl.s + (t.hsl.s - c.hsl.s) * 0.33),
      l: Math.round(c.hsl.l + (t.hsl.l - c.hsl.l) * 0.33),
    }
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
    return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl, percentage: c.percentage }
  })
  const step2 = original.map((c, i) => {
    const t = target[i] || target[target.length - 1]
    if (!t) return cloneColorSwatch(c)
    const hsl = {
      h: Math.round(c.hsl.h + (t.hsl.h - c.hsl.h) * 0.66),
      s: Math.round(c.hsl.s + (t.hsl.s - c.hsl.s) * 0.66),
      l: Math.round(c.hsl.l + (t.hsl.l - c.hsl.l) * 0.66),
    }
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
    return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl, percentage: c.percentage }
  })
  return {
    original: original.map(cloneColorSwatch),
    target,
    steps: [
      { label: '偏移 33%', value: step1 },
      { label: '偏移 66%', value: step2 },
    ],
    description: descriptions[variantType],
  }
}

function generateCompositionTrajectory(
  original: CompositionLine[],
  target: CompositionLine[],
  variantType: VariantType
): CompositionTrajectory {
  const descriptions: Record<VariantType, string> = {
    minimalist: '提取最强结构线，去除干扰线条，强化核心骨架',
    emotional: '放大对角线与动态元素，增加线条强度对比',
    deconstructive: '拆分原有结构线，引入倾斜与交错元素，制造视觉冲突',
  }
  const transformations: Record<VariantType, string> = {
    minimalist: '提纯 → 强化 → 留白',
    emotional: '识别 → 放大 → 对比',
    deconstructive: '拆解 → 偏移 → 重组',
  }
  return {
    originalLines: original.filter((l) => !l.isGuide),
    targetLines: target,
    transformation: transformations[variantType],
    description: descriptions[variantType],
  }
}

function generateTagTrajectory(
  original: StyleTag[],
  target: StyleTag[],
  variantType: VariantType
): StyleTagTrajectory {
  const originalNames = new Set(original.map((t) => t.name))
  const targetNames = new Set(target.map((t) => t.name))
  const added = target.filter((t) => !originalNames.has(t.name)).map((t) => t.name)
  const removed = original.filter((t) => !targetNames.has(t.name)).map((t) => t.name)
  const descriptions: Record<VariantType, string> = {
    minimalist: '从繁复走向纯粹，以"少即是多"为核心筛选标准',
    emotional: '强化情绪指向性标签，突出氛围与张力的表达',
    deconstructive: '引入实验性与冲突性标签，打破传统审美框架',
  }
  return {
    original,
    target,
    added,
    removed,
    description: descriptions[variantType],
  }
}

const VARIANT_METADATA: Record<VariantType, {
  name: string
  nameEn: string
  description: string
  philosophy: string
  accentColor: string
}> = {
  minimalist: {
    name: '极简化',
    nameEn: 'Minimalist',
    description: '剥离一切非必要元素，用最少的视觉语言传达最核心的信息',
    philosophy: '"Less, but better." — Dieter Rams',
    accentColor: '#6B7280',
  },
  emotional: {
    name: '情绪强化',
    nameEn: 'Emotional Intensify',
    description: '放大色彩对比与构图张力，将视觉情绪推向极致',
    philosophy: '"色彩是一种情感语言，直接触动灵魂。" — Wassily Kandinsky',
    accentColor: '#DC2626',
  },
  deconstructive: {
    name: '结构解构',
    nameEn: 'Deconstructive',
    description: '打破传统构图秩序，通过碎片化与重组创造新的视觉张力',
    philosophy: '"秩序是美的基础，但打破秩序是创造的开始。"',
    accentColor: '#7C3AED',
  },
}

export function generateAestheticVariants(result: AnalysisResult): AestheticVariant[] {
  const variants: AestheticVariant[] = []
  const variantGenerators: {
    type: VariantType
    paletteFn: (p: ColorSwatch[]) => ColorSwatch[]
    compositionFn: (c: CompositionLine[]) => CompositionLine[]
    tagFn: (t: StyleTag[]) => StyleTag[]
  }[] = [
    {
      type: 'minimalist',
      paletteFn: generateMinimalistPalette,
      compositionFn: simplifyComposition,
      tagFn: generateMinimalistTags,
    },
    {
      type: 'emotional',
      paletteFn: generateEmotionalPalette,
      compositionFn: dramatizeComposition,
      tagFn: generateEmotionalTags,
    },
    {
      type: 'deconstructive',
      paletteFn: generateDeconstructivePalette,
      compositionFn: fragmentComposition,
      tagFn: generateDeconstructiveTags,
    },
  ]
  for (const gen of variantGenerators) {
    const palette = gen.paletteFn(result.palette)
    const composition = gen.compositionFn(result.composition)
    const tags = gen.tagFn(result.tags)
    const metadata = VARIANT_METADATA[gen.type]
    variants.push({
      id: `variant-${gen.type}-${Date.now()}`,
      type: gen.type,
      name: metadata.name,
      nameEn: metadata.nameEn,
      description: metadata.description,
      philosophy: metadata.philosophy,
      palette,
      composition,
      tags,
      colorTrajectory: generateColorTrajectory(result.palette, palette, gen.type),
      compositionTrajectory: generateCompositionTrajectory(result.composition, composition, gen.type),
      tagTrajectory: generateTagTrajectory(result.tags, tags, gen.type),
      accentColor: metadata.accentColor,
    })
  }
  return variants
}
