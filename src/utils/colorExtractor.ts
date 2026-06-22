import type { ColorSwatch } from '@/types/analysis'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    case b: h = ((r - g) / d + 4) / 6; break
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  )
}

function kMeansClustering(pixels: [number, number, number][], k: number, maxIterations: number = 20): { centroid: [number, number, number]; pixels: [number, number, number][] }[] {
  const step = Math.floor(pixels.length / k)
  let centroids: [number, number, number][] = pixels.filter((_, i) => i % step === 0).slice(0, k)

  let clusters: { centroid: [number, number, number]; pixels: [number, number, number][] }[] = []

  for (let iter = 0; iter < maxIterations; iter++) {
    clusters = centroids.map((centroid) => ({ centroid, pixels: [] as [number, number, number][] }))

    for (const pixel of pixels) {
      let minDist = Infinity
      let closestIdx = 0
      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(pixel, centroids[i])
        if (dist < minDist) {
          minDist = dist
          closestIdx = i
        }
      }
      clusters[closestIdx].pixels.push(pixel)
    }

    const newCentroids: [number, number, number][] = []
    for (const cluster of clusters) {
      if (cluster.pixels.length === 0) {
        newCentroids.push(cluster.centroid)
        continue
      }
      const avgR = Math.round(cluster.pixels.reduce((s, p) => s + p[0], 0) / cluster.pixels.length)
      const avgG = Math.round(cluster.pixels.reduce((s, p) => s + p[1], 0) / cluster.pixels.length)
      const avgB = Math.round(cluster.pixels.reduce((s, p) => s + p[2], 0) / cluster.pixels.length)
      newCentroids.push([avgR, avgG, avgB])
    }

    let converged = true
    for (let i = 0; i < centroids.length; i++) {
      if (colorDistance(centroids[i], newCentroids[i]) > 2) {
        converged = false
        break
      }
    }
    centroids = newCentroids
    if (converged) break
  }

  return clusters
}

export function extractPalette(imageData: ImageData, colorCount: number = 6): ColorSwatch[] {
  const { data, width, height } = imageData
  const pixels: [number, number, number][] = []
  const step = Math.max(1, Math.floor((width * height) / 5000))

  for (let i = 0; i < width * height; i += step) {
    const idx = i * 4
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    const a = data[idx + 3]
    if (a < 128) continue
    if (r > 240 && g > 240 && b > 240) continue
    if (r < 15 && g < 15 && b < 15) continue
    pixels.push([r, g, b])
  }

  if (pixels.length === 0) return []

  const clusters = kMeansClustering(pixels, colorCount)
  const totalPixels = pixels.length

  const palette = clusters
    .filter((c) => c.pixels.length > 0)
    .map((cluster) => {
      const [r, g, b] = cluster.centroid
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b),
        percentage: Math.round((cluster.pixels.length / totalPixels) * 100),
      }
    })
    .sort((a, b) => b.percentage - a.percentage)

  return palette
}

export function loadImageToCanvas(file: File): Promise<{ canvas: HTMLCanvasElement; imageData: ImageData }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxSize = 800
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        const scale = maxSize / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      resolve({ canvas, imageData })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}
