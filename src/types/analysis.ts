export interface ColorSwatch {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  percentage: number
}

export interface CompositionLine {
  type: 'horizontal' | 'vertical' | 'diagonal' | 'curve'
  angle: number
  strength: number
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
  isGuide?: boolean
  label?: string
}

export interface StyleTag {
  name: string
  confidence: number
  category: 'color' | 'composition' | 'mood'
}

export interface AestheticMovement {
  id: string
  name: string
  nameEn: string
  era: string
  origin: string
  philosophy: string
  representatives: string[]
  principles: string[]
  matchedTags: string[]
  accentColor: string
}

export interface AnalysisResult {
  palette: ColorSwatch[]
  composition: CompositionLine[]
  tags: StyleTag[]
}

export type AnalysisStatus = 'idle' | 'loading' | 'analyzing' | 'complete' | 'error'
