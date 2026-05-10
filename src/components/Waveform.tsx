import { useEffect, useRef, useState } from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../theme/index.js';

// Unicode block elements 1/8 ~ 8/8 — 用于在曲线穿过的那一行画 partial 字符
const HEIGHT_CHARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
const BASELINE = '▁';
const UNITS_PER_ROW = HEIGHT_CHARS.length; // 8 — 每行的精度(子格分辨率)

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

// 曲线模式:每列只在曲线"穿过"的那一行画一个 partial 字符,其他行留空
// → 视觉是一条流动的细线,不是大片填充方块,刷新时被改变的字符极少,显著降低终端 redraw flicker
// 子格分辨率仍然 8 级(▁~█),所以 4 行 × 8 = 32 级垂直精度,跟原 bar 模式一样
//
// units < 1(几乎静音)时,在底行画 baseline,作为"还在播只是轻"的提示
function getCharAt(units: number, row: number): string {
  const cellBottom = row * UNITS_PER_ROW;
  const cellTop = (row + 1) * UNITS_PER_ROW;
  if (units > cellBottom && units <= cellTop) {
    const partial = units - cellBottom;
    return HEIGHT_CHARS[partial - 1] ?? BASELINE;
  }
  if (units < 1 && row === 0) return BASELINE;
  return ' ';
}

export default function Waveform({
  active,
  width,
  height = 4,
  intervalMs = 50,           // 20fps — 曲线模式下被改字符少,20Hz 已足够丝滑;30Hz 反而让 redraw 翻倍触发终端 flicker
  theme,
  getLevel,
}: Props) {
  const totalUnits = height * UNITS_PER_ROW;
  const [heights, setHeights] = useState<number[]>(() => Array(width).fill(0));
  // 时序低通滤波器:不对称 alpha 让上升快、下降慢,模拟模拟 VU 表的余韵感
  const smoothedRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setHeights(Array(width).fill(0));
      smoothedRef.current = 0;
      return;
    }
    const id = setInterval(() => {
      const target = getLevel ? getLevel() : 0;
      const cur = smoothedRef.current;
      // attack=0.5 (上升半程一帧到位),release=0.15 (~6 帧才回到一半,看着会"挽留"一下)
      const alpha = target > cur ? 0.5 : 0.15;
      const smoothed = cur + (target - cur) * alpha;
      smoothedRef.current = smoothed;
      const jitter = (Math.random() - 0.5) * 0.02;  // 进一步减小,有 EMA + 横向平滑后,微动就够看出生气
      const value = Math.max(0, Math.min(1, smoothed + jitter));
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

  // 3-tap 高斯横向平滑:weights [1, 2, 1] / 4 — 相邻列高度差被磨平,看起来像流动曲线而非独立柱状
  // 边界(i=0 / i=last)用自身代替缺失邻居,效果等同于 reflect padding
  const displayHeights = heights.map((h, i) => {
    const prev = i > 0 ? (heights[i - 1] ?? h) : h;
    const next = i < heights.length - 1 ? (heights[i + 1] ?? h) : h;
    return Math.round((prev + h * 2 + next) / 4);
  });

  return (
    <Box flexDirection="column">
      {Array.from({ length: height }, (_, idx) => {
        // idx=0 是顶,row 是从底数的索引
        const row = height - 1 - idx;
        const line = displayHeights.map((h) => getCharAt(h, row)).join('');
        return (
          <Text key={idx} color={theme.statePlaying}>
            {line}
          </Text>
        );
      })}
    </Box>
  );
}
