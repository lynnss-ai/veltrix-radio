// i18n 类型定义 — 所有 locale 必须实现 Messages 才能编译通过

export type LocaleCode = 'en' | 'zh' | 'ja' | 'ko' | 'vi' | 'my' | 'th';

export interface StationStrings {
  name: string;
  desc: string;
}

export interface Messages {
  ui: {
    appTitle: string;
    pickHint: string;
    station: string;
    track: string;
    state: string;
    volume: string;
    waitingMeta: string;
    bufferingHint: string;
    keysHint: string;
    stationsHeader: string;
    states: {
      idle: string;
      loading: string;
      playing: string;
      paused: string;
    };
    languageModal: {
      title: string;
      hint: string;
    };
    themeModal: {
      title: string;
      hint: string;
    };
    searchPrompt: string;
    searchHint: string;
    errors: {
      mpvExited: string;
    };
  };
  cli: {
    helpHeader: string;
    usageTitle: string;
    usageLines: string[];
    keysTitle: string;
    keysLines: string[];
    stationsTitle: string;
    usagePlay: string;
    unknownStation: (key: string) => string;
  };
  // station key → 翻译。key 必须跟 stations.ts 里的 station.key 对齐
  stations: Record<string, StationStrings>;
  meta: {
    code: LocaleCode;
    nativeName: string;
    englishName: string;
  };
}
