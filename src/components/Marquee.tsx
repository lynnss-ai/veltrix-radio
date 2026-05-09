import { useEffect, useState } from 'react';
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
  const visualWidth = stringWidth(text);
  const needsScroll = alwaysScroll || visualWidth > width;
  const fullText = needsScroll ? text + separator : text;
  const cycleLen = fullText.length;

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

  // 文本短时单纯 doubled 不够,得 repeat 到能 slice 出 width 字符
  const repeats = Math.max(2, Math.ceil((width + cycleLen) / cycleLen) + 1);
  const buffer = fullText.repeat(repeats);
  const slice = buffer.slice(offset, offset + width);
  return <Text color={color}>{slice}</Text>;
}
