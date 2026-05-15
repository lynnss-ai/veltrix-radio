import { memo } from 'react';
import { Box, Text } from 'ink';
import type { Station } from '../stations.js';
import type { Messages } from '../i18n/index.js';
import type { Theme } from '../theme/index.js';
import { padEndVisual, truncateVisual } from '../util/pad.js';
import { CONTENT_WIDTH } from '../util/layout.js';

// 行格式: cursor(1) + ' ' + playMark(1) + ' ' + key(14) + ' ' + name(44) + ' ' + genre(?) = 64 + genre
// key 列 14 能放下最长的 missioncontrol / fip-nouveautes(14)和 swiss-classic(13)
// name 列 44 能放下大部分 zh/ko 翻译(最长 zh "沙拉律动经典 (SomaFM Groove Salad Classic)" = 42 cells)
// ja 翻译有些更长(最长 50 cells),会被 truncateVisual 截断 — 否则行溢出 CONTENT_WIDTH 触发 ink 折行,
// 折行尾部只剩空白看着像"空行"
const KEY_PAD = 14;
const NAME_PAD = 44;
const GENRE_PAD = CONTENT_WIDTH - KEY_PAD - NAME_PAD - 6;  // 6 = 2 marks + 4 spaces

interface Props {
  messages: Messages;
  theme: Theme;
  stations: Station[];
  cursorIndex: number;
  currentKey?: string;
}

function StationList({ messages: m, theme, stations, cursorIndex, currentKey }: Props) {
  return (
    <Box flexDirection="column">
      <Text>
        <Text color={theme.meta} bold>{m.ui.stationsHeader}</Text>
        <Text color={theme.meta}> ({m.ui.pickHint})</Text>
      </Text>
      {stations.map((s, i) => {
        const isCursor = i === cursorIndex;
        const isPlaying = s.key === currentKey;
        const cursorMark = isCursor ? '❯' : ' ';
        const playMark = isPlaying ? '♪' : ' ';
        const name = s.custom?.name ?? m.stations[s.key]?.name ?? s.key;
        // 自定义频道用 theme.custom 高亮(光标行仍用 theme.cursor 优先)
        const baseColor = s.custom ? theme.custom : undefined;
        return (
          <Text key={s.key} color={isCursor ? theme.cursor : baseColor} bold={isCursor}>
            {cursorMark} {playMark} {padEndVisual(s.key, KEY_PAD)} {padEndVisual(truncateVisual(name, NAME_PAD), NAME_PAD)} <Text color={theme.meta} bold={false}>{padEndVisual(s.genre, GENRE_PAD)}</Text>
          </Text>
        );
      })}
    </Box>
  );
}

// memo:Marquee 每 250ms 触发 App re-render → 没 memo 的话整 72 行 station 都重算
// 父组件用 useMemo 稳定 pageStations 引用,这里 memo 才有效
export default memo(StationList);
