import { useMemo } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { render as renderCfonts } from 'cfonts';
import type { Station } from '../stations.js';
import type { PlaybackState } from '../player.js';
import type { Messages } from '../i18n/index.js';
import type { Theme } from '../theme/index.js';
import { author, version, homepage } from '../about.js';
import { CONTENT_WIDTH } from '../util/layout.js';
import Marquee from './Marquee.js';
import Waveform from './Waveform.js';

// "Track:   " 前缀的可见宽度 — 5(Track) + 1(:) + 3(空格) = 9
const TRACK_LABEL_WIDTH = 9;
const TRACK_MARQUEE_WIDTH = CONTENT_WIDTH - TRACK_LABEL_WIDTH;
const WAVEFORM_WIDTH = CONTENT_WIDTH;
const BANNER_TEXT = 'veltrix-radio';

interface Props {
  messages: Messages;
  theme: Theme;
  station: Station | null;
  state: PlaybackState;
  title: string;
  volume: number;
  error: string;
  getLevel?: () => number;
}

export default function NowPlaying({ messages: m, theme, station, state, title, volume, error, getLevel }: Props) {
  const stationName = station ? (station.custom?.name ?? m.stations[station.key]?.name ?? station.key) : '';
  // 直接 cfonts 渲染 + trim 首尾换行,用 useMemo 缓存
  // 不缓存的话:Marquee 每 250ms 触发 NowPlaying re-render,cfonts.render 每次都跑 → CPU 抖动 → 跑马灯卡顿
  // 字体由 theme.bannerFont 决定 — 限制在 ≤ 6 行 / ≤ 78 cells,避开 tiny 字体的 ▀/▄ 半块在
  // Menlo/SF Mono 上的留缝问题。每个主题选了最契合自己气质的字体(默认 slick / 赛博 pallet 等)
  const bannerString = useMemo(() => {
    // shade 字体 ls=1(默认)→ 63 cells × 8 行,在 CONTENT_WIDTH=78 里居中,两侧各约 7 cell 余白
    // shade 输出 █(笔画)+ ░(背景);映射 █→⣿(全填盲文)、░→空格 → 跟波形同款"小点点拼出来"的质感
    // ▀ ▄ 是 tiny / 其它字体可能用的半块字符,留着以备主题切回这些字体时仍能正确渲染
    const r = renderCfonts(BANNER_TEXT, { font: theme.bannerFont, space: false, colors: theme.bannerColors }) as { string: string };
    return r.string
      .replace(/^\n+|\n+$/g, '')
      .replace(/█/g, '⣿')
      .replace(/▀/g, '⠛')
      .replace(/▄/g, '⣤')
      .replace(/░/g, ' ');
  }, [theme.bannerColors, theme.bannerFont]);
  return (
    <Box flexDirection="column">
      <Box width={CONTENT_WIDTH} justifyContent="center">
        <Text>{bannerString}</Text>
      </Box>
      {/* by-line 右对齐到 CONTENT_WIDTH — 跟下方 track / waveform / 频道行的右边界一致 */}
      <Box width={CONTENT_WIDTH} justifyContent="flex-end" marginTop={1}>
        <Text color={theme.meta}>
          by <Text color={theme.metaValue}>{author}</Text>
          {' · v'}<Text color={theme.metaValue}>{version}</Text>
          {homepage ? (
            <>
              <Text>{' · '}</Text>
              <Text color={theme.link}>{homepage.replace(/^https?:\/\//, '')}</Text>
            </>
          ) : null}
        </Text>
      </Box>
      <Text> </Text>
      {station ? (
        <>
          <Text>
            <Text color={theme.meta}>{m.ui.station}: </Text>
            <Text color={theme.stationName} bold>{stationName}</Text>
            <Text color={theme.meta}> ({station.genre})</Text>
          </Text>
          <Text>
            <Text color={theme.meta}>{m.ui.track}:   </Text>
            {state === 'loading' ? (
              <Text color={theme.stateLoading}><Spinner type="dots" /> {m.ui.bufferingHint}</Text>
            ) : title ? (
              <Marquee text={title} width={TRACK_MARQUEE_WIDTH} alwaysScroll color={theme.trackText} />
            ) : (
              <Text color={theme.meta}>{m.ui.waitingMeta}</Text>
            )}
          </Text>
        </>
      ) : (
        // 没选频道时留两行空 — 保持跟 station+track 两行布局一致,pickHint 已移到 StationList 头部
        <>
          <Text> </Text>
          <Text> </Text>
        </>
      )}
      {/* Waveform 紧贴 Track 下方,无 marginTop — 滚动文本 + 波形视觉成一组 */}
      <Box>
        <Waveform active={state === 'playing'} frozen={state === 'paused'} width={WAVEFORM_WIDTH} theme={theme} getLevel={getLevel} />
      </Box>
      {/* 状态居中 + 音量靠右:左右两侧 flexGrow 弹性撑开,音量段用 🔊 图标代替"音量"文字 */}
      <Box width={CONTENT_WIDTH}>
        <Box flexGrow={1} flexBasis={0} />
        <Box>
          <StateBadge state={state} messages={m} theme={theme} />
        </Box>
        <Box flexGrow={1} flexBasis={0} justifyContent="flex-end">
          <Text>
            <Text color={theme.metaValue}>{volume.toString().padStart(3)}</Text>
            <Text>{' '}</Text>
            <VolumeBar value={volume} total={20} theme={theme} />
          </Text>
        </Box>
      </Box>
      {error ? <Text color={theme.error}>! {error}</Text> : null}
    </Box>
  );
}

function StateBadge({ state, messages: m, theme }: { state: PlaybackState; messages: Messages; theme: Theme }) {
  const colorMap: Record<PlaybackState, string> = {
    idle: theme.stateIdle,
    loading: theme.stateLoading,
    playing: theme.statePlaying,
    paused: theme.statePaused,
  };
  return <Text color={colorMap[state]}>{m.ui.states[state]}</Text>;
}

// 音量进度条 — 实心 █ 已填充, 空心 ░ 剩余。total 选 20 跟 5% 步长对齐(每格对应一次 +/- 按键)
function VolumeBar({ value, total, theme }: { value: number; total: number; theme: Theme }) {
  const filled = Math.max(0, Math.min(total, Math.round((value / 100) * total)));
  const empty = total - filled;
  return (
    <>
      <Text color={theme.metaValue}>{'█'.repeat(filled)}</Text>
      <Text color={theme.meta}>{'░'.repeat(empty)}</Text>
    </>
  );
}
