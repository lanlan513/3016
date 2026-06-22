## 1. 架构设计

```mermaid
flowchart TD
    "用户浏览器" --> "React 前端应用"
    "React 前端应用" --> "Canvas API（色彩提取）"
    "React 前端应用" --> "Canvas API（构图分析）"
    "React 前端应用" --> "分析引擎（风格标签生成）"
    "Canvas API（色彩提取）" --> "调色板数据"
    "Canvas API（构图分析）" --> "构图线条数据"
    "分析引擎（风格标签生成）" --> "风格标签数据"
    "调色板数据" --> "UI 展示层"
    "构图线条数据" --> "UI 展示层"
    "风格标签数据" --> "UI 展示层"
```

纯前端架构，所有图像分析算法均在浏览器端通过 Canvas API 完成，无需后端服务。

## 2. 技术说明

- 前端：React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具：vite-init
- 后端：无（纯前端应用）
- 数据库：无
- 状态管理：Zustand
- 动画库：Motion（Framer Motion）

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 主页面（单页应用唯一页面） |

## 4. API 定义

无后端 API，所有分析逻辑在前端完成。

### 4.1 核心分析函数接口

```typescript
interface ColorSwatch {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  percentage: number
}

interface CompositionLine {
  type: 'horizontal' | 'vertical' | 'diagonal' | 'curve'
  angle: number
  strength: number
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
}

interface StyleTag {
  name: string
  confidence: number
  category: 'color' | 'composition' | 'mood'
}

interface AnalysisResult {
  palette: ColorSwatch[]
  composition: CompositionLine[]
  tags: StyleTag[]
}

// 核心函数签名
function extractPalette(imageData: ImageData, colorCount?: number): ColorSwatch[]
function analyzeComposition(imageData: ImageData): CompositionLine[]
function generateStyleTags(palette: ColorSwatch[], composition: CompositionLine[]): StyleTag[]
```

## 5. 服务端架构图

不适用（纯前端应用）

## 6. 数据模型

不适用（无持久化数据存储）

### 组件结构

```mermaid
flowchart TD
    "App" --> "Header"
    "App" --> "MainContent"
    "MainContent" --> "UploadZone"
    "MainContent" --> "AnalysisPanel"
    "AnalysisPanel" --> "PaletteExtractor"
    "AnalysisPanel" --> "CompositionAnalyzer"
    "AnalysisPanel" --> "StyleTagCloud"
    "PaletteExtractor" --> "ColorSwatch"
    "CompositionAnalyzer" --> "CompositionOverlay"
    "StyleTagCloud" --> "StyleTag"
```
