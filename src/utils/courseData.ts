import type { CoursePath, AestheticConcept, CourseCategory } from '@/types/analysis'

export const aestheticConcepts: Record<string, AestheticConcept> = {
  'color-harmony-analogous': {
    id: 'color-harmony-analogous',
    name: '邻近色和谐',
    category: 'color',
    summary: '色轮上相邻的颜色组合，营造柔和自然的视觉感受',
    detail:
      '邻近色是指在色轮上彼此相邻的颜色，例如蓝与青绿、黄与橙。它们共享相同的基础色相，因此搭配时会产生和谐、统一、舒适的视觉效果。邻近色方案适合营造宁静、自然、舒适的氛围，在自然风景摄影和柔和风格设计中尤为常见。',
    examples: [
      {
        description: '春日风景中的嫩绿、草绿、墨绿层层递进',
        visualHint: '从左至右呈现绿色系渐变',
      },
      {
        description: '夕阳画面中的橙红、珊瑚、粉红自然过渡',
        visualHint: '暖色系从深到浅平滑渐变',
      },
    ],
    contrastExample: {
      description: '使用色轮对面的互补色会产生强烈对比',
      visualHint: '蓝色与橙色并置产生强烈视觉张力',
    },
    difficulty: 1,
  },
  'color-harmony-complementary': {
    id: 'color-harmony-complementary',
    name: '互补色对比',
    category: 'color',
    summary: '色轮对面的颜色组合，创造强烈的视觉冲击力',
    detail:
      '互补色是色轮上彼此相对的颜色，如红与绿、蓝与橙、黄与紫。当并置时，它们会产生最强烈的对比效果，使彼此显得更加鲜艳。互补色方案适合需要吸引注意力、创造活力和戏剧感的场景，但需要注意比例控制，通常以 70:30 的比例分配以避免视觉疲劳。',
    examples: [
      {
        description: '红花配绿叶，经典的自然互补色组合',
        visualHint: '红色主体在绿色背景衬托下格外醒目',
      },
      {
        description: '蓝天下的橙色建筑，冷暖对比强烈',
        visualHint: '冷色背景与暖色前景形成视觉焦点',
      },
    ],
    contrastExample: {
      description: '如果改用同色系会显得柔和但缺乏张力',
      visualHint: '全蓝色调的画面宁静但较为平淡',
    },
    difficulty: 2,
  },
  'color-temperature': {
    id: 'color-temperature',
    name: '色温情绪',
    category: 'color',
    summary: '冷暖色调影响观者的情绪感知与心理联想',
    detail:
      '色温是描述颜色冷暖属性的概念。红、橙、黄属于暖色调，唤起温暖、活力、激情的感觉，常与阳光、火焰、亲近感相关联。蓝、青、紫属于冷色调，传达冷静、宁静、专业、距离感，常与天空、水、科技相关联。色温的选择直接决定作品的情绪基调和观者的心理感受。',
    examples: [
      {
        description: '暖调烛光晚餐画面，营造温馨浪漫氛围',
        visualHint: '整体画面偏橙黄色调',
      },
      {
        description: '冷调雪山风景，传递宁静辽阔的感觉',
        visualHint: '整体画面偏蓝青色调',
      },
    ],
    contrastExample: {
      description: '同一场景切换冷暖色调会完全改变情绪',
      visualHint: '左暖右冷对比展示色温的情绪影响',
    },
    difficulty: 1,
  },
  'color-saturation': {
    id: 'color-saturation',
    name: '饱和度叙事',
    category: 'color',
    summary: '颜色的鲜艳程度传递不同的情感强度',
    detail:
      '饱和度指颜色的纯度和鲜艳程度。高饱和度的色彩鲜艳夺目，传递活力、激情、年轻感，适合时尚、广告等需要吸引注意力的场景。低饱和度的色彩柔和淡雅，传递优雅、宁静、复古、高级感，常用于艺术摄影、高端品牌设计。合理控制饱和度能有效引导观者情绪。',
    examples: [
      {
        description: '高饱和的热带水果广告，鲜艳诱人',
        visualHint: '颜色饱满纯净，视觉冲击力强',
      },
      {
        description: '低饱和的莫兰迪色系插画，安静高级',
        visualHint: '颜色含灰调，柔和不刺眼',
      },
    ],
    contrastExample: {
      description: '同一物体不同饱和度的呈现风格迥异',
      visualHint: '左侧高饱和活泼，右侧低饱和沉稳',
    },
    difficulty: 2,
  },
  'color-value-contrast': {
    id: 'color-value-contrast',
    name: '明度对比',
    category: 'color',
    summary: '明暗差异决定视觉层次和主体辨识度',
    detail:
      '明度对比指画面中最亮和最暗部分的差异程度。高明度对比（如黑与白）使画面清晰锐利，主体突出，具有强烈的视觉冲击力；低明度对比（如灰调层次）则柔和含蓄，营造梦幻、内敛、诗意的氛围。明度是构建视觉层次、确保主体可读的基础。',
    examples: [
      {
        description: '剪影照片，主体与背景明暗反差极大',
        visualHint: '黑色轮廓与明亮背景形成强烈对比',
      },
      {
        description: '雾中风景，明暗差异小，意境朦胧',
        visualHint: '整体灰调，边界柔和模糊',
      },
    ],
    contrastExample: {
      description: '提高对比度让平淡画面瞬间有力量',
      visualHint: '左低对比柔和，右高对比有力',
    },
    difficulty: 2,
  },
  'color-monochrome': {
    id: 'color-monochrome',
    name: '单色调性',
    category: 'color',
    summary: '单一色相的明暗变化构建极致统一感',
    detail:
      '单色配色方案使用同一色相的不同明度和饱和度变化来构建画面。它创造出极强的整体感、统一性和秩序感，能够聚焦观者注意力于形式、纹理和构图。单色风格既可以是极简高级的黑白摄影，也可以是单色调的艺术表达，是展示形式美感的有力手段。',
    examples: [
      {
        description: '经典黑白人像，聚焦神态与光影',
        visualHint: '仅灰度变化，强调造型与情绪',
      },
      {
        description: '全蓝色调产品图，极简统一高级感',
        visualHint: '从深蓝到浅蓝的多层次变化',
      },
    ],
    contrastExample: {
      description: '添加多种颜色会分散对形式的注意力',
      visualHint: '单色简洁，多色信息密度高',
    },
    difficulty: 2,
  },
  'composition-thirds': {
    id: 'composition-thirds',
    name: '三分法则',
    category: 'composition',
    summary: '将主体置于九宫格交点，获得平衡的视觉美感',
    detail:
      '三分法是最基础也是最实用的构图法则。将画面横向和纵向各分为三等份，形成九宫格，把主体放在交叉点上而非中心。这样的构图既避免了居中的呆板，又让画面有呼吸感和方向性。观者的视线会自然落在这些交叉点上，使主体突出且整体和谐。',
    examples: [
      {
        description: '人物眼睛位于右上交点，灵动自然',
        visualHint: '九宫格叠加显示主体在交叉点',
      },
      {
        description: '地平线位于下方三分之一，天空开阔',
        visualHint: '水平线与下三分线重合',
      },
    ],
    contrastExample: {
      description: '居中构图可能显得呆板缺乏活力',
      visualHint: '左居中对称，右三分法活泼',
    },
    difficulty: 1,
  },
  'composition-leading-lines': {
    id: 'composition-leading-lines',
    name: '引导线',
    category: 'composition',
    summary: '利用线条引导视线深入画面，创造纵深感',
    detail:
      '引导线是构图中引导观者视线的有力工具。道路、河流、栏杆、建筑边缘等自然或人工线条，可以将视线从画面边缘引向主体或消失点。引导线不仅创造了强烈的纵深感和空间感，还能控制观者浏览画面的路径，增强叙事性和代入感。',
    examples: [
      {
        description: '乡间小路从近到远汇聚，引向远方',
        visualHint: '道路两侧线条向中心汇聚',
      },
      {
        description: '建筑走廊的透视线，营造庄严空间感',
        visualHint: '柱子和地面线条向远处汇聚',
      },
    ],
    contrastExample: {
      description: '缺少引导线的画面缺乏深度和方向',
      visualHint: '左有引导线有深度，右画面较平',
    },
    difficulty: 2,
  },
  'composition-framing': {
    id: 'composition-framing',
    name: '框架构图',
    category: 'composition',
    summary: '利用前景元素形成画框，聚焦主体增加层次',
    detail:
      '框架构图利用前景中的元素（如门窗、拱门、树枝、人物剪影）形成自然画框，将观者视线聚焦于框内的主体。前景框架不仅增加了画面的纵深感和层次感，还能营造出"窥视感"或"代入感"，让观者仿佛身临其境，通过框架观察场景。',
    examples: [
      {
        description: '透过窗户拍摄窗外的城市风光',
        visualHint: '窗框将视线引向窗外风景',
      },
      {
        description: '透过树干间隙拍摄森林中的光线',
        visualHint: '两侧树干形成天然画框',
      },
    ],
    contrastExample: {
      description: '没有框架的画面层次感相对较弱',
      visualHint: '前景框架增加画面深度',
    },
    difficulty: 2,
  },
  'composition-symmetry': {
    id: 'composition-symmetry',
    name: '对称与平衡',
    category: 'composition',
    summary: '镜像对称创造庄重稳定和谐的视觉感受',
    detail:
      '对称构图是沿中轴线左右或上下镜像对称的布局。它传达稳定、庄重、秩序、和谐的感觉，在建筑摄影、正式人像、宗教艺术中极为常见。对称构图的关键在于精准的中轴线和完美的对称性。绝对对称能创造神圣感，而微妙的打破对称则增添趣味。',
    examples: [
      {
        description: '宏伟建筑的正面拍摄，左右完美对称',
        visualHint: '中轴线两侧镜像对应',
      },
      {
        description: '湖面倒影，上下对称如诗如画',
        visualHint: '水平线为轴上下镜像',
      },
    ],
    contrastExample: {
      description: '对称中加入微小变化增添活力',
      visualHint: '完美对称庄严，微不对称生动',
    },
    difficulty: 2,
  },
  'composition-negative-space': {
    id: 'composition-negative-space',
    name: '留白艺术',
    category: 'composition',
    summary: '大量空白区域赋予主体呼吸感和意境',
    detail:
      '留白（负空间）是指画面中主体周围的大片空白区域。它看似"空无一物"，实则是构图的重要组成部分。留白给观者提供想象空间，赋予画面意境、呼吸感和高级感。东方美学特别推崇留白的哲学意味，"少即是多"是留白构图的核心理念。',
    examples: [
      {
        description: '广阔天空中的一只飞鸟，意境辽远',
        visualHint: '大面积蓝天衬托小鸟主体',
      },
      {
        description: '极简产品摄影，大量白色背景',
        visualHint: '产品在大片留白中显得精致',
      },
    ],
    contrastExample: {
      description: '塞满元素的画面可能显得拥挤',
      visualHint: '左留白呼吸，右元素密集',
    },
    difficulty: 2,
  },
  'composition-golden-ratio': {
    id: 'composition-golden-ratio',
    name: '黄金比例',
    category: 'composition',
    summary: '1:1.618的神圣比例，自然和谐的终极法则',
    detail:
      '黄金比例（约1:1.618）是自古以来被认为最美的比例。黄金螺旋、黄金矩形、斐波那契数列在自然和艺术中无处不在。将主体放在黄金螺旋的焦点处，或将画面分割为黄金比例的区块，能创造出内在和谐的视觉美感，观者会无意识地感受到这种"完美"。',
    examples: [
      {
        description: '人像面部符合黄金比例，五官位置和谐',
        visualHint: '黄金螺旋叠加在人脸上',
      },
      {
        description: '古典绘画构图，隐藏黄金分割关系',
        visualHint: '黄金矩形分割画面区域',
      },
    ],
    contrastExample: {
      description: '非黄金比例的画面可能缺少内在和谐',
      visualHint: '黄金比例更具平衡美感',
    },
    difficulty: 3,
  },
  'composition-rule-of-depth': {
    id: 'composition-rule-of-depth',
    name: '前景中景背景',
    category: 'composition',
    summary: '三层空间构建画面的立体纵深感',
    detail:
      '在二维平面上营造三维空间感的关键是构建前景、中景、背景的层次。前景增加亲近感和代入感，中景承载主体和故事，背景交代环境和氛围。通过三个层次的叠加，观者的眼睛会在空间中"穿越"，获得深度体验和沉浸式感受。',
    examples: [
      {
        description: '前景花朵、中景人物、背景山脉',
        visualHint: '三层空间清晰分明',
      },
      {
        description: '近景水面涟漪、中景船只、远景海平线',
        visualHint: '前后景营造辽阔海洋感',
      },
    ],
    contrastExample: {
      description: '只有一层的画面缺乏空间纵深感',
      visualHint: '三层对比单层更立体',
    },
    difficulty: 2,
  },
  'movement-minimalism': {
    id: 'movement-minimalism',
    name: '极简主义',
    category: 'movement',
    summary: '少即是多，剥离冗余只保留本质',
    detail:
      '极简主义是20世纪中期兴起的艺术与设计运动，核心理念是"少即是多"（Less is More）。它追求极致的简洁，去除所有非必要的元素，只保留最本质的形状、色彩和材质。极简主义强调留白、几何秩序、精确克制，通过克制来创造更强的视觉力量和精神深度。',
    examples: [
      {
        description: 'MUJI无印良品的产品设计，朴素自然',
        visualHint: '简洁线条，中性色彩，无多余装饰',
      },
      {
        description: '极简摄影，单一主体+大量留白',
        visualHint: '画面极其简洁，主体明确',
      },
    ],
    contrastExample: {
      description: '繁杂装饰的设计信息密度高但易混乱',
      visualHint: '极简对比繁复风格',
    },
    difficulty: 2,
  },
  'movement-bauhaus': {
    id: 'movement-bauhaus',
    name: '包豪斯',
    category: 'movement',
    summary: '形式追随功能，艺术与技术的统一',
    detail:
      '包豪斯（1919-1933）是20世纪最具影响力的设计学院和设计运动。它主张艺术与技术的统一，"形式追随功能"，强调几何形态、原色红黄蓝、简洁理性的设计语言。包豪斯奠定了现代设计的基础，影响了建筑、平面、产品、工业设计等几乎所有视觉领域。',
    examples: [
      {
        description: '瓦西里椅，钢管+皮革的经典现代设计',
        visualHint: '几何线条，功能主义造型',
      },
      {
        description: '康定斯基的抽象几何绘画',
        visualHint: '红黄蓝原色+几何形状构成',
      },
    ],
    contrastExample: {
      description: '前包豪斯时代的装饰艺术风格繁复',
      visualHint: '简洁理性对比装饰繁复',
    },
    difficulty: 3,
  },
  'movement-impressionism': {
    id: 'movement-impressionism',
    name: '印象派',
    category: 'movement',
    summary: '捕捉光影瞬间，打破传统再现方式',
    detail:
      '印象派兴起于19世纪70年代的法国，以莫奈、雷诺阿、德加为代表。艺术家走出画室，在户外直接描绘自然，捕捉光线变化的瞬间印象。他们放弃传统的轮廓和明暗，使用小笔触、纯净色彩并置，让观者在视觉中自行混合，创造出前所未有的鲜活光感和运动感。',
    examples: [
      {
        description: '莫奈《日出·印象》，光影朦胧的港口',
        visualHint: '小笔触并置，捕捉瞬间光线',
      },
      {
        description: '雷诺阿的舞会场景，斑驳光影',
        visualHint: '阳光透过树叶的斑痕效果',
      },
    ],
    contrastExample: {
      description: '学院派古典绘画精细平滑',
      visualHint: '印象派光感对比古典写实',
    },
    difficulty: 2,
  },
  'movement-art-deco': {
    id: 'movement-art-deco',
    name: '装饰艺术',
    category: 'movement',
    summary: '几何图案与奢华感，现代与传统的华丽融合',
    detail:
      '装饰艺术（Art Deco）盛行于1920-30年代，是两次世界大战之间的主导设计风格。它融合了现代主义的几何线条与传统的奢华工艺，标志性特征包括：对称几何图案、扇形/阳光放射纹、阶梯造型、鲜艳色彩、昂贵材质（金、银、象牙、大理石）。代表了那个时代的乐观、进步与奢华。',
    examples: [
      {
        description: '纽约克莱斯勒大厦，不锈钢尖顶装饰',
        visualHint: '几何装饰，垂直线条，奢华感',
      },
      {
        description: '《了不起的盖茨比》电影场景设计',
        visualHint: '金色几何图案，华丽装饰细节',
      },
    ],
    contrastExample: {
      description: '同时期的功能主义设计朴素实用',
      visualHint: '华丽装饰对比简洁功能',
    },
    difficulty: 2,
  },
  'movement-memphis': {
    id: 'movement-memphis',
    name: '孟菲斯风格',
    category: 'movement',
    summary: '叛逆色彩与童趣几何，打破设计规则的狂欢',
    detail:
      '孟菲斯风格由埃托雷·索特萨斯于1981年在意大利米兰创立。它是对现代主义"少即是多"的反叛，拥抱装饰、色彩和趣味。标志性元素包括：鲜艳撞色（粉红、粉蓝、荧光色）、几何图案（波点、锯齿、波浪线）、不对称构图、廉价塑料材质。充满玩世不恭的幽默感和后现代精神。',
    examples: [
      {
        description: 'Carlton书架，彩色层板+造型化设计',
        visualHint: '鲜艳几何色块，玩具感造型',
      },
      {
        description: '80年代复古海报设计风格',
        visualHint: '波点、锯齿纹、荧光色大量使用',
      },
    ],
    contrastExample: {
      description: '国际主义风格黑白灰+网格极为克制',
      visualHint: '孟菲斯的狂欢对比极简克制',
    },
    difficulty: 3,
  },
  'movement-cyberpunk': {
    id: 'movement-cyberpunk',
    name: '赛博朋克',
    category: 'movement',
    summary: '高科技低生活，霓虹与阴暗的反乌托邦美学',
    detail:
      '赛博朋克是起源于80年代科幻文学的视觉文化运动，描绘"高科技，低生活"的反乌托邦未来。视觉特征包括：雨夜霓虹、紫蓝粉色调、全息投影、汉字/日文街道招牌、身体改造、巨型企业建筑。它既是对科技过度发展的反思，也是当代亚文化和数字美学的重要来源。',
    examples: [
      {
        description: '《银翼杀手2049》的洛杉矶夜景',
        visualHint: '巨大霓虹广告牌，雨中城市，橙蓝对比',
      },
      {
        description: '《攻壳机动队》的未来都市景观',
        visualHint: '全息广告，电子故障，数字化干扰',
      },
    ],
    contrastExample: {
      description: '太阳朋克是乐观环保的未来美学',
      visualHint: '黑暗霓虹对比明亮绿色未来',
    },
    difficulty: 2,
  },
  'movement-wabi-sabi': {
    id: 'movement-wabi-sabi',
    name: '侘寂',
    category: 'movement',
    summary: '不完美之美，欣赏残缺与时间的痕迹',
    detail:
      '侘寂（Wabi-Sabi）是源自日本禅宗的独特美学理念，核心是欣赏不完美、不完整、无常的事物之美。它赞颂自然的残缺、岁月的痕迹、质朴的手工感。与西方追求完美对称和永恒的美学不同，侘寂在裂缝、锈蚀、褪色、粗糙中找到诗意，接受生命的流动与短暂。',
    examples: [
      {
        description: '带有裂纹的手工粗陶茶碗',
        visualHint: '粗糙纹理，不规则形状，金缮修复痕迹',
      },
      {
        description: '日式枯山水庭院，苔藓与枯石',
        visualHint: '极简元素，自然风化，时间痕迹',
      },
    ],
    contrastExample: {
      description: '工业量产的完美光滑产品缺乏温度',
      visualHint: '手作不完美对比工业完美',
    },
    difficulty: 3,
  },
}

export const coursePaths: CoursePath[] = [
  {
    id: 'color',
    name: '色彩理论',
    nameEn: 'Color Theory',
    description: '理解色彩的语言，掌握情绪与氛围的塑造技法',
    icon: 'Palette',
    accentColor: '#E63946',
    lessons: [
      {
        id: 'color-1',
        title: '色彩基础：色温与情感',
        conceptIds: ['color-temperature', 'color-value-contrast'],
        order: 1,
      },
      {
        id: 'color-2',
        title: '配色原理：和谐与对比',
        conceptIds: ['color-harmony-analogous', 'color-harmony-complementary'],
        order: 2,
      },
      {
        id: 'color-3',
        title: '进阶应用：饱和度与调性',
        conceptIds: ['color-saturation', 'color-monochrome'],
        order: 3,
      },
    ],
  },
  {
    id: 'composition',
    name: '构图法则',
    nameEn: 'Composition Rules',
    description: '构建视觉秩序，引导观者视线的建筑术',
    icon: 'Frame',
    accentColor: '#2A9D8F',
    lessons: [
      {
        id: 'composition-1',
        title: '基础构图：三分与对称',
        conceptIds: ['composition-thirds', 'composition-symmetry'],
        order: 1,
      },
      {
        id: 'composition-2',
        title: '引导视线：线条与框架',
        conceptIds: ['composition-leading-lines', 'composition-framing'],
        order: 2,
      },
      {
        id: 'composition-3',
        title: '高级技法：空间与比例',
        conceptIds: ['composition-negative-space', 'composition-golden-ratio', 'composition-rule-of-depth'],
        order: 3,
      },
    ],
  },
  {
    id: 'movement',
    name: '设计流派',
    nameEn: 'Design Movements',
    description: '穿越百年设计史，理解风格背后的思想',
    icon: 'Sparkles',
    accentColor: '#6A4C93',
    lessons: [
      {
        id: 'movement-1',
        title: '现代主义之源：包豪斯与印象派',
        conceptIds: ['movement-bauhaus', 'movement-impressionism'],
        order: 1,
      },
      {
        id: 'movement-2',
        title: '风格演进：装饰与极简',
        conceptIds: ['movement-art-deco', 'movement-minimalism', 'movement-wabi-sabi'],
        order: 2,
      },
      {
        id: 'movement-3',
        title: '当代思潮：孟菲斯与赛博朋克',
        conceptIds: ['movement-memphis', 'movement-cyberpunk'],
        order: 3,
      },
    ],
  },
]

export function getConceptsByCategory(category: CourseCategory): AestheticConcept[] {
  return Object.values(aestheticConcepts).filter((c) => c.category === category)
}

export function getCoursePath(id: CourseCategory): CoursePath | undefined {
  return coursePaths.find((p) => p.id === id)
}
