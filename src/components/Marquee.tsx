import { useEffect, useMemo, useState } from 'react';
import { Text } from 'ink';
import stringWidth from 'string-width';

interface Props {
  text: string;
  width: number;          // 显示窗口宽度(visual cells)
  intervalMs?: number;    // 滚动间隔
  separator?: string;     // 文本结尾跟下一轮之间的分隔符
  color?: string;
  alwaysScroll?: boolean; // 即使文本短于窗口也强制循环滚动
}

// 简单跑马灯:文本视觉宽度 > 窗口宽度,或 alwaysScroll 开启时,以 1 字符/帧循环左移
// CJK 等宽字符在边界可能略不准,但每轮归零后视觉上仍清晰
export default function Marquee({
  text,
  width,
  intervalMs = 250,
  separator = '   •   ',
  color = 'white',
  alwaysScroll = false,
}: Props) {
  const [offset, setOffset] = useState(0);

  // text/width/separator/alwaysScroll 在一首歌内都不变,但 setOffset 每 250ms 触发 re-render —
  // 不缓存的话 stringWidth + fullText.repeat 也跟着每 250ms 重跑(CJK 标题 stringWidth 不便宜,
  // repeat 还分配整个 buffer)。一次性算好,re-render 时只剩 slice
  const { needsScroll, cycleLen, buffer } = useMemo(() => {
    const visualWidth = stringWidth(text);
    const ns = alwaysScroll || visualWidth > width;
    const fullText = ns ? text + separator : text;
    const cl = fullText.length;
    if (!ns) return { needsScroll: false, cycleLen: cl, buffer: '' };
    const repeats = Math.max(2, Math.ceil((width + cl) / cl) + 1);
    return { needsScroll: true, cycleLen: cl, buffer: fullText.repeat(repeats) };
  }, [text, width, separator, alwaysScroll]);

  useEffect(() => {
    // text 切换时立即归零,避免显示中段
    setOffset(0);
    if (!needsScroll) return;
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % cycleLen);
    }, intervalMs);
    return () => clearInterval(id);
  }, [text, needsScroll, intervalMs, cycleLen]);

  if (!needsScroll) {
    return <Text color={color}>{text}</Text>;
  }

  const slice = buffer.slice(offset, offset + width);
  return <Text color={color}>{slice}</Text>;
}
