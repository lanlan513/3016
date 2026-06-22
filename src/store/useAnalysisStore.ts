import { create } from 'zustand'
import type {
  AnalysisResult,
  AnalysisStatus,
  LearningCard,
  LearningProgress,
  CourseCategory,
} from '@/types/analysis'

export type GuideMode = 'thirds' | 'golden' | 'diagonal' | null

interface AnalysisStore {
  status: AnalysisStatus
  imageUrl: string | null
  imageFile: File | null
  result: AnalysisResult | null
  activeSection: number
  guideMode: GuideMode
  learningMode: boolean
  academyOpen: boolean
  activeCourseTab: CourseCategory | null
  learningCards: LearningCard[]
  activeCardId: string | null
  learningProgress: LearningProgress
  setImage: (file: File, url: string) => void
  setResult: (result: AnalysisResult) => void
  setStatus: (status: AnalysisStatus) => void
  setActiveSection: (section: number) => void
  setGuideMode: (mode: GuideMode) => void
  toggleLearningMode: () => void
  toggleAcademy: () => void
  setAcademyOpen: (open: boolean) => void
  setActiveCourseTab: (tab: CourseCategory | null) => void
  addLearningCard: (card: LearningCard) => void
  setLearningCards: (cards: LearningCard[]) => void
  expandLearningCard: (cardId: string) => void
  collapseLearningCard: (cardId: string) => void
  completeLearningCard: (cardId: string) => void
  setActiveCardId: (cardId: string | null) => void
  markConceptViewed: (conceptId: string) => void
  reset: () => void
}

let currentObjectUrl: string | null = null

const initialProgress: LearningProgress = {
  totalCards: 0,
  completedCards: 0,
  unlockedConcepts: [],
  viewedConcepts: [],
  categoryProgress: {
    color: { learned: 0, total: 0 },
    composition: { learned: 0, total: 0 },
    movement: { learned: 0, total: 0 },
  },
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  status: 'idle',
  imageUrl: null,
  imageFile: null,
  result: null,
  activeSection: 0,
  guideMode: null,
  learningMode: false,
  academyOpen: false,
  activeCourseTab: null,
  learningCards: [],
  activeCardId: null,
  learningProgress: initialProgress,
  setImage: (file, url) => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl)
    }
    currentObjectUrl = url
    set({ imageFile: file, imageUrl: url, status: 'loading', learningCards: [] })
  },
  setResult: (result) => set({ result, status: 'complete' }),
  setStatus: (status) => set({ status }),
  setActiveSection: (section) => set({ activeSection: section }),
  setGuideMode: (mode) => set({ guideMode: mode }),
  toggleLearningMode: () =>
    set((s) => ({ learningMode: !s.learningMode, academyOpen: !s.learningMode ? true : s.academyOpen })),
  toggleAcademy: () => set((s) => ({ academyOpen: !s.academyOpen })),
  setAcademyOpen: (open) => set({ academyOpen: open }),
  setActiveCourseTab: (tab) => set({ activeCourseTab: tab }),
  addLearningCard: (card) =>
    set((s) => {
      const progress = { ...s.learningProgress }
      progress.totalCards += 1
      if (!progress.unlockedConcepts.includes(card.concept.id)) {
        progress.unlockedConcepts.push(card.concept.id)
      }
      const cat = card.concept.category
      progress.categoryProgress[cat] = {
        learned: progress.categoryProgress[cat].learned,
        total: progress.categoryProgress[cat].total + 1,
      }
      return {
        learningCards: [...s.learningCards, card],
        activeCardId: s.activeCardId || card.id,
        learningProgress: progress,
      }
    }),
  setLearningCards: (cards) =>
    set((s) => {
      const progress = { ...s.learningProgress }
      cards.forEach((c) => {
        if (!progress.unlockedConcepts.includes(c.concept.id)) {
          progress.unlockedConcepts.push(c.concept.id)
        }
      })
      progress.totalCards = cards.length
      return { learningCards: cards, learningProgress: progress }
    }),
  expandLearningCard: (cardId) =>
    set((s) => ({
      learningCards: s.learningCards.map((c) =>
        c.id === cardId ? { ...c, expanded: true } : c
      ),
    })),
  collapseLearningCard: (cardId) =>
    set((s) => ({
      learningCards: s.learningCards.map((c) =>
        c.id === cardId ? { ...c, expanded: false } : c
      ),
    })),
  completeLearningCard: (cardId) =>
    set((s) => {
      const cards = s.learningCards.map((c) =>
        c.id === cardId ? { ...c, completed: true } : c
      )
      const progress = { ...s.learningProgress }
      const target = s.learningCards.find((c) => c.id === cardId)
      if (target && !target.completed) {
        progress.completedCards += 1
        const cat = target.concept.category
        progress.categoryProgress[cat] = {
          learned: progress.categoryProgress[cat].learned + 1,
          total: progress.categoryProgress[cat].total,
        }
      }
      return { learningCards: cards, learningProgress: progress }
    }),
  setActiveCardId: (cardId) => set({ activeCardId: cardId }),
  markConceptViewed: (conceptId) =>
    set((s) => {
      if (s.learningProgress.viewedConcepts.includes(conceptId)) return {}
      return {
        learningProgress: {
          ...s.learningProgress,
          viewedConcepts: [...s.learningProgress.viewedConcepts, conceptId],
        },
      }
    }),
  reset: () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl)
      currentObjectUrl = null
    }
    const keepProgress = get().learningProgress
    set({
      status: 'idle',
      imageUrl: null,
      imageFile: null,
      result: null,
      activeSection: 0,
      guideMode: null,
      learningCards: [],
      activeCardId: null,
      learningProgress: {
        ...keepProgress,
        totalCards: 0,
        categoryProgress: {
          color: { learned: 0, total: 0 },
          composition: { learned: 0, total: 0 },
          movement: { learned: 0, total: 0 },
        },
      },
    })
  },
}))
