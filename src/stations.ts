// 频道元数据 — 全部为公开免费 stream,无需注册、无广告。
// 名称/描述按语言走 i18n.stations[key],这里只放跨语言不变的字段。
// SomaFM stream URL 格式: https://ice1.somafm.com/<channel-id>-128-mp3
// 改动前可拉 https://somafm.com/channels.json 验证 channel-id

export interface Station {
  key: string;
  genre: string;
  url: string;
  // 自定义频道附带的元数据(name/desc 跨语言通用);内置频道不带,走 i18n.stations[key]
  custom?: { name: string; desc?: string };
}

export const stations: Station[] = [
  // === SomaFM 已收录 (18) ===
  { key: 'groove',         genre: 'chill',       url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
  { key: 'drone',          genre: 'ambient',     url: 'https://ice1.somafm.com/dronezone-128-mp3' },
  { key: 'deepspace',      genre: 'ambient',     url: 'https://ice1.somafm.com/deepspaceone-128-mp3' },
  { key: 'lush',           genre: 'electronic',  url: 'https://ice1.somafm.com/lush-128-mp3' },
  { key: 'fluid',          genre: 'electronic',  url: 'https://ice1.somafm.com/fluid-128-mp3' },
  { key: 'defcon',         genre: 'tech',        url: 'https://ice1.somafm.com/defcon-128-mp3' },
  { key: 'beatblender',    genre: 'electronic',  url: 'https://ice1.somafm.com/beatblender-128-mp3' },
  { key: 'sonicuni',       genre: 'eclectic',    url: 'https://ice1.somafm.com/sonicuniverse-128-mp3' },
  { key: 'indiepop',       genre: 'indie',       url: 'https://ice1.somafm.com/indiepop-128-mp3' },
  { key: 'u80s',           genre: 'retro',       url: 'https://ice1.somafm.com/u80s-128-mp3' },
  { key: 'secretagent',    genre: 'lounge',      url: 'https://ice1.somafm.com/secretagent-128-mp3' },
  { key: 'seventies',      genre: 'rock',        url: 'https://ice1.somafm.com/seventies-128-mp3' },
  { key: 'bootliquor',     genre: 'country',     url: 'https://ice1.somafm.com/bootliquor-128-mp3' },
  { key: 'folkfwd',        genre: 'folk',        url: 'https://ice1.somafm.com/folkfwd-128-mp3' },
  { key: 'thistle',        genre: 'folk',        url: 'https://ice1.somafm.com/thistle-128-mp3' },
  { key: 'metal',          genre: 'metal',       url: 'https://ice1.somafm.com/metal-128-mp3' },
  { key: 'reggae',         genre: 'reggae',      url: 'https://ice1.somafm.com/reggae-128-mp3' },
  { key: 'bossa',          genre: 'world',       url: 'https://ice1.somafm.com/bossa-128-mp3' },
  // === SomaFM 新加 (27)— 来自官方 channels.json ===
  { key: 'poptron',        genre: 'alternative', url: 'https://ice1.somafm.com/poptron-128-mp3' },
  { key: '7soul',          genre: 'oldies',      url: 'https://ice1.somafm.com/7soul-128-mp3' },
  { key: 'doomed',         genre: 'ambient',     url: 'https://ice1.somafm.com/doomed-128-mp3' },
  { key: 'thetrip',        genre: 'electronic',  url: 'https://ice1.somafm.com/thetrip-128-mp3' },
  { key: 'suburbsofgoa',   genre: 'world',       url: 'https://ice1.somafm.com/suburbsofgoa-128-mp3' },
  { key: 'chillits',       genre: 'chill',       url: 'https://ice1.somafm.com/chillits-128-mp3' },
  { key: 'illstreet',      genre: 'lounge',      url: 'https://ice1.somafm.com/illstreet-128-mp3' },
  { key: 'vaporwaves',     genre: 'vaporwave',   url: 'https://ice1.somafm.com/vaporwaves-128-mp3' },
  { key: 'missioncontrol', genre: 'ambient',     url: 'https://ice1.somafm.com/missioncontrol-128-mp3' },
  { key: 'dz2',            genre: 'ambient',     url: 'https://ice1.somafm.com/dronezone2-128-mp3' },
  { key: 'cliqhop',        genre: 'electronic',  url: 'https://ice1.somafm.com/cliqhop-128-mp3' },
  { key: 'digitalis',      genre: 'electronic',  url: 'https://ice1.somafm.com/digitalis-128-mp3' },
  { key: 'dubstep',        genre: 'electronic',  url: 'https://ice1.somafm.com/dubstep-128-mp3' },
  { key: 'spacestation',   genre: 'electronic',  url: 'https://ice1.somafm.com/spacestation-128-mp3' },
  { key: 'gsclassic',      genre: 'chill',       url: 'https://ice1.somafm.com/gsclassic-128-mp3' },
  { key: 'groovesalad2',   genre: 'chill',       url: 'https://ice1.somafm.com/groovesalad2-128-mp3' },
  { key: 'covers',         genre: 'eclectic',    url: 'https://ice1.somafm.com/covers-128-mp3' },
  { key: 'brfm',           genre: 'eclectic',    url: 'https://ice1.somafm.com/brfm-128-mp3' },
  { key: 'synphaera',      genre: 'ambient',     url: 'https://ice1.somafm.com/synphaera-128-mp3' },
  { key: 'insound',        genre: 'oldies',      url: 'https://ice1.somafm.com/insound-128-mp3' },
  { key: 'sfinsf',         genre: 'spoken',      url: 'https://ice1.somafm.com/sfinsf-128-mp3' },
  { key: 'tikitime',       genre: 'world',       url: 'https://ice1.somafm.com/tikitime-128-mp3' },
  { key: 'n5md',           genre: 'electronic',  url: 'https://ice1.somafm.com/n5md-128-mp3' },
  { key: 'darkzone',       genre: 'ambient',     url: 'https://ice1.somafm.com/darkzone-128-mp3' },
  { key: 'sf1033',         genre: 'news',        url: 'https://ice1.somafm.com/sf1033-128-mp3' },
  { key: 'somalive',       genre: 'specials',    url: 'https://ice1.somafm.com/live-128-mp3' },
  { key: 'somaspecials',   genre: 'specials',    url: 'https://ice1.somafm.com/specials-128-mp3' },
  // === Radio Paradise (4) ===
  { key: 'rp',             genre: 'eclectic',    url: 'https://stream.radioparadise.com/mp3-192' },
  { key: 'rp-mellow',      genre: 'eclectic',    url: 'https://stream.radioparadise.com/mellow-192' },
  { key: 'rp-rock',        genre: 'rock',        url: 'https://stream.radioparadise.com/rock-192' },
  { key: 'rp-global',      genre: 'eclectic',    url: 'https://stream.radioparadise.com/global-192' },
  // === FIP (Radio France 旗下,公开 stream) (11) ===
  { key: 'fip',            genre: 'eclectic',    url: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
  { key: 'fip-rock',       genre: 'rock',        url: 'https://icecast.radiofrance.fr/fiprock-midfi.mp3' },
  { key: 'fip-jazz',       genre: 'jazz',        url: 'https://icecast.radiofrance.fr/fipjazz-midfi.mp3' },
  { key: 'fip-groove',     genre: 'electronic',  url: 'https://icecast.radiofrance.fr/fipgroove-midfi.mp3' },
  { key: 'fip-pop',        genre: 'pop',         url: 'https://icecast.radiofrance.fr/fippop-midfi.mp3' },
  { key: 'fip-electro',    genre: 'electronic',  url: 'https://icecast.radiofrance.fr/fipelectro-midfi.mp3' },
  { key: 'fip-world',      genre: 'world',       url: 'https://icecast.radiofrance.fr/fipworld-midfi.mp3' },
  { key: 'fip-reggae',     genre: 'reggae',      url: 'https://icecast.radiofrance.fr/fipreggae-midfi.mp3' },
  { key: 'fip-hiphop',     genre: 'hiphop',      url: 'https://icecast.radiofrance.fr/fiphiphop-midfi.mp3' },
  { key: 'fip-nouveautes', genre: 'pop',         url: 'https://icecast.radiofrance.fr/fipnouveautes-midfi.mp3' },
  { key: 'france-inter',   genre: 'news',        url: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3' },
  // === NTS Radio (London) (2) ===
  { key: 'nts1',           genre: 'eclectic',    url: 'https://stream-relay-geo.ntslive.net/stream' },
  { key: 'nts2',           genre: 'eclectic',    url: 'https://stream-relay-geo.ntslive.net/stream2' },
  // === 美国独立电台 (3) ===
  { key: 'kexp',           genre: 'indie',       url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
  { key: 'kcrw-e24',       genre: 'eclectic',    url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_e24' },
  { key: 'wfmu',           genre: 'eclectic',    url: 'https://stream0.wfmu.org/freeform-128k.mp3' },
  // === 瑞士公共电台 (3) ===
  { key: 'swiss-pop',      genre: 'pop',         url: 'http://stream.srg-ssr.ch/m/rsp/mp3_128' },
  { key: 'swiss-classic',  genre: 'classical',   url: 'http://stream.srg-ssr.ch/m/rsc_de/mp3_128' },
  { key: 'swiss-jazz',     genre: 'jazz',        url: 'http://stream.srg-ssr.ch/m/rsj/mp3_128' },
  // === 德国 Deutschlandfunk (2) ===
  { key: 'dlf',            genre: 'news',        url: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3' },
  { key: 'dlf-nova',       genre: 'news',        url: 'https://st03.sslstream.dlf.de/dlf/03/128/mp3/stream.mp3' },
  // === Listen.moe (动漫流行) (2) ===
  { key: 'listen-jpop',    genre: 'jpop',        url: 'https://listen.moe/stream' },
  { key: 'listen-kpop',    genre: 'kpop',        url: 'https://listen.moe/kpop/stream' },
];

export function findStation(key: string): Station | undefined {
  return stations.find((s) => s.key === key);
}

// config.json 里 customStations 数组的元素形状
export interface CustomStationInput {
  key: string;
  name: string;
  url: string;
  genre?: string;
  desc?: string;
}

// 合并内置 + 用户自定义。内置 key 优先,custom 撞 key 会被忽略。
export function mergeWithCustom(customs?: CustomStationInput[]): Station[] {
  const result: Station[] = [...stations];
  const known = new Set(result.map((s) => s.key));
  for (const c of customs ?? []) {
    if (known.has(c.key)) continue;
    result.push({
      key: c.key,
      genre: c.genre ?? 'eclectic',
      url: c.url,
      custom: { name: c.name, desc: c.desc },
    });
    known.add(c.key);
  }
  return result;
}
