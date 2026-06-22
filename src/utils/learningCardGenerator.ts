import type {
  AnalysisResult,
  LearningCard,
  AestheticConcept,
  CourseCategory,
  CompositionLine,
} from '@/types/analysis'
import { aestheticConcepts } from './courseData'

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function getColorName(hue: number): string {
  if (hue < 30 || hue >= 330) return '红色'
  if (hue < 60) return '橙色'
  if (hue < 90) return '黄色'
  if (hue < 150) return '绿色'
  if (hue < 210) return '青色'
  if (hue < 270) return '蓝色'
  return '紫色'
}

interface ColorScore {
  temp: 'warm' | 'cool' | 'neutral'
  avgSaturation: number
  saturationVariance: number
  avgLightness: number
  colorRange: number
  dominantColors: string[]
  isMonochrome: boolean
  lightnessContrast: number
}

function analyzeColorFeatures(result: AnalysisResult): ColorScore {
  const palette = result.palette
  if (palette.length === 0) {
    return {
      temp: 'neutral',
      avgSaturation: 50,
      saturationVariance: 0,
      avgLightness: 50,
      colorRange: 0,
      dominantColors: [],
      isMonochrome: false,
      lightnessContrast: 0,
    }
  }

  const hsls = palette.map((s) => ({ ...s.hsl, weight: s.percentage }))
  const totalWeight = hsls.reduce((sum, h) => sum + h.weight, 0)

  let warmScore = 0
  let coolScore = 0
  const hues: number[] = []
  let satSum = 0
  let lightSum = 0

  hsls.forEach((h) => {
    const w = h.weight / totalWeight
    satSum += h.s * w
    lightSum += h.l * w
    hues.push(h.h)
    if ((h.h >= 0 && h.h < 60) || (h.h >= 330 && h.h <= 360)) {
      warmScore += h.weight
    } else if (h.h >= 150 && h.h < 300) {
      coolScore += h.weight
    }
  })

  const sats = hsls.map((h) => h.s)
  const satMean = sats.reduce((a, b) => a + b, 0) / sats.length
  const satVariance =
    sats.reduce((sum, s) => sum + Math.pow(s - satMean, 2), 0) / sats.length

  const lights = hsls.map((h) => h.l)
  const lightnessContrast = Math.max(...lights) - Math.min(...lights)

  const hueSet = new Set(hues.map((h) => getColorName(h)))
  const isMonochrome = hueSet.size <= 1

  const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length
  const hueVariance = hues.reduce((sum, h) => {
    let diff = Math.abs(h - avgHue)
    if (diff > 180) diff = 360 - diff
    return sum + diff * diff
  }, 0) / hues.length

  let temp: 'warm' | 'cool' | 'neutral' = 'neutral'
  if (warmScore > coolScore * 1.3) temp = 'warm'
  else if (coolScore > warmScore * 1.3) temp = 'cool'

  return {
    temp,
    avgSaturation: satSum,
    saturationVariance: Math.sqrt(satVariance),
    avgLightness: lightSum,
    colorRange: Math.sqrt(hueVariance),
    dominantColors: Array.from(hueSet),
    isMonochrome,
    lightnessContrast,
  }
}

interface CompositionScore {
  hasDiagonals: boolean
  hasStrongLines: boolean
  hasVerticals: boolean
  hasHorizontals: boolean
  lineCount: number
  avgStrength: number
  curveCount: number
}

function analyzeCompositionFeatures(result: AnalysisResult): CompositionScore {
  const comp = result.composition
  return {
    hasDiagonals: comp.some((l: CompositionLine) => l.type === 'diagonal'),
    hasStrongLines: comp.some((l: CompositionLine) => l.strength > 0.6),
    hasVerticals: comp.some((l: CompositionLine) => l.type === 'vertical'),
    hasHorizontals: comp.some((l: CompositionLine) => l.type === 'horizontal'),
    lineCount: comp.length,
    avgStrength:
      comp.length > 0
        ? comp.reduce((sum, l) => sum + l.strength, 0) / comp.length
        : 0,
    curveCount: comp.filter((l: CompositionLine) => l.type === 'curve').length,
  }
}

interface StyleScore {
  colorTags: string[]
  compositionTags: string[]
  moodTags: string[]
}

function analyzeStyleFeatures(result: AnalysisResult): StyleScore {
  return {
    colorTags: result.tags.filter((t) => t.category === 'color').map((t) => t.name),
    compositionTags: result.tags
      .filter((t) => t.category === 'composition')
      .map((t) => t.name),
    moodTags: result.tags.filter((t) => t.category === 'mood').map((t) => t.name),
  }
}

interface ConceptMatch {
  concept: AestheticConcept
  score: number
  evidence: string
}

function matchColorConcepts(color: ColorScore): ConceptMatch[] {
  const matches: ConceptMatch[] = []

  if (color.isMonochrome) {
    matches.push({
      concept: aestheticConcepts['color-monochrome'],
      score: 0.9,
      evidence: `画面主要由${color.dominantColors[0] || '单一'}色系构成，是典型的单色调性运用`,
    })
  }

  if (color.lightnessContrast > 45) {
    matches.push({
      concept: aestheticConcepts['color-value-contrast'],
      score: 0.8 + Math.min(0.2, (color.lightnessContrast - 45) / 100),
      evidence: `明暗差异达 ${color.lightnessContrast.toFixed(0)} 单位，具有鲜明的明度对比`,
    })
  } else if (color.lightnessContrast < 25) {
    matches.push({
      concept: aestheticConcepts['color-value-contrast'],
      score: 0.7,
      evidence: `明暗差异仅 ${color.lightnessContrast.toFixed(0)} 单位，属于低明度对比，营造柔和氛围`,
    })
  }

  if (color.temp === 'warm') {
    matches.push({
      concept: aestheticConcepts['color-temperature'],
      score: 0.85,
      evidence: '画面以暖色调为主，传递温暖、活力的情绪感受',
    })
  } else if (color.temp === 'cool') {
    matches.push({
      concept: aestheticConcepts['color-temperature'],
      score: 0.85,
      evidence: '画面以冷色调为主，传递宁静、理性的情绪感受',
    })
  }

  if (color.colorRange < 45 && color.dominantColors.length >= 2) {
    matches.push({
      concept: aestheticConcepts['color-harmony-analogous'],
      score: 0.75 + Math.min(0.2, (45 - color.colorRange) / 100),
      evidence: `主要使用${color.dominantColors.join('、')}等邻近色彩，呈现和谐统一感`,
    })
  }

  if (color.colorRange > 120) {
    matches.push({
      concept: aestheticConcepts['color-harmony-complementary'],
      score: 0.7 + Math.min(0.2, (color.colorRange - 120) / 300),
      evidence: `色相差异显著（${color.colorRange.toFixed(0)}°），具备互补色对比的特征`,
    })
  }

  if (color.avgSaturation > 60) {
    matches.push({
      concept: aestheticConcepts['color-saturation'],
      score: 0.8,
      evidence: `平均饱和度达 ${color.avgSaturation.toFixed(0)}%，属于高饱和度，传递强烈情感`,
    })
  } else if (color.avgSaturation < 35) {
    matches.push({
      concept: aestheticConcepts['color-saturation'],
      score: 0.75,
      evidence: `平均饱和度仅 ${color.avgSaturation.toFixed(0)}%，属于低饱和度，营造优雅高级氛围`,
    })
  }

  return matches
}

function matchCompositionConcepts(comp: CompositionScore): ConceptMatch[] {
  const matches: ConceptMatch[] = []

  if (comp.hasStrongLines) {
    if (comp.hasDiagonals) {
      matches.push({
        concept: aestheticConcepts['composition-leading-lines'],
        score: 0.85,
        evidence: '检测到强烈的对角线线条，能够有效引导观者视线',
      })
    }

    if (comp.hasVerticals && comp.hasHorizontals) {
      matches.push({
        concept: aestheticConcepts['composition-symmetry'],
        score: 0.7,
        evidence: '画面中同时存在垂直与水平主导线条，暗示对称或秩序性构图',
      })
    }

    if (comp.lineCount >= 2) {
      matches.push({
        concept: aestheticConcepts['composition-leading-lines'],
        score: 0.75,
        evidence: `检测到 ${comp.lineCount} 条显著线条，可能构成引导线系统`,
      })
    }
  }

  if (comp.lineCount >= 3 && comp.avgStrength > 0.4) {
    matches.push({
      concept: aestheticConcepts['composition-framing'],
      score: 0.65,
      evidence: '多组线条交织，可能构成前景框架元素，增加画面层次',
    })
  }

  matches.push({
    concept: aestheticConcepts['composition-thirds'],
    score: 0.6,
    evidence: '上传的大多数优秀作品都会隐含三分法逻辑，请观察主体是否位于九宫格交点附近',
  })

  if (comp.curveCount > 0) {
    matches.push({
      concept: aestheticConcepts['composition-golden-ratio'],
      score: 0.6,
      evidence: '检测到曲线元素，可能与黄金螺旋等高级比例有关联',
    })
  }

  matches.push({
    concept: aestheticConcepts['composition-negative-space'],
    score: 0.55,
    evidence: '观察画面中主体周围的空白区域，思考留白如何服务于主体表达',
  })

  matches.push({
    concept: aestheticConcepts['composition-rule-of-depth'],
    score: 0.6,
    evidence: '审视画面：前景、中景、背景是否各自承担了清晰的叙事角色',
  })

  return matches
}

function matchMovementConcepts(
  color: ColorScore,
  comp: CompositionScore,
  style: StyleScore,
): ConceptMatch[] {
  const matches: ConceptMatch[] = []

  const hasMinimalTag =
    style.moodTags.some((t) => /简约|极简|干净|素雅/i.test(t)) ||
    style.compositionTags.some((t) => /留白|简洁/i.test(t))

  if (
    hasMinimalTag ||
    (color.isMonochrome && color.lightnessContrast > 30)
  ) {
    matches.push({
      concept: aestheticConcepts['movement-minimalism'],
      score: 0.8,
      evidence:
        '克制的元素数量、统一的色调选择，呈现出"少即是多"的极简主义倾向',
    })
  }

  const hasBauhausTag =
    style.compositionTags.some((t) => /几何|秩序|结构/i.test(t)) ||
    style.colorTags.some((t) => /原色|饱和/i.test(t))

  if (hasBauhausTag || (comp.lineCount >= 3 && color.avgSaturation > 50)) {
    matches.push({
      concept: aestheticConcepts['movement-bauhaus'],
      score: 0.7,
      evidence: '清晰的几何线条结构与理性的色彩运用，呼应了包豪斯的设计理念',
    })
  }

  const hasImpressionTag =
    style.moodTags.some((t) => /光|朦胧|柔和|氛围/i.test(t)) ||
    color.saturationVariance > 15

  if (hasImpressionTag || color.colorRange > 80) {
    matches.push({
      concept: aestheticConcepts['movement-impressionism'],
      score: 0.68,
      evidence: '丰富的色彩层次和对光线氛围的关注，带有印象派的审美特质',
    })
  }

  const hasArtDecoTag =
    style.compositionTags.some((t) => /对称|装饰|华丽|秩序/i.test(t)) ||
    style.colorTags.some((t) => /金色|奢华|复古/i.test(t))

  if (hasArtDecoTag || (comp.hasVerticals && comp.hasHorizontals && color.lightnessContrast > 40)) {
    matches.push({
      concept: aestheticConcepts['movement-art-deco'],
      score: 0.62,
      evidence: '对称结构与装饰性细节的组合，与装饰艺术风格存在审美共鸣',
    })
  }

  const hasMemphisTag =
    style.moodTags.some((t) => /童趣|活泼|复古|撞色/i.test(t)) ||
    style.colorTags.some((t) => /多彩|鲜艳|荧光/i.test(t))

  if (hasMemphisTag || (color.colorRange > 150 && color.avgSaturation > 70)) {
    matches.push({
      concept: aestheticConcepts['movement-memphis'],
      score: 0.72,
      evidence: '大胆的高饱和撞色与玩趣感，散发着孟菲斯风格的叛逆活力',
    })
  }

  const hasCyberpunkTag =
    style.moodTags.some((t) => /未来|科技|霓虹|赛博|电子/i.test(t)) ||
    (color.dominantColors.includes('紫色') && color.dominantColors.includes('蓝色'))

  if (hasCyberpunkTag || (color.temp === 'cool' && color.colorRange > 100 && color.lightnessContrast > 40)) {
    matches.push({
      concept: aestheticConcepts['movement-cyberpunk'],
      score: 0.7,
      evidence: '冷调霓虹色系与高对比光影，呈现出赛博朋克美学的未来感',
    })
  }

  const hasWabiSabiTag =
    style.moodTags.some((t) => /自然|质朴|侘寂|残缺|岁月/i.test(t)) ||
    (color.avgSaturation < 30 && comp.curveCount > 0)

  if (hasWabiSabiTag || (color.avgSaturation < 25 && color.lightnessContrast < 40)) {
    matches.push({
      concept: aestheticConcepts['movement-wabi-sabi'],
      score: 0.75,
      evidence: '低饱和的自然色调与柔和对比，传递出侘寂美学中对不完美的欣赏',
    })
  }

  return matches
}

export function generateLearningCards(result: AnalysisResult): LearningCard[] {
  const color = analyzeColorFeatures(result)
  const comp = analyzeCompositionFeatures(result)
  const style = analyzeStyleFeatures(result)

  const allMatches: ConceptMatch[] = [
    ...matchColorConcepts(color),
    ...matchCompositionConcepts(comp),
    ...matchMovementConcepts(color, comp, style),
  ]

  allMatches.sort((a, b) => b.score - a.score)

  const seenCategories = new Set<CourseCategory>()
  const selectedMatches: ConceptMatch[] = []

  for (const match of allMatches) {
    if (!seenCategories.has(match.concept.category) && selectedMatches.length < 3) {
      selectedMatches.push(match)
      seenCategories.add(match.concept.category)
    }
  }

  for (const match of allMatches) {
    if (selectedMatches.length >= 4) break
    if (!selectedMatches.includes(match)) {
      selectedMatches.push(match)
    }
  }

  return selectedMatches
    .slice(0, 4)
    .sort((a, b) => b.score - a.score)
    .map((match, i) => ({
      id: `card-${Date.now()}-${i}`,
      concept: match.concept,
      relevance: Math.round(match.score * 100),
      evidence: match.evidence,
      generatedAt: Date.now(),
      expanded: false,
      completed: false,
    }))
}
