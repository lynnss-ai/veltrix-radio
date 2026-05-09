import { useMemo } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { render as renderCfonts } from 'cfonts';
import stringWidth from 'string-width';
import type { Station } from '../stations.js';
import type { PlaybackState } from '../player.js';
import type { Messages } from '../i18n/index.js';
import type { Theme } from '../theme/index.js';
import { author, version, homepage } from '../about.js';
import Marquee from './Marquee.js';
import Waveform from './Waveform.js';

const TRACK_MARQUEE_WIDTH = 50;
const WAVEFORM_WIDTH = 60;
const BANNER_TEXT = 'veltrix-radio';

// 用 cfonts 算 banner 视觉宽度,byLine 跟它一致才能跟最右字符对齐
// tiny font:2 行高、~50 cells 宽 — 比 simple(5 行 / ~75 cells)紧凑得多
// string-width 会 strip ANSI 码,得到真实 cell 宽度
const BANNER_WIDTH = (() => {
  const result = renderCfonts(BANNER_TEXT, { font: 'tiny', space: false }) as { string: string };
  return Math.max(...result.string.split('\n').map((l: string) => stringWidth(l)));
})();

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
  const bannerString = useMemo(() => {
    const r = renderCfonts(BANNER_TEXT, { font: 'tiny', space: false, colors: theme.bannerColors }) as { string: string };
    return r.string.replace(/^\n+|\n+$/g, '');
  }, [theme.bannerColors]);
  return (
    <Box flexDirection="column">
      <Text>{bannerString}</Text>
      {/* byLine 容器宽度固定为 banner 宽度,内部 flex-end 把文字推到右边 → 跟 banner 最右字符对齐 */}
      <Box width={BANNER_WIDTH} justifyContent="flex-end" marginTop={1}>
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
        <Text color={theme.meta}>{m.ui.pickHint}</Text>
      )}
      {/* Waveform 紧贴 Track 下方,无 marginTop — 滚动文本 + 波形视觉成一组 */}
      <Box>
        <Waveform active={state === 'playing'} width={WAVEFORM_WIDTH} theme={theme} getLevel={getLevel} />
      </Box>
      <Text>
        <Text color={theme.meta}>{m.ui.state}:   </Text>
        <StateBadge state={state} messages={m} theme={theme} />
        <Text color={theme.meta}>   {m.ui.volume}: </Text>
        <Text color={theme.metaValue}>{volume.toString().padStart(3)}</Text>
        <Text>{' '}</Text>
        <VolumeBar value={volume} total={10} theme={theme} />
      </Text>
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

// 音量进度条 — 实心 █ 已填充, 空心 ░ 剩余
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
