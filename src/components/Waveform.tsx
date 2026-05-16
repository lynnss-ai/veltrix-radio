import { useEffect, useRef, useState } from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../theme/index.js';

// 盲文全列累积 — 每个 cell 左右两列点同时填,自底向上堆 1~4 个 row-pair
// 比单半列方案密度 ×2,实心波形看起来由密集点阵构成;颜色循环在渲染端处理
const FULL_FILL = ['⣀', '⣤', '⣶', '⣿'];    // 1→4 个 row-pair(底→顶累积)
const FULL = '⣿';
const BASELINE = '⣀';
const UNITS_PER_ROW = FULL_FILL.length; // 4 — 子格分辨率

interface Props {
  active: boolean;
  // frozen 时停止动画但保留最后一帧 — 用于 paused 状态,提示"还在这里只是停了"
  frozen?: boolean;
  width: number;
  height?: number;        // 波形行数(垂直),默认 4
  intervalMs?: number;
  theme: Theme;
  // 由 player 通过 mpv astats filter 拿到的 RMS 电平 [0, 1]
  // 用 callback 而非 prop 值,避免 mpv 高频推送触发 React re-render
  getLevel?: () => number;
}

// 点阵填充模式:每列从底起向上堆点,直到当前电平 — 电平以下的 cell 满填,正好穿过的 cell 取部分填充
// 4 行 × 4 子格 = 16 级垂直精度;经 EMA + 横向高斯平滑后视觉够丝滑
function getCharAt(units: number, row: number): string {
  const cellBottom = row * UNITS_PER_ROW;
  const cellTop = (row + 1) * UNITS_PER_ROW;
  if (units >= cellTop) return FULL;
  if (units > cellBottom) {
    const partial = units - cellBottom;
    return FULL_FILL[partial - 1] ?? FULL_FILL[0]!;
  }
  if (units < 1 && row === 0) return BASELINE;
  return ' ';
}

export default function Waveform({
  active,
  frozen = false,
  width,
  height = 4,
  intervalMs = 50,           // 20fps — body 改动小、20Hz 已足够丝滑;30Hz 反而让 redraw 翻倍触发终端 flicker
  theme,
  getLevel,
}: Props) {
  const totalUnits = height * UNITS_PER_ROW;
  const [heights, setHeights] = useState<number[]>(() => Array(width).fill(0));
  // 时序低通滤波器:不对称 alpha 让上升快、下降慢,模拟模拟 VU 表的余韵感
  const smoothedRef = useRef(0);

  useEffect(() => {
    if (!active) {
      // frozen:停 interval 但 heights 保留 — paused 时最后一帧不动地挂在那
      // 非 frozen(idle/loading):清零回基线
      if (!frozen) {
        setHeights(Array(width).fill(0));
        smoothedRef.current = 0;
      }
      return;
    }
    const id = setInterval(() => {
      const target = getLevel ? getLevel() : 0;
      const cur = smoothedRef.current;
      // attack=0.7 上升快(瞬态跟得上),release=0.15 缓降 — 模拟 VU 表的余韵感
      const alpha = target > cur ? 0.7 : 0.15;
      smoothedRef.current = cur + (target - cur) * alpha;
      const v = Math.max(0, Math.min(totalUnits, Math.floor(smoothedRef.current * totalUnits)));
      setHeights((prev) => { const next = prev.slice(1); next.push(v); return next; });
    }, intervalMs);
    return () => clearInterval(id);
  }, [active, frozen, width, intervalMs, getLevel, totalUnits]);

  if (!active && !frozen) {
    // inactive(idle/loading):只在最底行画基线点
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

  // 3-tap 高斯横向平滑:weights [1, 2, 1] / 4 — 相邻列高度差磨平,流动曲线而非独立柱状
  const displayHeights = heights.map((h, i) => {
    const prev = i > 0 ? (heights[i - 1] ?? h) : h;
    const next = i < heights.length - 1 ? (heights[i + 1] ?? h) : h;
    return Math.round((prev + h * 2 + next) / 4);
  });

  // 调色板:active 用主题手挑的 6 色 hex truecolor;frozen 塌成单色 statePaused
  const palette: string[] = frozen ? [theme.statePaused] : theme.waveColors;

  return (
    <Box flexDirection="column">
      {Array.from({ length: height }, (_, idx) => {
        // idx=0 是顶,row 是从底数的索引
        const row = height - 1 - idx;
        return (
          <Text key={idx}>
            {displayHeights.map((h, ci) => (
              <Text key={ci} color={palette[ci % palette.length]}>{getCharAt(h, row)}</Text>
            ))}
          </Text>
        );
      })}
    </Box>
  );
}
