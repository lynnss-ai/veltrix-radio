#!/usr/bin/env bun
import { render } from 'ink';
import App from './components/App.js';
import { findStation, mergeWithCustom, type Station } from './stations.js';
import { detectLocale, getMessages, isLocaleCode, localeOrder } from './i18n/index.js';
import { readConfig, updateConfig, type ConfigCustomStation } from './config.js';
import { padEndVisual } from './util/pad.js';
import { author, version, lastUpdated, homepage } from './about.js';

const argv = process.argv.slice(2);

// --lang <code> 解析 + 从 argv 摘掉,后续 play/list/add/remove 解析不受影响
function extractLangFlag(args: string[]): string | undefined {
  const idx = args.indexOf('--lang');
  if (idx < 0) return undefined;
  const value = args[idx + 1];
  args.splice(idx, value ? 2 : 1);
  return value;
}

const langFlag = extractLangFlag(argv);
const cfg = readConfig();
const locale = detectLocale({ flag: langFlag, configValue: cfg.locale });
const m = getMessages(locale);

if (langFlag && !isLocaleCode(detectLocale({ flag: langFlag }))) {
  process.stderr.write(
    `[veltrix-radio] unsupported --lang "${langFlag}", supported: ${localeOrder.join('|')}, fell back to "${locale}"\n`,
  );
}

function effectiveStations(): Station[] {
  return mergeWithCustom(cfg.customStations);
}

function printList(): void {
  for (const s of effectiveStations()) {
    const name = s.custom?.name ?? m.stations[s.key]?.name ?? s.key;
    const desc = s.custom?.desc ?? m.stations[s.key]?.desc ?? '';
    const mark = s.custom ? '*' : ' '; // 自定义频道前缀 *
    process.stdout.write(
      `${mark} ${padEndVisual(s.key, 14)} ${padEndVisual(name, 34)} ${padEndVisual(s.genre, 11)} ${desc}\n`,
    );
  }
}

function printHelp(): void {
  const lines = [
    m.cli.helpHeader,
    '',
    m.cli.usageTitle,
    ...m.cli.usageLines,
    '',
    m.cli.keysTitle,
    ...m.cli.keysLines,
    '',
    m.cli.stationsTitle,
  ];
  for (const l of lines) process.stdout.write(l + '\n');
  printList();
}

// --- 自定义频道 add / remove ---

// 解析后续 --flag value 形式参数
function parseFlags(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a || !a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = args[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      flags[key] = next;
      i++;
    }
  }
  return flags;
}

function cmdAdd(args: string[]): never {
  const key = args[1];
  const url = args[2];
  if (!key || !url) {
    process.stderr.write('Usage: vradio add <key> <url> [--name N] [--genre G] [--desc D]\n');
    process.exit(1);
  }
  if (!/^[a-z0-9_-]+$/i.test(key)) {
    process.stderr.write(`invalid key "${key}" — allowed chars: a-z, 0-9, dash, underscore\n`);
    process.exit(1);
  }
  if (findStation(key)) {
    process.stderr.write(`key "${key}" conflicts with built-in station\n`);
    process.exit(1);
  }
  const customs = cfg.customStations ?? [];
  if (customs.find((c) => c.key === key)) {
    process.stderr.write(`custom station "${key}" already exists (use \`vradio remove ${key}\` first)\n`);
    process.exit(1);
  }
  const flags = parseFlags(args.slice(3));
  const newStation: ConfigCustomStation = {
    key,
    name: flags.name ?? key,
    url,
    ...(flags.genre ? { genre: flags.genre } : {}),
    ...(flags.desc ? { desc: flags.desc } : {}),
  };
  customs.push(newStation);
  updateConfig({ customStations: customs });
  process.stdout.write(`+ added: ${key} → ${url}\n`);
  process.stdout.write(`  name:  ${newStation.name}\n`);
  if (newStation.genre) process.stdout.write(`  genre: ${newStation.genre}\n`);
  if (newStation.desc) process.stdout.write(`  desc:  ${newStation.desc}\n`);
  process.exit(0);
}

function cmdRemove(args: string[]): never {
  const key = args[1];
  if (!key) {
    process.stderr.write('Usage: vradio remove <key>\n');
    process.exit(1);
  }
  if (findStation(key)) {
    process.stderr.write(`cannot remove built-in station: ${key}\n`);
    process.exit(1);
  }
  const customs = cfg.customStations ?? [];
  const idx = customs.findIndex((c) => c.key === key);
  if (idx < 0) {
    process.stderr.write(`custom station not found: ${key}\n`);
    process.exit(1);
  }
  const removed = customs.splice(idx, 1)[0];
  updateConfig({ customStations: customs });
  process.stdout.write(`- removed: ${key}${removed?.name ? ` (${removed.name})` : ''}\n`);
  process.exit(0);
}

if (argv.includes('--version') || argv.includes('-v')) {
  process.stdout.write(`veltrix-radio v${version} by ${author}${lastUpdated ? ` · updated ${lastUpdated}` : ''}\n`);
  if (homepage) process.stdout.write(`${homepage}\n`);
  process.exit(0);
}

if (argv.includes('--help') || argv.includes('-h')) {
  printHelp();
  process.exit(0);
}

if (argv[0] === 'list') {
  printList();
  process.exit(0);
}

if (argv[0] === 'add') {
  cmdAdd(argv);
}

if (argv[0] === 'remove' || argv[0] === 'rm') {
  cmdRemove(argv);
}

let initialKey: string | undefined;
if (argv[0] === 'play') {
  initialKey = argv[1];
  if (!initialKey) {
    process.stderr.write(m.cli.usagePlay + '\n');
    process.exit(1);
  }
  // 校验包含 custom 频道
  if (!effectiveStations().find((s) => s.key === initialKey)) {
    process.stderr.write(m.cli.unknownStation(initialKey) + '\n');
    process.exit(2);
  }
}

const initialTheme = cfg.theme ?? 'default';
const { waitUntilExit } = render(<App initialStationKey={initialKey} initialLocale={locale} initialTheme={initialTheme} />);
waitUntilExit().catch(() => { /* render exits cleanly via useApp().exit() */ });
