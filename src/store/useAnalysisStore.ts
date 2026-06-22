import { create } from 'zustand'
import type { AnalysisResult, AnalysisStatus } from '@/types/analysis'

interface AnalysisStore {
  status: AnalysisStatus
  imageUrl: string | null
  imageFile: File | null
  result: AnalysisResult | null
  activeSection: number
  setImage: (file: File, url: string) => void
  setResult: (result: AnalysisResult) => void
  setStatus: (status: AnalysisStatus) => void
  setActiveSection: (section: number) => void
  reset: () => void
}

let currentObjectUrl: string | null = null

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  status: 'idle',
  imageUrl: null,
  imageFile: null,
  result: null,
  activeSection: 0,
  setImage: (file, url) => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl)
    }
    currentObjectUrl = url
    set({ imageFile: file, imageUrl: url, status: 'loading' })
  },
  setResult: (result) => set({ result, status: 'complete' }),
  setStatus: (status) => set({ status }),
  setActiveSection: (section) => set({ activeSection: section }),
  reset: () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl)
      currentObjectUrl = null
    }
    set({ status: 'idle', imageUrl: null, imageFile: null, result: null, activeSection: 0 })
  },
}))
