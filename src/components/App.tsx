import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { mergeWithCustom, type Station } from '../stations.js';
import { MpvPlayer, type PlaybackState } from '../player.js';
import { getMessages } from '../i18n/index.js';
import type { LocaleCode } from '../i18n/index.js';
import { readConfig, updateConfig } from '../config.js';
import { getTheme, type ThemeName } from '../theme/index.js';
import StationList from './StationList.js';
import NowPlaying from './NowPlaying.js';
import LanguageModal from './LanguageModal.js';
import ThemeModal from './ThemeModal.js';

const PAGE_SIZE = 16;

interface Props {
  initialStationKey?: string;
  initialLocale: LocaleCode;
  initialTheme: ThemeName;
}

export default function App({ initialStationKey, initialLocale, initialTheme }: Props) {
  const { exit } = useApp();
  const playerRef = useRef<MpvPlayer | null>(null);

  const [locale, setLocale] = useState<LocaleCode>(initialLocale);
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  const theme = getTheme(themeName);

  const [showLangModal, setShowLangModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stations] = useState<Station[]>(() => mergeWithCustom(readConfig().customStations));

  const [cursor, setCursor] = useState<number>(() => {
    if (!initialStationKey) return 0;
    const idx = stations.findIndex((s) => s.key === initialStationKey);
    return idx >= 0 ? idx : 0;
  });
  const [current, setCurrent] = useState<Station | null>(null);
  const [state, setState] = useState<PlaybackState>('idle');
  const [title, setTitle] = useState<string>('');
  const [volume, setVolume] = useState<number>(70);
  const [error, setError] = useState<string>('');

  // levelRef 持有最新 audio RMS [0, 1] — 用 ref 而非 state 避免 mpv 高频推送触发 re-render
  const levelRef = useRef(0);
  const getLevel = useCallback(() => levelRef.current, []);

  const m = getMessages(locale);

  // 搜索过滤 — 匹配 key/name/desc/genre,大小写不敏感
  const filteredStations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return stations;
    return stations.filter((s) => {
      const tx = m.stations[s.key];
      const name = (s.custom?.name ?? tx?.name ?? s.key).toLowerCase();
      const desc = (s.custom?.desc ?? tx?.desc ?? '').toLowerCase();
      return s.key.toLowerCase().includes(q)
        || name.includes(q)
        || desc.includes(q)
        || s.genre.toLowerCase().includes(q);
    });
  }, [stations, searchQuery, m]);

  // cursor 是 filteredStations 索引(搜索时跟当前可见列表对齐)
  const safeCursor = filteredStations.length === 0
    ? 0
    : Math.max(0, Math.min(cursor, filteredStations.length - 1));

  const totalPages = Math.max(1, Math.ceil(filteredStations.length / PAGE_SIZE));
  const currentPage = Math.floor(safeCursor / PAGE_SIZE);
  const pageStart = currentPage * PAGE_SIZE;
  const pageStations = useMemo(
    () => filteredStations.slice(pageStart, pageStart + PAGE_SIZE),
    [filteredStations, pageStart],
  );
  const cursorInPage = safeCursor - pageStart;

  useEffect(() => {
    let mounted = true;
    const p = new MpvPlayer();
    playerRef.current = p;

    p.on('state', (s) => { if (mounted) setState(s); });
    p.on('metadata', (md) => { if (mounted) setTitle(md.title ?? ''); });
    p.on('volume', (v) => { if (mounted) setVolume(v); });
    p.on('level', (v) => { levelRef.current = v; });
    p.on('error', (e) => { if (mounted) setError(e.message); });
    p.on('exit', () => { if (mounted) setError(getMessages(locale).ui.errors.mpvExited); });

    p.start()
      .then(() => {
        if (!mounted) return;
        if (initialStationKey) {
          const s = stations.find((x) => x.key === initialStationKey);
          if (s) {
            setCurrent(s);
            setTitle('');
            p.play(s.url);
          }
        }
      })
      .catch((e: Error) => { if (mounted) setError(e.message); });

    return () => {
      mounted = false;
      p.stop().catch(() => { /* swallow on unmount */ });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStationKey]);

  // 主 useInput — 搜索/弹窗激活时禁用
  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      const p = playerRef.current;
      if (p) p.stop().finally(() => exit());
      else exit();
      return;
    }
    if (input === '/') { setSearchActive(true); return; }
    if (input === 'l') { setShowLangModal(true); return; }
    if (input === 't') { setShowThemeModal(true); return; }
    if (input === 'n') {
      if (filteredStations.length === 0) return;
      const next = (safeCursor + 1) % filteredStations.length;
      const s = filteredStations[next];
      if (s) {
        setCursor(next);
        setCurrent(s);
        setTitle('');
        playerRef.current?.play(s.url);
      }
      return;
    }
    if (input === 'p') {
      if (filteredStations.length === 0) return;
      const prev = (safeCursor - 1 + filteredStations.length) % filteredStations.length;
      const s = filteredStations[prev];
      if (s) {
        setCursor(prev);
        setCurrent(s);
        setTitle('');
        playerRef.current?.play(s.url);
      }
      return;
    }
    if (key.upArrow) {
      if (filteredStations.length === 0) return;
      setCursor((c) => {
        const safe = Math.max(0, Math.min(c, filteredStations.length - 1));
        return (safe - 1 + filteredStations.length) % filteredStations.length;
      });
    } else if (key.downArrow) {
      if (filteredStations.length === 0) return;
      setCursor((c) => {
        const safe = Math.max(0, Math.min(c, filteredStations.length - 1));
        return (safe + 1) % filteredStations.length;
      });
    } else if (key.leftArrow) {
      setCursor((c) => {
        const safe = filteredStations.length === 0 ? 0 : Math.max(0, Math.min(c, filteredStations.length - 1));
        const p = Math.floor(safe / PAGE_SIZE);
        return p > 0 ? (p - 1) * PAGE_SIZE : safe;
      });
    } else if (key.rightArrow) {
      setCursor((c) => {
        const safe = filteredStations.length === 0 ? 0 : Math.max(0, Math.min(c, filteredStations.length - 1));
        const p = Math.floor(safe / PAGE_SIZE);
        const tot = Math.max(1, Math.ceil(filteredStations.length / PAGE_SIZE));
        return p < tot - 1 ? (p + 1) * PAGE_SIZE : safe;
      });
    } else if (key.return || input === ' ') {
      const s = filteredStations[safeCursor];
      if (!s) return;
      if (current?.key === s.key) {
        playerRef.current?.togglePause();
      } else {
        setCurrent(s);
        setTitle('');
        playerRef.current?.play(s.url);
      }
    } else if (input === '+' || input === '=') {
      playerRef.current?.changeVolume(+5);
    } else if (input === '-' || input === '_') {
      playerRef.current?.changeVolume(-5);
    }
  }, { isActive: !showLangModal && !showThemeModal && !searchActive });

  // 搜索期间单独监听 esc 退出 — TextInput 自己不处理 esc
  useInput((_input, key) => {
    if (key.escape) {
      setSearchActive(false);
      setSearchQuery('');
      setCursor(0);
    }
  }, { isActive: searchActive });

  if (showLangModal) {
    return (
      <LanguageModal
        current={locale}
        messages={m}
        theme={theme}
        onSelect={(picked) => {
          setLocale(picked);
          setShowLangModal(false);
          try { updateConfig({ locale: picked }); } catch { /* ignore */ }
        }}
        onCancel={() => setShowLangModal(false)}
      />
    );
  }

  if (showThemeModal) {
    return (
      <ThemeModal
        current={themeName}
        messages={m}
        theme={theme}
        onSelect={(picked) => {
          setThemeName(picked);
          setShowThemeModal(false);
          try { updateConfig({ theme: picked }); } catch { /* ignore */ }
        }}
        onCancel={() => setShowThemeModal(false)}
      />
    );
  }

  return (
    <Box flexDirection="column" borderStyle={theme.borderStyle} borderColor={theme.border} paddingX={1}>
      <NowPlaying
        messages={m}
        theme={theme}
        station={current}
        state={state}
        title={title}
        volume={volume}
        error={error}
        getLevel={getLevel}
      />
      <Box marginTop={1}>
        <StationList messages={m} theme={theme} stations={pageStations} cursorIndex={cursorInPage} currentKey={current?.key} />
      </Box>
      <Box marginTop={1} flexDirection="column">
        {searchActive ? (
          <Box>
            <Text color={theme.cursor}>{m.ui.searchPrompt}</Text>
            <TextInput
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                setCursor(0);
              }}
              onSubmit={() => {
                const s = filteredStations[0];
                if (s) {
                  const idx = stations.findIndex((x) => x.key === s.key);
                  setCursor(idx >= 0 ? idx : 0);
                  setCurrent(s);
                  setTitle('');
                  playerRef.current?.play(s.url);
                }
                setSearchActive(false);
                setSearchQuery('');
              }}
            />
            <Text color={theme.meta}>  ·  {m.ui.searchHint}</Text>
          </Box>
        ) : (
          <Text color={theme.meta}>{m.ui.keysHint}</Text>
        )}
        {(totalPages > 1 || searchQuery) ? (
          <Text color={theme.meta}>
            Page {currentPage + 1}/{totalPages}  ·  {filteredStations.length}/{stations.length} stations
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}
