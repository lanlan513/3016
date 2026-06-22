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

export type CourseCategory = 'color' | 'composition' | 'movement'

export interface ConceptExample {
  description: string
  visualHint: string
}

export interface AestheticConcept {
  id: string
  name: string
  category: CourseCategory
  summary: string
  detail: string
  examples: ConceptExample[]
  contrastExample?: ConceptExample
  difficulty: 1 | 2 | 3
}

export interface CourseLesson {
  id: string
  title: string
  conceptIds: string[]
  order: number
}

export interface CoursePath {
  id: CourseCategory
  name: string
  nameEn: string
  description: string
  icon: string
  lessons: CourseLesson[]
  accentColor: string
}

export interface LearningCard {
  id: string
  concept: AestheticConcept
  relevance: number
  evidence: string
  generatedAt: number
  expanded: boolean
  completed: boolean
}

export interface LearningProgress {
  totalCards: number
  completedCards: number
  unlockedConcepts: string[]
  viewedConcepts: string[]
  categoryProgress: Record<CourseCategory, { learned: number; total: number }>
}
