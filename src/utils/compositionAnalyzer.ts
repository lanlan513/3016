import type { CompositionLine } from '@/types/analysis'

function toGrayscale(data: Uint8ClampedArray, width: number, height: number): Float32Array {
  const gray = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
  }
  return gray
}

function sobelEdge(gray: Float32Array, width: number, height: number): { magnitude: Float32Array; direction: Float32Array } {
  const magnitude = new Float32Array(width * height)
  const direction = new Float32Array(width * height)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      const gx =
        -gray[(y - 1) * width + (x - 1)] + gray[(y - 1) * width + (x + 1)] +
        -2 * gray[y * width + (x - 1)] + 2 * gray[y * width + (x + 1)] +
        -gray[(y + 1) * width + (x - 1)] + gray[(y + 1) * width + (x + 1)]
      const gy =
        -gray[(y - 1) * width + (x - 1)] - 2 * gray[(y - 1) * width + x] - gray[(y - 1) * width + (x + 1)] +
        gray[(y + 1) * width + (x - 1)] + 2 * gray[(y + 1) * width + x] + gray[(y + 1) * width + (x + 1)]

      magnitude[idx] = Math.sqrt(gx * gx + gy * gy)
      direction[idx] = Math.atan2(gy, gx)
    }
  }

  return { magnitude, direction }
}

function detectLines(magnitude: Float32Array, direction: Float32Array, width: number, height: number, threshold: number): CompositionLine[] {
  const lines: CompositionLine[] = []
  const strongEdges: { x: number; y: number; angle: number; mag: number }[] = []

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      if (magnitude[idx] > threshold) {
        strongEdges.push({ x, y, angle: direction[idx], mag: magnitude[idx] })
      }
    }
  }

  if (strongEdges.length === 0) return []

  const angleBuckets: Record<string, { x: number; y: number; mag: number }[]> = {
    horizontal: [],
    vertical: [],
    diagonalRight: [],
    diagonalLeft: [],
  }

  for (const edge of strongEdges) {
    let deg = (edge.angle * 180) / Math.PI
    if (deg < 0) deg += 180
    deg = deg % 180

    if ((deg >= 0 && deg < 22.5) || (deg >= 157.5 && deg < 180)) {
      angleBuckets.horizontal.push({ x: edge.x, y: edge.y, mag: edge.mag })
    } else if (deg >= 67.5 && deg < 112.5) {
      angleBuckets.vertical.push({ x: edge.x, y: edge.y, mag: edge.mag })
    } else if (deg >= 22.5 && deg < 67.5) {
      angleBuckets.diagonalRight.push({ x: edge.x, y: edge.y, mag: edge.mag })
    } else {
      angleBuckets.diagonalLeft.push({ x: edge.x, y: edge.y, mag: edge.mag })
    }
  }

  const totalEdgeCount = strongEdges.length
  const minStrength = totalEdgeCount * 0.05

  for (const [type, edges] of Object.entries(angleBuckets)) {
    if (edges.length < minStrength) continue

    const avgX = edges.reduce((s, e) => s + e.x * e.mag, 0) / edges.reduce((s, e) => s + e.mag, 0)
    const avgY = edges.reduce((s, e) => s + e.y * e.mag, 0) / edges.reduce((s, e) => s + e.mag, 0)
    const strength = edges.length / totalEdgeCount

    let angle = 0
    let startPt = { x: 0, y: 0 }
    let endPt = { x: 0, y: 0 }

    const minX = Math.min(...edges.map((e) => e.x))
    const maxX = Math.max(...edges.map((e) => e.x))
    const minY = Math.min(...edges.map((e) => e.y))
    const maxY = Math.max(...edges.map((e) => e.y))

    switch (type) {
      case 'horizontal':
        angle = 0
        startPt = { x: minX, y: avgY }
        endPt = { x: maxX, y: avgY }
        break
      case 'vertical':
        angle = 90
        startPt = { x: avgX, y: minY }
        endPt = { x: avgX, y: maxY }
        break
      case 'diagonalRight':
        angle = 45
        startPt = { x: minX, y: maxY }
        endPt = { x: maxX, y: minY }
        break
      case 'diagonalLeft':
        angle = 135
        startPt = { x: minX, y: minY }
        endPt = { x: maxX, y: maxY }
        break
    }

    const typeLabel = type === 'horizontal' ? '主水平线' : type === 'vertical' ? '主垂直线' : '主对角线'
    lines.push({
      type: type === 'diagonalRight' || type === 'diagonalLeft' ? 'diagonal' : type as 'horizontal' | 'vertical',
      angle,
      strength,
      startPoint: { x: startPt.x / width, y: startPt.y / height },
      endPoint: { x: endPt.x / width, y: endPt.y / height },
      label: typeLabel,
    })
  }

  const ruleOfThirdsLines: CompositionLine[] = [
    { type: 'horizontal', angle: 0, strength: 0.08, startPoint: { x: 0, y: 1 / 3 }, endPoint: { x: 1, y: 1 / 3 }, isGuide: true, label: '三分法·上' },
    { type: 'horizontal', angle: 0, strength: 0.08, startPoint: { x: 0, y: 2 / 3 }, endPoint: { x: 1, y: 2 / 3 }, isGuide: true, label: '三分法·下' },
    { type: 'vertical', angle: 90, strength: 0.08, startPoint: { x: 1 / 3, y: 0 }, endPoint: { x: 1 / 3, y: 1 }, isGuide: true, label: '三分法·左' },
    { type: 'vertical', angle: 90, strength: 0.08, startPoint: { x: 2 / 3, y: 0 }, endPoint: { x: 2 / 3, y: 1 }, isGuide: true, label: '三分法·右' },
  ]

  return [...lines, ...ruleOfThirdsLines].sort((a, b) => b.strength - a.strength).slice(0, 8)
}

export function analyzeComposition(imageData: ImageData): CompositionLine[] {
  const { data, width, height } = imageData
  const gray = toGrayscale(data, width, height)
  const { magnitude, direction } = sobelEdge(gray, width, height)

  let maxMag = 0
  for (let i = 0; i < magnitude.length; i++) {
    if (magnitude[i] > maxMag) maxMag = magnitude[i]
  }

  const threshold = maxMag * 0.3
  return detectLines(magnitude, direction, width, height, threshold)
}
