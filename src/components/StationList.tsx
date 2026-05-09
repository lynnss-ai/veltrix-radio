import { memo } from 'react';
import { Box, Text } from 'ink';
import type { Station } from '../stations.js';
import type { Messages } from '../i18n/index.js';
import type { Theme } from '../theme/index.js';
import { padEndVisual } from '../util/pad.js';

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
      <Text color={theme.meta} bold>{m.ui.stationsHeader}</Text>
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
            {cursorMark} {playMark} {padEndVisual(s.key, 12)} {padEndVisual(name, 34)} <Text color={theme.meta} bold={false}>{s.genre}</Text>
          </Text>
        );
      })}
    </Box>
  );
}

// memo:Marquee 每 250ms 触发 App re-render → 没 memo 的话整 72 行 station 都重算
// 父组件用 useMemo 稳定 pageStations 引用,这里 memo 才有效
export default memo(StationList);
