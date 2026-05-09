// 持久化配置 — Windows 走 %APPDATA%\veltrix-radio,其他走 ~/.config/veltrix-radio
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import type { LocaleCode } from './i18n/types.js';
import { isLocaleCode } from './i18n/index.js';
import type { ThemeName } from './theme/index.js';
import { isThemeName } from './theme/index.js';

export interface ConfigCustomStation {
  key: string;
  name: string;
  url: string;
  genre?: string;
  desc?: string;
}

export interface UserConfig {
  locale?: LocaleCode;
  theme?: ThemeName;
  customStations?: ConfigCustomStation[];
}

function configDir(): string {
  if (process.platform === 'win32' && process.env.APPDATA) {
    return path.join(process.env.APPDATA, 'veltrix-radio');
  }
  const xdg = process.env.XDG_CONFIG_HOME;
  const base = xdg ?? path.join(os.homedir(), '.config');
  return path.join(base, 'veltrix-radio');
}

function configFile(): string {
  return path.join(configDir(), 'config.json');
}

function parseCustomStations(raw: unknown): ConfigCustomStation[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const list: ConfigCustomStation[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const x = item as Record<string, unknown>;
    if (typeof x.key !== 'string' || typeof x.name !== 'string' || typeof x.url !== 'string') continue;
    const c: ConfigCustomStation = { key: x.key, name: x.name, url: x.url };
    if (typeof x.genre === 'string') c.genre = x.genre;
    if (typeof x.desc === 'string') c.desc = x.desc;
    list.push(c);
  }
  return list.length ? list : undefined;
}

export function readConfig(): UserConfig {
  try {
    const raw = fs.readFileSync(configFile(), 'utf8');
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const cfg: UserConfig = {};
    if (typeof parsed.locale === 'string' && isLocaleCode(parsed.locale)) {
      cfg.locale = parsed.locale;
    }
    if (typeof parsed.theme === 'string' && isThemeName(parsed.theme)) {
      cfg.theme = parsed.theme;
    }
    const customs = parseCustomStations(parsed.customStations);
    if (customs) cfg.customStations = customs;
    return cfg;
  } catch {
    // 文件不存在 / 损坏 — 视为空配置
    return {};
  }
}

export function writeConfig(c: UserConfig): void {
  const dir = configDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(configFile(), JSON.stringify(c, null, 2) + '\n', 'utf8');
}

// 读 → 合并 patch → 写回。避免调用方手动 spread 时漏带字段
export function updateConfig(patch: Partial<UserConfig>): void {
  writeConfig({ ...readConfig(), ...patch });
}

export function getConfigPath(): string {
  return configFile();
}
