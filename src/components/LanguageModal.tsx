import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { localeOrder, messages as allMessages } from '../i18n/index.js';
import type { LocaleCode, Messages } from '../i18n/index.js';
import type { Theme } from '../theme/index.js';
import { padEndVisual } from '../util/pad.js';

interface Props {
  current: LocaleCode;
  messages: Messages;
  theme: Theme;
  onSelect: (code: LocaleCode) => void;
  onCancel: () => void;
}

export default function LanguageModal({ current, messages: m, theme, onSelect, onCancel }: Props) {
  const [cursor, setCursor] = useState<number>(() => {
    const idx = localeOrder.indexOf(current);
    return idx >= 0 ? idx : 0;
  });

  useInput((_input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (key.upArrow) {
      setCursor((c) => (c - 1 + localeOrder.length) % localeOrder.length);
    } else if (key.downArrow) {
      setCursor((c) => (c + 1) % localeOrder.length);
    } else if (key.return) {
      const picked = localeOrder[cursor];
      if (picked) onSelect(picked);
    }
  });

  return (
    <Box flexDirection="column" borderStyle={theme.borderStyle} borderColor={theme.custom} paddingX={1}>
      <Text bold color={theme.custom}>{m.ui.languageModal.title}</Text>
      <Text> </Text>
      {localeOrder.map((code, i) => {
        const isCursor = i === cursor;
        const isCurrent = code === current;
        const meta = allMessages[code].meta;
        const cursorMark = isCursor ? '❯' : ' ';
        const currentMark = isCurrent ? '✓' : ' ';
        return (
          <Text key={code} color={isCursor ? theme.cursor : undefined} bold={isCursor}>
            {cursorMark} {currentMark} {padEndVisual(code, 4)} {padEndVisual(meta.nativeName, 14)} <Text color={theme.meta} bold={false}>({meta.englishName})</Text>
          </Text>
        );
      })}
      <Text> </Text>
      <Text color={theme.meta}>{m.ui.languageModal.hint}</Text>
    </Box>
  );
}
