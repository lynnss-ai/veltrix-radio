import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../theme/index.js';

// Unicode block elements 1/8 ~ 8/8 — 顶部行用这些表示部分填充
const HEIGHT_CHARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
const FULL = '█';
const BASELINE = '▁';
const UNITS_PER_ROW = HEIGHT_CHARS.length; // 8 — 每行的精度

interface Props {
  active: boolean;
  width: number;
  height?: number;        // 波形行数(垂直),默认 4
  intervalMs?: number;
  theme: Theme;
  // 由 player 通过 mpv astats filter 拿到的 RMS 电平 [0, 1]
  // 用 callback 而非 prop 值,避免 mpv 高频推送触发 React re-render
  getLevel?: () => number;
}

// 每个 column 高度按 [0, height * 8] 整数表示,渲染时拆分到多行
// 第 row 行(底=0,顶=height-1)的字符:
//   units >= (row+1)*8 → █(完全填充)
//   units <= row*8     → 空格
//   否则               → HEIGHT_CHARS[(units - row*8) - 1]  (部分填充)
function getCharAt(units: number, row: number): string {
  const cellBottom = row * UNITS_PER_ROW;
  const cellTop = (row + 1) * UNITS_PER_ROW;
  if (units >= cellTop) return FULL;
  if (units <= cellBottom) return ' ';
  const partial = units - cellBottom;
  return HEIGHT_CHARS[partial - 1] ?? BASELINE;
}

export default function Waveform({
  active,
  width,
  height = 4,
  intervalMs = 100,
  theme,
  getLevel,
}: Props) {
  const totalUnits = height * UNITS_PER_ROW;
  const [heights, setHeights] = useState<number[]>(() => Array(width).fill(0));

  useEffect(() => {
    if (!active) {
      setHeights(Array(width).fill(0));
      return;
    }
    const id = setInterval(() => {
      const level = getLevel ? getLevel() : 0;
      const jitter = (Math.random() - 0.5) * 0.08;
      const value = Math.max(0, Math.min(1, level + jitter));
      const v = Math.floor(value * totalUnits);
      setHeights((prev) => {
        const next = prev.slice(1);
        next.push(Math.max(0, Math.min(totalUnits, v)));
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [active, width, intervalMs, getLevel, totalUnits]);

  if (!active) {
    // inactive:只在最底行画 baseline,上面行留空
    return (
      <Box flexDirection="column">
        {Array.from({ length: height }, (_, idx) => (
          <Text key={idx} color={theme.meta}>
            {idx === height - 1 ? BASELINE.repeat(width) : ' '.repeat(width)}
          </Text>
        ))}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {Array.from({ length: height }, (_, idx) => {
        // idx=0 是顶,row 是从底数的索引
        const row = height - 1 - idx;
        const line = heights.map((h) => getCharAt(h, row)).join('');
        return (
          <Text key={idx} color={theme.statePlaying}>
            {line}
          </Text>
        );
      })}
    </Box>
  );
}
