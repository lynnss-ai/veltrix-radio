import stringWidth from 'string-width';

// 按终端 cell 宽度右补齐 — CJK / 全角字符占 2 cell,纯 ASCII 占 1 cell
// 已超出目标宽度时返回原串(让它溢出,而不是截断)
export function padEndVisual(s: string, target: number, fill = ' '): string {
  const w = stringWidth(s);
  if (w >= target) return s;
  return s + fill.repeat(target - w);
}
