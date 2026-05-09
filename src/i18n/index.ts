import { messages, localeOrder } from './messages.js';
import type { LocaleCode, Messages } from './types.js';

export { messages, localeOrder };
export type { LocaleCode, Messages, StationStrings } from './types.js';

export function getMessages(code: LocaleCode): Messages {
  return messages[code];
}

// 把 'zh-CN', 'en_US.UTF-8', 'ja_JP' 这种 locale 字符串规范化到我们支持的代码
function normalizeLocale(s: string | undefined | null): LocaleCode | null {
  if (!s) return null;
  const lower = s.toLowerCase();
  // 注意 Burmese 在 BCP-47 / POSIX 都可能是 'my' (与马来语 'ms' 区分)
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('en')) return 'en';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('vi')) return 'vi';
  if (lower.startsWith('my') || lower.startsWith('bo')) return 'my';
  if (lower.startsWith('th')) return 'th';
  return null;
}

export interface DetectOptions {
  flag?: string | null;
  configValue?: string | null;
}

// 优先级: --lang flag > VELTRIX_LANG env > 配置文件 > en
// 故意不读系统 LANG/LC_ALL — 让默认始终为英文,避免被系统区域设置悄悄决定 UI 语言
export function detectLocale(opts: DetectOptions = {}): LocaleCode {
  const fromFlag = normalizeLocale(opts.flag);
  if (fromFlag) return fromFlag;

  const fromEnv = normalizeLocale(process.env.VELTRIX_LANG);
  if (fromEnv) return fromEnv;

  const fromConfig = normalizeLocale(opts.configValue);
  if (fromConfig) return fromConfig;

  return 'en';
}

export function isLocaleCode(s: string | undefined | null): s is LocaleCode {
  return typeof s === 'string' && (localeOrder as string[]).includes(s);
}
