# veltrix-radio

> Terminal-based radio player for SomaFM, Radio Paradise and more — built with Ink + mpv on Bun.

[English](#english) · [中文](#中文)

---

## English

A keyboard-driven internet radio player that runs in your terminal. Real-time audio waveform, multi-language UI, themes, search, custom stations.

### Features

- **73 free public stations** from SomaFM (45), Radio Paradise (4), FIP / Radio France (11), NTS (2), KEXP, KCRW, WFMU, Radio Swiss (3), Deutschlandfunk (2), Listen.moe (2).
- **7 languages**: English · 简体中文 · 日本語 · 한국어 · Tiếng Việt · မြန်မာ · ไทย — UI, station names and descriptions all translated.
- **Themes**: `default` (calm cyan) and `cyberpunk` (neon magenta + cyan), persisted to config.
- **Real-time waveform** driven by mpv `astats` RMS filter through JSON IPC.
- **Marquee track titles** scrolling from Icecast `icy-title` metadata.
- **Search** (`/`), pagination (16 / page), live volume bar.
- **Custom stations** via CLI `add` / `remove`.
- **Cross-platform**: Windows · macOS · Linux.

### Requirements

- [Bun](https://bun.sh) ≥ 1.0
- [mpv](https://mpv.io) — the audio backend
  - Windows: `winget install shinchiro.mpv`
  - macOS: `brew install mpv`
  - Linux: `apt install mpv` / `pacman -S mpv` / etc.

### Install

```bash
git clone https://github.com/lynnss-ai/veltrix-radio.git
cd veltrix-radio
bun install
bun start
```

### Usage

```bash
bun start                          # open the TUI
bun src/cli.tsx play groove        # open TUI and start a specific station
bun src/cli.tsx list               # list all stations
bun src/cli.tsx --lang ja          # set UI language for this run
bun src/cli.tsx --version
bun src/cli.tsx --help
```

### TUI Keys

| Key | Action |
|---|---|
| ↑ ↓ | Navigate stations (cross-page wrap) |
| ← → | Previous / next page |
| Enter / Space | Play, or toggle pause if already playing |
| n / p | Next / previous station, plays immediately |
| / | Search by key / name / description / genre |
| + / − | Volume ±5 |
| l | Open language modal |
| t | Open theme modal |
| q / Ctrl+C | Quit (cleanly stops mpv) |

### Custom Stations

```bash
bun src/cli.tsx add kexp https://kexp-mp3-128.streamguys1.com/kexp128.mp3 \
  --name "KEXP Seattle" --genre indie --desc "Independent music radio"

bun src/cli.tsx list                # custom stations are marked with *
bun src/cli.tsx remove kexp
```

Custom stations are highlighted in `theme.custom` colour in the TUI list.

### Configuration

Config file persists locale, theme and custom stations across runs:

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

- **Bun + TypeScript + Ink** — React-style TUI components.
- **mpv** spawned as a subprocess, controlled via JSON IPC over a named pipe (Windows) / Unix domain socket.
- **cfonts** renders the ASCII banner; `string-width` handles CJK column alignment.
- An `astats` audio filter is dynamically added to mpv via `af add` IPC. `lavfi.astats.Overall.RMS_level` is observed and emitted as `level` events that drive the waveform amplitude.
- Track titles come from Icecast metadata (`icy-title`) which mpv exposes through `metadata` property changes.

### Stream Attribution

Most of these streams are listener-supported. If you enjoy them, please consider donating:

- [SomaFM](https://somafm.com) · [Radio Paradise](https://radioparadise.com) · [FIP](https://www.radiofrance.fr/fip)
- [NTS Radio](https://www.nts.live) · [KEXP](https://kexp.org) · [KCRW](https://kcrw.com) · [WFMU](https://wfmu.org)
- [Radio Swiss](https://www.radioswisspop.ch) · [Deutschlandfunk](https://deutschlandfunk.de) · [Listen.moe](https://listen.moe)

### Author

Lynn — <lynnss.codeai@gmail.com> — [github.com/lynnss-ai](https://github.com/lynnss-ai)

---

## 中文

一个键盘驱动的命令行网络电台播放器。实时音频波形、多语言 UI、主题、搜索、自定义频道。

### 功能特性

- **73 个免费公共电台 stream**:SomaFM(45)、Radio Paradise(4)、FIP / Radio France(11)、NTS(2)、KEXP、KCRW、WFMU、Radio Swiss(3)、Deutschlandfunk(2)、Listen.moe(2)。
- **7 种语言**:English · 简体中文 · 日本語 · 한국어 · Tiếng Việt · မြန်မာ · ไทย — UI、电台名、描述都翻译。
- **主题系统**:`default`(平静青)和 `cyberpunk`(霓虹品红 + 青),持久化保存。
- **实时音频波形**,基于 mpv `astats` RMS filter 通过 JSON IPC 推送电平。
- **跑马灯曲名**滚动,数据来自 Icecast `icy-title` metadata。
- **搜索**(`/`)、分页(每页 16)、音量进度条。
- **自定义频道**(CLI `add` / `remove`)。
- **跨平台**:Windows · macOS · Linux。

### 依赖

- [Bun](https://bun.sh) ≥ 1.0
- [mpv](https://mpv.io) — 音频后端
  - Windows:`winget install shinchiro.mpv`
  - macOS:`brew install mpv`
  - Linux:`apt install mpv` / `pacman -S mpv` 等

### 安装

```bash
git clone https://github.com/lynnss-ai/veltrix-radio.git
cd veltrix-radio
bun install
bun start
```

### 用法

```bash
bun start                          # 打开 TUI
bun src/cli.tsx play groove        # 打开 TUI 并直接播放某频道
bun src/cli.tsx list               # 列出所有频道
bun src/cli.tsx --lang zh          # 临时切换 UI 语言
bun src/cli.tsx --version
bun src/cli.tsx --help
```

### TUI 快捷键

| 键 | 作用 |
|---|---|
| ↑ ↓ | 选择频道(跨页循环) |
| ← → | 上一页 / 下一页 |
| Enter / 空格 | 播放,如果已在播则切换暂停 |
| n / p | 下一台 / 上一台(立即播放) |
| / | 按 key / 名称 / 描述 / genre 搜索 |
| + / − | 音量 ±5 |
| l | 打开语言切换 modal |
| t | 打开主题切换 modal |
| q / Ctrl+C | 退出(干净停掉 mpv) |

### 自定义频道

```bash
bun src/cli.tsx add kexp https://kexp-mp3-128.streamguys1.com/kexp128.mp3 \
  --name "KEXP 西雅图" --genre indie --desc "独立音乐电台"

bun src/cli.tsx list                # 自定义频道前带 * 标记
bun src/cli.tsx remove kexp
```

自定义频道在 TUI 列表里用 `theme.custom` 色高亮区分。

### 配置文件

跨运行持久化保存语言、主题、自定义频道:

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

- **Bun + TypeScript + Ink** — React 风格的 TUI 组件。
- **mpv** 作为子进程播放,通过 JSON IPC(Windows named pipe / Unix domain socket)控制。
- **cfonts** 渲染 ASCII banner;**string-width** 处理 CJK 列宽对齐。
- 通过 `af add` IPC 命令动态注入 **astats** audio filter,observe `lavfi.astats.Overall.RMS_level`,emit 成 `level` 事件驱动波形振幅。
- 曲名来自 Icecast metadata(`icy-title`),由 mpv 通过 `metadata` property change 暴露。

### 电台来源致谢

所有 stream 均为**听众捐助运营**。如果你喜欢,请考虑捐助:

- [SomaFM](https://somafm.com) · [Radio Paradise](https://radioparadise.com) · [FIP](https://www.radiofrance.fr/fip)
- [NTS Radio](https://www.nts.live) · [KEXP](https://kexp.org) · [KCRW](https://kcrw.com) · [WFMU](https://wfmu.org)
- [Radio Swiss](https://www.radioswisspop.ch) · [Deutschlandfunk](https://deutschlandfunk.de) · [Listen.moe](https://listen.moe)

### 作者

Lynn — <lynnss.codeai@gmail.com> — [github.com/lynnss-ai](https://github.com/lynnss-ai)
