// 主题系统 — 集中管理 UI 配色 + 边框样式
// 加新主题:在 themes 字典加 entry,在 ThemeName union + themeOrder 数组加名字

export type ThemeName = 'default' | 'cyberpunk' | 'mono' | 'amber' | 'forest' | 'sunset' | 'ocean' | 'matrix' | 'rose' | 'lavender';

// cfonts 字体子集 — 限制在 ≤ 8 行 / ≤ 78 cells,UI 不会被 banner 撑高/撑宽
// shade 是唯一不用横线字符(━ ═ ─ _ ╋)的字体,只用 █+░ 实心块和阴影点,字母靠面而非线
export type BannerFont = 'console' | 'tiny' | 'chrome' | 'slick' | 'grid' | 'pallet' | 'shade';

export interface Theme {
  name: ThemeName;
  // banner / 边框
  border: string;
  bannerColors: string[];                  // BigText 渐变(单色就传 1 个)
  bannerFont: BannerFont;                  // cfonts 字体(当前所有主题统一 shade,实心块无横线)
  borderStyle: 'round' | 'double' | 'single' | 'classic' | 'bold';
  // 列表导航
  cursor: string;                          // 光标行色
  custom: string;                          // 自定义频道高亮
  // 文字层级
  meta: string;                            // 灰色提示
  metaValue: string;                       // 强调值(白)
  link: string;                            // GitHub link
  trackText: string;                       // track marquee
  stationName: string;                     // 当前播放电台名
  // 状态徽章
  stateIdle: string;
  stateLoading: string;
  statePlaying: string;
  statePaused: string;
  error: string;
  // modal 选择器显示用
  nativeName: string;
  description: string;
}

export const themes: Record<ThemeName, Theme> = {
  default: {
    name: 'default',
    border: 'cyan',
    bannerColors: ['cyan', 'blue'],
    bannerFont: 'shade',
    borderStyle: 'round',
    cursor: 'cyan',
    custom: 'magenta',
    meta: 'gray',
    metaValue: 'white',
    link: 'cyan',
    trackText: 'white',
    stationName: 'green',
    stateIdle: 'gray',
    stateLoading: 'yellow',
    statePlaying: 'green',
    statePaused: 'yellow',
    error: 'red',
    nativeName: 'Default',
    description: 'Calm cyan accent',
  },
  cyberpunk: {
    name: 'cyberpunk',
    border: 'magenta',
    bannerColors: ['magenta', 'cyan'],     // banner 渐变 magenta→cyan
    bannerFont: 'shade',
    borderStyle: 'double',
    cursor: 'magentaBright',
    custom: 'yellowBright',
    meta: 'magenta',
    metaValue: 'yellowBright',
    link: 'cyanBright',
    trackText: 'cyanBright',
    stationName: 'magentaBright',
    stateIdle: 'gray',
    stateLoading: 'yellowBright',
    statePlaying: 'magentaBright',
    statePaused: 'yellowBright',
    error: 'redBright',
    nativeName: 'Cyberpunk',
    description: 'Neon magenta + cyan',
  },
  mono: {
    name: 'mono',
    border: 'white',
    bannerColors: ['whiteBright'],         // 单色,无渐变 — 极简感
    bannerFont: 'shade',
    borderStyle: 'single',
    cursor: 'whiteBright',
    custom: 'white',                       // 自定义频道用更亮的白区分
    meta: 'gray',
    metaValue: 'whiteBright',
    link: 'white',
    trackText: 'whiteBright',
    stationName: 'whiteBright',
    stateIdle: 'gray',
    stateLoading: 'white',
    statePlaying: 'whiteBright',
    statePaused: 'gray',
    error: 'red',                          // 错误依然红 — 唯一保留色相,避免漏报
    nativeName: 'Mono',
    description: 'Black & white minimalist',
  },
  amber: {
    name: 'amber',
    border: 'yellow',
    bannerColors: ['yellowBright', 'yellow'],
    bannerFont: 'shade',
    borderStyle: 'classic',                // 复古 ASCII 边框配 CRT 主题
    cursor: 'yellowBright',
    custom: 'redBright',
    meta: 'yellow',                        // dim yellow 在深色背景呈琥珀色 — 跟 yellowBright 形成层次
    metaValue: 'yellowBright',
    link: 'yellowBright',
    trackText: 'yellowBright',
    stationName: 'yellowBright',
    stateIdle: 'gray',
    stateLoading: 'redBright',
    statePlaying: 'yellowBright',
    statePaused: 'yellow',
    error: 'redBright',
    nativeName: 'Amber',
    description: 'Retro CRT amber terminal',
  },
  forest: {
    name: 'forest',
    border: 'green',
    bannerColors: ['green', 'cyan'],
    bannerFont: 'shade',
    borderStyle: 'bold',
    cursor: 'greenBright',
    custom: 'yellow',
    meta: 'gray',
    metaValue: 'whiteBright',
    link: 'cyanBright',
    trackText: 'green',
    stationName: 'greenBright',
    stateIdle: 'gray',
    stateLoading: 'yellow',
    statePlaying: 'greenBright',
    statePaused: 'yellow',
    error: 'redBright',
    nativeName: 'Forest',
    description: 'Mossy green + cyan',
  },
  sunset: {
    name: 'sunset',
    border: 'red',
    bannerColors: ['red', 'yellow'],       // 红→黄渐变模拟夕阳
    bannerFont: 'shade',
    borderStyle: 'round',
    cursor: 'redBright',
    custom: 'magentaBright',
    meta: 'gray',
    metaValue: 'yellowBright',
    link: 'yellowBright',
    trackText: 'yellowBright',
    stationName: 'redBright',
    stateIdle: 'gray',
    stateLoading: 'yellow',
    statePlaying: 'yellowBright',
    statePaused: 'red',
    error: 'magentaBright',                // 暖色已占满 red/yellow,error 走品红才跳得出
    nativeName: 'Sunset',
    description: 'Warm red + amber',
  },
  ocean: {
    name: 'ocean',
    border: 'blue',
    bannerColors: ['blue', 'cyan'],        // 海面深蓝过渡浅青
    bannerFont: 'shade',
    borderStyle: 'round',
    cursor: 'cyanBright',
    custom: 'cyanBright',
    meta: 'gray',
    metaValue: 'whiteBright',
    link: 'cyanBright',
    trackText: 'cyan',
    stationName: 'blueBright',             // 跟 default(cyan 主导)拉开 — 这里蓝主导
    stateIdle: 'gray',
    stateLoading: 'cyan',
    statePlaying: 'cyanBright',
    statePaused: 'blue',
    error: 'redBright',
    nativeName: 'Ocean',
    description: 'Deep blue + cyan',
  },
  matrix: {
    name: 'matrix',
    border: 'green',
    bannerColors: ['greenBright', 'green'],
    bannerFont: 'shade',
    borderStyle: 'single',
    cursor: 'greenBright',
    custom: 'green',                       // 全屏单色相,自定义频道用 dim green 区分
    meta: 'green',                         // dim olive — 跟 forest(灰色 meta + 多色)完全不同的"沉浸式全绿"
    metaValue: 'greenBright',
    link: 'greenBright',
    trackText: 'green',
    stationName: 'greenBright',
    stateIdle: 'green',
    stateLoading: 'greenBright',
    statePlaying: 'greenBright',
    statePaused: 'green',
    error: 'redBright',                    // 唯一非绿色相,避免漏报
    nativeName: 'Matrix',
    description: 'Digital rain green',
  },
  rose: {
    name: 'rose',
    border: 'magenta',
    bannerColors: ['magenta', 'red'],      // 暖玫瑰渐变
    bannerFont: 'shade',
    borderStyle: 'round',                  // 跟 cyberpunk(double) 拉开
    cursor: 'magentaBright',
    custom: 'redBright',
    meta: 'gray',
    metaValue: 'whiteBright',
    link: 'magentaBright',
    trackText: 'whiteBright',
    stationName: 'magentaBright',
    stateIdle: 'gray',
    stateLoading: 'redBright',
    statePlaying: 'magentaBright',
    statePaused: 'red',
    error: 'redBright',
    nativeName: 'Rose',
    description: 'Warm pink + crimson',
  },
  lavender: {
    name: 'lavender',
    border: 'blue',
    bannerColors: ['magenta', 'blue'],     // 紫蓝渐变,梦幻冷调
    bannerFont: 'shade',
    borderStyle: 'bold',                   // 跟 ocean(round/blue) 拉开
    cursor: 'magentaBright',
    custom: 'blueBright',
    meta: 'gray',
    metaValue: 'whiteBright',
    link: 'blueBright',
    trackText: 'whiteBright',
    stationName: 'magentaBright',
    stateIdle: 'gray',
    stateLoading: 'magenta',
    statePlaying: 'magentaBright',
    statePaused: 'blue',
    error: 'redBright',
    nativeName: 'Lavender',
    description: 'Cool purple + blue',
  },
};

export const themeOrder: ThemeName[] = ['default', 'cyberpunk', 'mono', 'amber', 'forest', 'sunset', 'ocean', 'matrix', 'rose', 'lavender'];

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}

export function isThemeName(s: string | undefined | null): s is ThemeName {
  return typeof s === 'string' && (themeOrder as string[]).includes(s);
}
