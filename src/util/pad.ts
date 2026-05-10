import stringWidth from 'string-width';

// 按终端 cell 宽度右补齐 — CJK / 全角字符占 2 cell,纯 ASCII 占 1 cell
// 已超出目标宽度时返回原串(让它溢出,而不是截断)
export function padEndVisual(s: string, target: number, fill = ' '): string {
  const w = stringWidth(s);
  if (w >= target) return s;
  return s + fill.repeat(target - w);
}

// 按视觉宽度截断,溢出时尾部加 '…'(占 1 cell);最终宽度 ≤ maxWidth
// 注意 CJK 字符占 2 cell,可能因为不能切半个字符,实际宽度 = maxWidth - 1
export function truncateVisual(s: string, maxWidth: number): string {
  if (stringWidth(s) <= maxWidth) return s;
  // 逐字符累加宽度,超过 maxWidth - 1 (留一格给 '…') 就停
  const limit = maxWidth - 1;
  let acc = '';
  let w = 0;
  for (const ch of s) {
    const cw = stringWidth(ch);
    if (w + cw > limit) break;
    acc += ch;
    w += cw;
  }
  return acc + '…';
}
