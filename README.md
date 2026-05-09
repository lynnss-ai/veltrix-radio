<div align="center">

<pre>
 _   _ _____ _   _____ ____ ___ __  __     ____      _    ____ ___ ___
| | | | ____| | |_   _|  _ \_ _|  \/  |   |  _ \    / \  |  _ \_ _/ _ \
| | | |  _| | |   | | | |_) | || |\/| |   | |_) |  / _ \ | | | | | | | |
| |_| | |___| |___| | |  _ <| || |  | |   |  _ <  / ___ \| |_| | | |_| |
 \___/|_____|_____|_| |_| \_\___|_|  |_|   |_| \_\/_/   \_\____/___\___/
</pre>

**A keyboard-first internet radio for your terminal.**
*Listen to 73 hand-picked free public radio streams without leaving your shell.*

[![Bun](https://img.shields.io/badge/Bun-1.3%2B-000?style=flat-square&logo=bun)](https://bun.sh)
[![mpv](https://img.shields.io/badge/audio-mpv-7d2c91?style=flat-square)](https://mpv.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Ink](https://img.shields.io/badge/Ink-React%20for%20CLIs-61DAFB?style=flat-square&logo=react&logoColor=black)](https://github.com/vadimdemedes/ink)
[![Stations](https://img.shields.io/badge/stations-73-2ea44f?style=flat-square)](#stations)
[![i18n](https://img.shields.io/badge/i18n-7%20languages-blueviolet?style=flat-square)](#)
[![GitHub](https://img.shields.io/badge/source-GitHub-181717?style=flat-square&logo=github)](https://github.com/lynnss-ai/veltrix-radio)

[**English**](#english) · [**中文**](#中文)

</div>

---

```text
┌─ veltrix-radio ─────────────────────────────────────────────────────────────┐
│                                                                             │
│      _    _   ___   _      _____   ___   ___  _   _         ___     _       │
│     \ \ / / | __| | |    |_   _| | _ \ |_ _| \ \/ /  ___  | _ \   /_\       │
│      \ V /  | _|  | |__    | |   |   /  | |   >  <  |___| |   /  / _ \      │
│       \_/   |___| |____|   |_|   |_|_\ |___| /_/\_\        |_|_\ /_/ \_\    │
│                                                                             │
│                          by Lynn · v0.1.0 · github.com/lynnss-ai/veltrix..  │
│                                                                             │
│  Station: SomaFM Groove Salad (chill)                                       │
│  Track:   Bonobo - Cirrus                                                   │
│  █▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█                                │
│  █▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█                                │
│  █▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█▆▅▃▂▁▂▃▅▆█                                │
│  ▆▅▃▂▁▂▃▅▆▆▅▃▂▁▂▃▅▆▆▅▃▂▁▂▃▅▆▆▅▃▂▁▂▃▅▆                                    │
│  ⏸ playing   Vol:  70 ███████░░░                                            │
│                                                                             │
│  STATIONS                                                                   │
│  ❯ ♪ groove        SomaFM Groove Salad         chill                        │
│      drone         SomaFM Drone Zone           ambient                      │
│      deepspace     SomaFM Deep Space One       ambient                      │
│      lush          SomaFM Lush                 electronic                   │
│      ...                                                                    │
│                                                                             │
│  ↑↓ ←→ nav   ⏎/sp play   n/p next   / find   +/− vol   l/t panel   q quit  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## English

### Why veltrix-radio?

> Spotify ads, web players that pull 200 MB of JS, electron apps that wake your fan up — none of that here.
>
> Built around **mpv** (the most respected open-source player) and **Ink** (React, but for terminals). Streams come from listener-supported broadcasters that have been doing this for 20+ years.
>
> Boots in **80 ms**, idles at **40 MB**, and looks like home if you live in a terminal.

### Features

| | |
|---|---|
| **Stations** | 73 free public streams: SomaFM (45) · Radio Paradise (4) · FIP / Radio France (11) · NTS (2) · KEXP · KCRW · WFMU · Radio Swiss (3) · Deutschlandfunk (2) · Listen.moe (2) |
| **Languages** | English · 简体中文 · 日本語 · 한국어 · Tiếng Việt · မြန်မာ · ไทย — UI, station names, descriptions, all translated |
| **Themes** | `default` (calm cyan) and `cyberpunk` (neon magenta + cyan), persisted across runs |
| **Live waveform** | mpv `astats` RMS filter sampled at 50 ms, rendered as a 4-row Unicode block waveform that flows like an oscilloscope |
| **Track titles** | Marquee scrolling from Icecast `icy-title` metadata — see what's playing in real time |
| **Search** | `/` — fuzzy filter by key, name, description, or genre |
| **Custom stations** | Add any direct stream URL via CLI; merged into the list with magenta highlight |
| **Cross-platform** | Windows · macOS · Linux |

### Quick Start

```bash
# 1. Install mpv (the audio backend)
winget install shinchiro.mpv         # Windows
brew install mpv                     # macOS
sudo apt install mpv                 # Debian / Ubuntu

# 2. Install Bun if you don't have it
curl -fsSL https://bun.sh/install | bash

# 3. Clone, install, run
git clone https://github.com/lynnss-ai/veltrix-radio.git
cd veltrix-radio
bun install
bun start
```

### CLI Usage

```bash
bun start                            # open the TUI
bun src/cli.tsx play groove          # open TUI and start a station
bun src/cli.tsx list                 # print station table
bun src/cli.tsx --lang ja            # set UI language for this run
bun src/cli.tsx --version
```

### TUI Keys

| Key | Action |
|---|---|
| `↑` `↓` | Navigate stations (cross-page wrap) |
| `←` `→` | Previous / next page (16 per page) |
| `Enter` / `Space` | Play, or toggle pause if already playing |
| `n` / `p` | Next / previous station, plays immediately |
| `/` | Search by key / name / description / genre |
| `+` / `−` | Volume ±5 |
| `l` | Open language modal |
| `t` | Open theme modal |
| `q` / `Ctrl+C` | Quit (cleanly stops mpv) |

### Custom Stations

```bash
bun src/cli.tsx add kexp https://kexp-mp3-128.streamguys1.com/kexp128.mp3 \
  --name "KEXP Seattle" --genre indie --desc "Independent music radio"

bun src/cli.tsx list                 # custom stations marked with *
bun src/cli.tsx remove kexp
```

### Configuration

Persisted to:

- Windows: `%APPDATA%\veltrix-radio\config.json`
- macOS / Linux: `~/.config/veltrix-radio/config.json`

```json
{
  "locale": "en",
  "theme": "cyberpunk",
  "customStations": [
    { "key": "kexp", "name": "KEXP Seattle", "url": "...", "genre": "indie", "desc": "..." }
  ]
}
```

### Architecture

```
+-------------------+      +------------------+      +-------------------+
|    Ink TUI (TS)   |<---->|   player.ts      |<---->|  mpv subprocess   |
|  React-style JSX  |  IPC |  EventEmitter +  | JSON |  --idle --no-     |
|  Box / Text /     |      |  named-pipe IPC  | over |  terminal --no-   |
|  useInput         |      |  + astats poll   | pipe |  video --af=...   |
+-------------------+      +------------------+      +-------------------+
        |                                                     |
        | useState / refs                                     | Icecast HTTP
        v                                                     v
+--------------------+                              +-------------------+
|  Marquee / Wave-   |                              |  Stream provider  |
|  form / Modals     |                              |  (SomaFM / RP /   |
|  i18n / Theme      |                              |   FIP / NTS / ..) |
+--------------------+                              +-------------------+
```

- **Bun + TypeScript + Ink** — React-style TUI components
- **mpv** spawned as a subprocess, controlled via JSON IPC over named pipe (Windows) / Unix socket
- **cfonts** renders the ASCII banner; **string-width** handles CJK column alignment
- An `astats` audio filter is dynamically added via `af add` IPC, `lavfi.astats.Overall.RMS_level` is observed and emitted as `level` events to drive the waveform
- Track titles arrive through Icecast `icy-title` metadata (mpv exposes them as a `metadata` property)

### Roadmap

- [ ] Track history — see the last 10 songs played
- [ ] Random / shuffle mode (`r` key)
- [ ] Favorites / starred stations (`*` key, sorted to top)
- [ ] EQ presets (rock / classical / vocal) via `mpv --af=equalizer`
- [ ] In-TUI custom station add/remove form (currently CLI-only)
- [ ] Single-binary release via `bun build --compile`
- [ ] System notification on track change (Windows toast / macOS NSUserNotification)

### Contributing

Issues and PRs welcome. Useful entry points:

| Want to | Touch this |
|---|---|
| Add a station | `src/stations.ts` + 7 translations in `src/i18n/messages.ts` |
| Add a theme | `src/theme/index.ts` (one new entry in `themes` + `themeOrder`) |
| Add a language | New `LocaleCode` in `src/i18n/types.ts`, full block in `messages.ts`, `localeOrder` |
| Tweak the waveform | `src/components/Waveform.tsx` (height, intervalMs, character set) |
| Tune mpv behaviour | `src/player.ts` (spawn args, IPC commands, event handling) |

Run checks before submitting:

```bash
bun run typecheck
```

### Stream Attribution

All streams are **listener-supported**. If you enjoy them, please consider donating to the broadcasters:

- [SomaFM](https://somafm.com) · [Radio Paradise](https://radioparadise.com) · [FIP](https://www.radiofrance.fr/fip)
- [NTS Radio](https://www.nts.live) · [KEXP](https://kexp.org) · [KCRW](https://kcrw.com) · [WFMU](https://wfmu.org)
- [Radio Swiss](https://www.radioswisspop.ch) · [Deutschlandfunk](https://deutschlandfunk.de) · [Listen.moe](https://listen.moe)

### Author

Built by **Lynn** — <lynnss.codeai@gmail.com> · [github.com/lynnss-ai](https://github.com/lynnss-ai)

If this is useful, **a star on the repo** is the best way to say thanks.

---

## 中文

### 为什么写这个

> Spotify 的广告很烦,网页播放器要拉 200 MB 的 JS,Electron 应用一开风扇就响 — 这里都没有。
>
> 围绕 **mpv**(最受尊敬的开源播放器)和 **Ink**(React,但用于终端)构建。stream 来自坚持了 20+ 年的听众捐助电台。
>
> 启动 **80 ms**,空闲 **40 MB**,如果你的家在终端里 — 它看着像家。

### 功能特性

| | |
|---|---|
| **频道** | 73 个免费公共 stream:SomaFM(45)· Radio Paradise(4)· FIP / Radio France(11)· NTS(2)· KEXP · KCRW · WFMU · Radio Swiss(3)· Deutschlandfunk(2)· Listen.moe(2) |
| **语言** | English · 简体中文 · 日本語 · 한국어 · Tiếng Việt · မြန်မာ · ไทย — UI、电台名、描述全译 |
| **主题** | `default`(平静青)和 `cyberpunk`(霓虹品红 + 青),持久化保存 |
| **实时波形** | mpv `astats` RMS filter 50ms 采样,渲染成 4 行 Unicode block 像示波器流动 |
| **曲名滚动** | 跑马灯展示 Icecast `icy-title` metadata,实时看正在播什么 |
| **搜索** | `/` — 模糊匹配 key / 名称 / 描述 / genre |
| **自定义频道** | CLI 加任意直链 stream,合并到列表里 magenta 高亮 |
| **跨平台** | Windows · macOS · Linux |

### 快速开始

```bash
# 1. 装 mpv(音频后端)
winget install shinchiro.mpv         # Windows
brew install mpv                     # macOS
sudo apt install mpv                 # Debian / Ubuntu

# 2. 装 Bun(如果还没有)
curl -fsSL https://bun.sh/install | bash

# 3. clone、装依赖、跑
git clone https://github.com/lynnss-ai/veltrix-radio.git
cd veltrix-radio
bun install
bun start
```

### CLI 用法

```bash
bun start                            # 打开 TUI
bun src/cli.tsx play groove          # 打开 TUI 并直接播某频道
bun src/cli.tsx list                 # 列出所有频道
bun src/cli.tsx --lang zh            # 临时切换 UI 语言
bun src/cli.tsx --version
```

### TUI 快捷键

| 键 | 作用 |
|---|---|
| `↑` `↓` | 选择频道(跨页循环) |
| `←` `→` | 上一页 / 下一页(每页 16) |
| `Enter` / `空格` | 播放,或者已在播则切换暂停 |
| `n` / `p` | 下一台 / 上一台,立即播放 |
| `/` | 按 key / 名称 / 描述 / genre 搜索 |
| `+` / `−` | 音量 ±5 |
| `l` | 打开语言切换 modal |
| `t` | 打开主题切换 modal |
| `q` / `Ctrl+C` | 退出(干净停掉 mpv) |

### 自定义频道

```bash
bun src/cli.tsx add kexp https://kexp-mp3-128.streamguys1.com/kexp128.mp3 \
  --name "KEXP 西雅图" --genre indie --desc "独立音乐电台"

bun src/cli.tsx list                 # 自定义频道前带 * 标记
bun src/cli.tsx remove kexp
```

### 配置文件

跨运行持久化保存:

- Windows:`%APPDATA%\veltrix-radio\config.json`
- macOS / Linux:`~/.config/veltrix-radio/config.json`

```json
{
  "locale": "zh",
  "theme": "cyberpunk",
  "customStations": [
    { "key": "kexp", "name": "KEXP 西雅图", "url": "...", "genre": "indie", "desc": "..." }
  ]
}
```

### 架构

- **Bun + TypeScript + Ink** — React 风格的 TUI 组件
- **mpv** 作为子进程播放,通过 JSON IPC(Windows named pipe / Unix domain socket)控制
- **cfonts** 渲染 ASCII banner;**string-width** 处理 CJK 列宽对齐
- 通过 `af add` IPC 命令动态注入 **astats** audio filter,observe `lavfi.astats.Overall.RMS_level` → emit `level` 事件 → 驱动波形振幅
- 曲名来自 Icecast `icy-title` metadata,mpv 通过 `metadata` property change 暴露

### 路线图

- [ ] 曲目历史 — 看最近播过的 10 首歌
- [ ] 随机 / shuffle 模式(`r` 键)
- [ ] 收藏 / 星标频道(`*` 键,排到最前)
- [ ] 均衡器预设(rock / classical / vocal)— `mpv --af=equalizer`
- [ ] TUI 内自定义频道 add / remove 表单(目前只 CLI)
- [ ] 单二进制发布(`bun build --compile`)
- [ ] 换台时系统通知(Windows toast / macOS 通知中心)

### 参与贡献

Issues 和 PR 都欢迎。常见入口:

| 想做 | 改这里 |
|---|---|
| 加电台 | `src/stations.ts` + 7 个翻译在 `src/i18n/messages.ts` |
| 加主题 | `src/theme/index.ts`(`themes` 字典 + `themeOrder` 数组各一项) |
| 加语言 | `src/i18n/types.ts` 加 `LocaleCode`,`messages.ts` 加完整 block,`localeOrder` |
| 改波形 | `src/components/Waveform.tsx`(高度、interval、字符集) |
| 调 mpv 行为 | `src/player.ts`(spawn 参数、IPC 命令、事件处理) |

提交前跑一下:

```bash
bun run typecheck
```

### 电台来源致谢

所有 stream 均为**听众捐助运营**。如果你喜欢,请考虑捐助:

- [SomaFM](https://somafm.com) · [Radio Paradise](https://radioparadise.com) · [FIP](https://www.radiofrance.fr/fip)
- [NTS Radio](https://www.nts.live) · [KEXP](https://kexp.org) · [KCRW](https://kcrw.com) · [WFMU](https://wfmu.org)
- [Radio Swiss](https://www.radioswisspop.ch) · [Deutschlandfunk](https://deutschlandfunk.de) · [Listen.moe](https://listen.moe)

### 作者

Built by **Lynn** — <lynnss.codeai@gmail.com> · [github.com/lynnss-ai](https://github.com/lynnss-ai)

如果觉得有用,**给仓库点个星** 是最好的感谢。
