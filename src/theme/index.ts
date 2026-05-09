// 主题系统 — 集中管理 UI 配色 + 边框样式
// 加新主题:在 themes 字典加 entry,在 ThemeName union + themeOrder 数组加名字

export type ThemeName = 'default' | 'cyberpunk';

export interface Theme {
  name: ThemeName;
  // banner / 边框
  border: string;
  bannerColors: string[];                  // BigText 渐变(单色就传 1 个)
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
};

export const themeOrder: ThemeName[] = ['default', 'cyberpunk'];

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}

export function isThemeName(s: string | undefined | null): s is ThemeName {
  return typeof s === 'string' && (themeOrder as string[]).includes(s);
}
