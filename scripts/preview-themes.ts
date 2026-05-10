import { themes, themeOrder } from '../src/theme/index.js';
import { render as renderCfonts } from 'cfonts';

const ANSI: Record<string, string> = {
  black: '30', red: '31', green: '32', yellow: '33',
  blue: '34', magenta: '35', cyan: '36', white: '37',
  gray: '90', blackBright: '90',
  redBright: '91', greenBright: '92', yellowBright: '93',
  blueBright: '94', magentaBright: '95', cyanBright: '96', whiteBright: '97',
};
const c = (name: string, txt: string): string => `\x1b[${ANSI[name] ?? '37'}m${txt}\x1b[0m`;

const borderTop: Record<string, string> = {
  round: '╭───────────────╮', double: '╔═══════════════╗', single: '┌───────────────┐',
  classic: '+---------------+', bold: '┏━━━━━━━━━━━━━━━┓',
};
const borderSide: Record<string, string> = {
  round: '│', double: '║', single: '│', classic: '|', bold: '┃',
};
const borderBot: Record<string, string> = {
  round: '╰───────────────╯', double: '╚═══════════════╝', single: '└───────────────┘',
  classic: '+---------------+', bold: '┗━━━━━━━━━━━━━━━┛',
};

console.log();
for (const n of themeOrder) {
  const t = themes[n];
  const top = c(t.border, borderTop[t.borderStyle] ?? '');
  const bot = c(t.border, borderBot[t.borderStyle] ?? '');
  const side = c(t.border, borderSide[t.borderStyle] ?? '|');

  // 用 cfonts 真实渲染当前主题的 banner 字体 + 配色,避免预览跟实际不一致
  const bannerCf = renderCfonts('veltrix-radio', {
    font: t.bannerFont, space: false, colors: t.bannerColors,
  }) as { string: string };
  const banner = bannerCf.string.replace(/^\n+|\n+$/g, '');
  const station = `${c(t.meta, 'Station: ')}${c(t.stationName, 'Groove Salad')}`;
  const track = `${c(t.meta, 'Track:   ')}${c(t.trackText, 'Some Artist — Some Track')}`;
  const states = [
    c(t.stateIdle, '○ idle'), c(t.stateLoading, '… load'),
    c(t.statePlaying, '⏵ play'), c(t.statePaused, '⏸ pause'),
  ].join('  ');
  const errSample = c(t.error, '! sample error message');

  console.log(`${c('whiteBright', t.name.toUpperCase().padEnd(11))}${c(t.meta, t.description)} (font: ${t.bannerFont})`);
  console.log(banner);
  console.log(`  ${station}`);
  console.log(`  ${track}`);
  console.log(`  ${c(t.meta, 'States:')}  ${states}`);
  console.log(`  ${errSample}`);
  console.log();
}
