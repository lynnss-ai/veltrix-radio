import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { themes, themeOrder, type ThemeName, type Theme } from '../theme/index.js';
import type { Messages } from '../i18n/index.js';
import { padEndVisual } from '../util/pad.js';

interface Props {
  current: ThemeName;
  messages: Messages;
  theme: Theme;
  onSelect: (name: ThemeName) => void;
  onCancel: () => void;
}

export default function ThemeModal({ current, messages: m, theme, onSelect, onCancel }: Props) {
  const [cursor, setCursor] = useState<number>(() => {
    const idx = themeOrder.indexOf(current);
    return idx >= 0 ? idx : 0;
  });

  useInput((_input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (key.upArrow) {
      setCursor((c) => (c - 1 + themeOrder.length) % themeOrder.length);
    } else if (key.downArrow) {
      setCursor((c) => (c + 1) % themeOrder.length);
    } else if (key.return) {
      const picked = themeOrder[cursor];
      if (picked) onSelect(picked);
    }
  });

  return (
    <Box flexDirection="column" borderStyle={theme.borderStyle} borderColor={theme.custom} paddingX={1}>
      <Text bold color={theme.custom}>{m.ui.themeModal.title}</Text>
      <Text> </Text>
      {themeOrder.map((name, i) => {
        const isCursor = i === cursor;
        const isCurrent = name === current;
        const t = themes[name];
        const cursorMark = isCursor ? '❯' : ' ';
        const currentMark = isCurrent ? '✓' : ' ';
        // 用色块预览主题(bannerColors 第一个色 + 第二个色,都是 ▓)
        const swatch1 = t.bannerColors[0] ?? 'white';
        const swatch2 = t.bannerColors[1];
        return (
          <Text key={name} color={isCursor ? theme.cursor : undefined} bold={isCursor}>
            {cursorMark} {currentMark} {padEndVisual(name, 12)}{' '}
            <Text color={swatch1}>▓▓</Text>
            {swatch2 ? <Text color={swatch2}>▓▓</Text> : <Text>{'  '}</Text>}
            {'  '}
            <Text color={theme.meta} bold={false}>{t.nativeName} — {t.description}</Text>
          </Text>
        );
      })}
      <Text> </Text>
      <Text color={theme.meta}>{m.ui.themeModal.hint}</Text>
    </Box>
  );
}
