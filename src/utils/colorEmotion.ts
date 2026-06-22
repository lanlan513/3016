export interface ColorEmotion {
  tags: string[]
  description: string
  cultural: string
}

export function getColorEmotion(hsl: { h: number; s: number; l: number }): ColorEmotion {
  const { h, s, l } = hsl

  if (s < 15) {
    if (l < 20) {
      return {
        tags: ['神秘', '沉稳', '权威'],
        description: '深沉的暗色调，传递出内敛而庄重的力量感',
        cultural: '在东方文化中象征沉稳与肃穆，在西方代表正式与权威',
      }
    }
    if (l > 80) {
      return {
        tags: ['纯净', '简约', '优雅'],
        description: '明亮的中性色，带来干净通透的视觉感受',
        cultural: '普遍象征纯洁与新生，是极简主义的核心色调',
      }
    }
    return {
      tags: ['平和', '内敛', '高级'],
      description: '柔和的灰色系，营造不张扬的精致质感',
      cultural: '现代设计中常用于表达理性与克制的美学态度',
    }
  }

  if (l < 25) {
    return {
      tags: ['深邃', '神秘', '厚重'],
      description: '低明度的暗彩色，富有层次感与戏剧性',
      cultural: '常用于高端品牌，传递奢华与品味',
    }
  }

  if (l > 80) {
    return {
      tags: ['轻盈', '温柔', '清新'],
      description: '高明度的淡彩色，带来柔和愉悦的视觉体验',
      cultural: '象征浪漫与梦幻，深受少女风格喜爱',
    }
  }

  if (h >= 0 && h < 30) {
    if (s > 60) {
      return {
        tags: ['热情', '活力', '激情'],
        description: '鲜艳的红色系，充满生命力与视觉冲击力',
        cultural: '在中国象征吉祥与喜庆，在西方代表爱与勇气',
      }
    }
    return {
      tags: ['温暖', '舒适', '质朴'],
      description: '柔和的暖棕色调，营造亲切自然的氛围',
      cultural: '大地色系，象征踏实与可靠',
    }
  }

  if (h >= 30 && h < 60) {
    if (s > 60) {
      return {
        tags: ['阳光', '乐观', '创意'],
        description: '明亮的橙黄色，传递积极向上的能量',
        cultural: '象征收获与希望，是创意产业的标志性色彩',
      }
    }
    return {
      tags: ['温馨', '治愈', '怀旧'],
      description: '柔和的米黄色调，带来温暖舒适的感受',
      cultural: '常用于营造复古与怀旧的美学氛围',
    }
  }

  if (h >= 60 && h < 90) {
    if (s > 60) {
      return {
        tags: ['活力', '青春', '明快'],
        description: '鲜亮的黄绿色，充满生机与动感',
        cultural: '代表年轻与潮流，常用于运动与街头风格',
      }
    }
    return {
      tags: ['自然', '清新', '田园'],
      description: '柔和的橄榄绿调，回归自然的质朴美感',
      cultural: '象征环保与可持续，是北欧风格的常用色',
    }
  }

  if (h >= 90 && h < 150) {
    if (s > 60) {
      return {
        tags: ['生机', '清新', '希望'],
        description: '鲜艳的绿色，充满自然的生命力',
        cultural: '普遍象征生长与环保，也是健康的标志色',
      }
    }
    return {
      tags: ['宁静', '舒缓', '自然'],
      description: '柔和的灰绿色，带来平静放松的视觉感受',
      cultural: '莫兰迪色系的代表，传递低饱和度的高级感',
    }
  }

  if (h >= 150 && h < 190) {
    return {
      tags: ['清爽', '通透', '冷静'],
      description: '清新的青绿色调，如海水般澄澈',
      cultural: '象征海洋与自由，常用于表达清爽的品牌调性',
    }
  }

  if (h >= 190 && h < 240) {
    if (s > 60) {
      return {
        tags: ['理性', '专业', '科技'],
        description: '鲜明的蓝色，传递可靠与专业的印象',
        cultural: '企业与科技行业的首选色，象征信任与效率',
      }
    }
    return {
      tags: ['宁静', '沉稳', '优雅'],
      description: '柔和的灰蓝色，营造静谧雅致的氛围',
      cultural: '雾霾蓝，近年来备受追捧的高级感色彩',
    }
  }

  if (h >= 240 && h < 280) {
    if (s > 60) {
      return {
        tags: ['神秘', '高贵', '创意'],
        description: '浓郁的紫色，富有艺术感与神秘感',
        cultural: '历史上象征皇室与尊贵，如今代表创意与灵性',
      }
    }
    return {
      tags: ['梦幻', '柔美', '浪漫'],
      description: '淡紫色调，营造梦幻唯美的氛围',
      cultural: '薰衣草色，象征浪漫与优雅',
    }
  }

  if (h >= 280 && h < 330) {
    if (s > 60) {
      return {
        tags: ['性感', '华丽', '个性'],
        description: '鲜艳的品红色，充满张力与个性',
        cultural: '代表时尚与前卫，是潮流文化的标志性色彩',
      }
    }
    return {
      tags: ['温柔', '浪漫', '甜美'],
      description: '柔和的粉紫色调，传递甜美优雅的气质',
      cultural: '少女心与浪漫主义的代表色',
    }
  }

  if (h >= 330 || h < 10) {
    if (s > 60) {
      return {
        tags: ['浪漫', '柔美', '温暖'],
        description: '玫瑰粉色调，温柔中带有力量',
        cultural: '象征爱与关怀，是女性化美学的经典色彩',
      }
    }
    return {
      tags: ['优雅', '细腻', '知性'],
      description: '灰粉色调，低调而有质感',
      cultural: '莫兰迪粉，传递温柔而知性的气质',
    }
  }

  return {
    tags: ['平衡', '和谐', '百搭'],
    description: '中性和谐的色调，具有良好的搭配性',
    cultural: '适合多种风格，是实用主义的美学选择',
  }
}
