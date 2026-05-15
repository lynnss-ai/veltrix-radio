import { useEffect, useRef, useState } from 'react';
import { Box, Text } from 'ink';
import type { Theme } from '../theme/index.js';

// 盲文全列累积 — 每个 cell 左右两列点同时填,自底向上堆 1~4 个 row-pair(主体)
// 单行细带:row 内某一子行的"扁平点条",用作 peak 顶点叠层 — 浮在 body 上方的瞬态指示
const FULL_FILL = ['⣀', '⣤', '⣶', '⣿'];    // body:1→4 个 row-pair(底→顶累积)
const PEAK_FILL = ['⣀', '⠤', '⠒', '⠉'];    // peak:对应 4 个子行的单层点条(底→顶)
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
  // 由 player 通过 mpv astats 拿到的 RMS + Peak(归一化 [0, 1])
  // 用 callback + drain peak 而非 prop,避免 mpv 高频推送丢峰 / 触发 React re-render
  getLevel?: () => { rms: number; peak: number };
}

// 给定 body / peak 单位高度,决定 (row, col) 应画什么
// 优先级:peak 在该 cell 内且高于 body → peak 顶点;否则按 body 填充逻辑
function getCellChar(bodyUnits: number, peakUnits: number, row: number): { char: string; isPeak: boolean } {
  const cellBottom = row * UNITS_PER_ROW;
  const cellTop = (row + 1) * UNITS_PER_ROW;
  // peak 在 body 之上时,peak 所在 cell 显示扁平点条作为顶点标记
  if (peakUnits > bodyUnits && peakUnits > cellBottom && peakUnits <= cellTop) {
    const subRow = peakUnits - cellBottom;
    return { char: PEAK_FILL[subRow - 1] ?? PEAK_FILL[0]!, isPeak: true };
  }
  if (bodyUnits >= cellTop) return { char: FULL, isPeak: false };
  if (bodyUnits > cellBottom) {
    const partial = bodyUnits - cellBottom;
    return { char: FULL_FILL[partial - 1] ?? FULL_FILL[0]!, isPeak: false };
  }
  if (bodyUnits < 1 && row === 0) return { char: BASELINE, isPeak: false };
  return { char: ' ', isPeak: false };
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
  const [bodyHeights, setBodyHeights] = useState<number[]>(() => Array(width).fill(0));
  const [peakHeights, setPeakHeights] = useState<number[]>(() => Array(width).fill(0));
  // 双 EMA:body 走对称偏慢,peak 瞬态 attack=1 + 极慢 release(峰值"挽留")
  const bodySmoothedRef = useRef(0);
  const peakSmoothedRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (!frozen) {
        setBodyHeights(Array(width).fill(0));
        setPeakHeights(Array(width).fill(0));
        bodySmoothedRef.current = 0;
        peakSmoothedRef.current = 0;
      }
      return;
    }
    const id = setInterval(() => {
      const { rms, peak } = getLevel ? getLevel() : { rms: 0, peak: 0 };

      // body:attack=0.7 上升快,release=0.15 缓降 — 模拟模拟 VU 表的余韵
      const bodyCur = bodySmoothedRef.current;
      const bodyAlpha = rms > bodyCur ? 0.7 : 0.15;
      bodySmoothedRef.current = bodyCur + (rms - bodyCur) * bodyAlpha;

      // peak:attack=1 一帧到位(瞬态绝不被平滑掉),release=0.05 ~20 帧才回半,峰值"挂"出明显尖头
      const peakCur = peakSmoothedRef.current;
      const peakAlpha = peak > peakCur ? 1.0 : 0.05;
      peakSmoothedRef.current = peakCur + (peak - peakCur) * peakAlpha;

      const bodyV = Math.max(0, Math.min(totalUnits, Math.floor(bodySmoothedRef.current * totalUnits)));
      const peakV = Math.max(0, Math.min(totalUnits, Math.floor(peakSmoothedRef.current * totalUnits)));

      setBodyHeights((prev) => { const next = prev.slice(1); next.push(bodyV); return next; });
      setPeakHeights((prev) => { const next = prev.slice(1); next.push(peakV); return next; });
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
  const smooth = (arr: number[]) => arr.map((h, i) => {
    const prev = i > 0 ? (arr[i - 1] ?? h) : h;
    const next = i < arr.length - 1 ? (arr[i + 1] ?? h) : h;
    return Math.round((prev + h * 2 + next) / 4);
  });
  const dispBody = smooth(bodyHeights);
  const dispPeak = smooth(peakHeights);

  // 调色板:active 用主题手挑的 6 色 hex truecolor;frozen 塌成单色 statePaused
  // peak 顶点统一用 metaValue(各主题里多为 whiteBright),从 body 的 6 色里跳出来
  const palette: string[] = frozen ? [theme.statePaused] : theme.waveColors;
  const peakColor = frozen ? theme.statePaused : theme.metaValue;

  return (
    <Box flexDirection="column">
      {Array.from({ length: height }, (_, idx) => {
        // idx=0 是顶,row 是从底数的索引
        const row = height - 1 - idx;
        return (
          <Text key={idx}>
            {dispBody.map((bh, ci) => {
              const { char, isPeak } = getCellChar(bh, dispPeak[ci] ?? 0, row);
              const color = isPeak ? peakColor : palette[ci % palette.length];
              return <Text key={ci} color={color}>{char}</Text>;
            })}
          </Text>
        );
      })}
    </Box>
  );
}
