// 频道元数据 — 全部为公开免费 stream,无需注册、无广告。
// 名称/描述按语言走 i18n.stations[key],这里只放跨语言不变的字段。
// 音质策略(2026-05 起):优先各台官方提供的最高码率源。
//   SomaFM   → 官方 .pls(highest,256/320k MP3),mpv 自动解析播放列表
//   Radio Paradise → FLAC 无损(Ogg 封装)
//   FIP/Radio France → hifi.aac(192k AAC,优于旧 midfi 128k MP3)
// SomaFM 改动前可拉 https://somafm.com/channels.json 取 highest playlist 验证

export interface Station {
  key: string;
  genre: string;
  url: string;
  // 自定义频道附带的元数据(name/desc 跨语言通用);内置频道不带,走 i18n.stations[key]
  custom?: { name: string; desc?: string };
}

export const stations: Station[] = [
  // === SomaFM 已收录 (18) — highest .pls(256/320k)===
  { key: 'groove',         genre: 'chill',       url: 'https://api.somafm.com/groovesalad256.pls' },
  { key: 'drone',          genre: 'ambient',     url: 'https://api.somafm.com/dronezone256.pls' },
  { key: 'deepspace',      genre: 'ambient',     url: 'https://api.somafm.com/deepspaceone.pls' },
  { key: 'lush',           genre: 'electronic',  url: 'https://api.somafm.com/lush.pls' },
  { key: 'fluid',          genre: 'electronic',  url: 'https://api.somafm.com/fluid.pls' },
  { key: 'defcon',         genre: 'tech',        url: 'https://api.somafm.com/defcon256.pls' },
  { key: 'beatblender',    genre: 'electronic',  url: 'https://api.somafm.com/beatblender.pls' },
  { key: 'sonicuni',       genre: 'eclectic',    url: 'https://api.somafm.com/sonicuniverse256.pls' },
  { key: 'indiepop',       genre: 'indie',       url: 'https://api.somafm.com/indiepop.pls' },
  { key: 'u80s',           genre: 'retro',       url: 'https://api.somafm.com/u80s256.pls' },
  { key: 'secretagent',    genre: 'lounge',      url: 'https://api.somafm.com/secretagent.pls' },
  { key: 'seventies',      genre: 'rock',        url: 'https://api.somafm.com/seventies320.pls' },
  { key: 'bootliquor',     genre: 'country',     url: 'https://api.somafm.com/bootliquor320.pls' },
  { key: 'folkfwd',        genre: 'folk',        url: 'https://api.somafm.com/folkfwd.pls' },
  { key: 'thistle',        genre: 'folk',        url: 'https://api.somafm.com/thistle.pls' },
  { key: 'metal',          genre: 'metal',       url: 'https://api.somafm.com/metal.pls' },
  { key: 'reggae',         genre: 'reggae',      url: 'https://api.somafm.com/reggae256.pls' },
  { key: 'bossa',          genre: 'world',       url: 'https://api.somafm.com/bossa256.pls' },
  // === SomaFM 新加 (27)===
  { key: 'poptron',        genre: 'alternative', url: 'https://api.somafm.com/poptron.pls' },
  { key: '7soul',          genre: 'oldies',      url: 'https://api.somafm.com/7soul.pls' },
  { key: 'doomed',         genre: 'ambient',     url: 'https://api.somafm.com/doomed256.pls' },
  { key: 'thetrip',        genre: 'electronic',  url: 'https://api.somafm.com/thetrip.pls' },
  { key: 'suburbsofgoa',   genre: 'world',       url: 'https://api.somafm.com/suburbsofgoa.pls' },
  { key: 'chillits',       genre: 'chill',       url: 'https://api.somafm.com/chillits256.pls' },
  { key: 'illstreet',      genre: 'lounge',      url: 'https://api.somafm.com/illstreet.pls' },
  { key: 'vaporwaves',     genre: 'vaporwave',   url: 'https://api.somafm.com/vaporwaves.pls' },
  { key: 'missioncontrol', genre: 'ambient',     url: 'https://api.somafm.com/missioncontrol.pls' },
  { key: 'dz2',            genre: 'ambient',     url: 'https://api.somafm.com/dz2.pls' },
  { key: 'cliqhop',        genre: 'electronic',  url: 'https://api.somafm.com/cliqhop256.pls' },
  { key: 'digitalis',      genre: 'electronic',  url: 'https://api.somafm.com/digitalis256.pls' },
  { key: 'dubstep',        genre: 'electronic',  url: 'https://api.somafm.com/dubstep256.pls' },
  { key: 'spacestation',   genre: 'electronic',  url: 'https://api.somafm.com/spacestation320.pls' },
  { key: 'gsclassic',      genre: 'chill',       url: 'https://api.somafm.com/gsclassic.pls' },
  { key: 'groovesalad2',   genre: 'chill',       url: 'https://api.somafm.com/groovesalad2256.pls' },
  { key: 'covers',         genre: 'eclectic',    url: 'https://api.somafm.com/covers.pls' },
  { key: 'brfm',           genre: 'eclectic',    url: 'https://api.somafm.com/brfm.pls' },
  { key: 'synphaera',      genre: 'ambient',     url: 'https://api.somafm.com/synphaera256.pls' },
  { key: 'insound',        genre: 'oldies',      url: 'https://api.somafm.com/insound256.pls' },
  { key: 'sfinsf',         genre: 'spoken',      url: 'https://api.somafm.com/sfinsf.pls' },
  { key: 'tikitime',       genre: 'world',       url: 'https://api.somafm.com/tikitime256.pls' },
  { key: 'n5md',           genre: 'electronic',  url: 'https://api.somafm.com/n5md.pls' },
  { key: 'darkzone',       genre: 'ambient',     url: 'https://api.somafm.com/darkzone256.pls' },
  { key: 'sf1033',         genre: 'news',        url: 'https://api.somafm.com/sf1033.pls' },
  { key: 'somalive',       genre: 'specials',    url: 'https://api.somafm.com/live.pls' },
  { key: 'somaspecials',   genre: 'specials',    url: 'https://api.somafm.com/specials.pls' },
  // === Radio Paradise (4) — FLAC 无损 ===
  { key: 'rp',             genre: 'eclectic',    url: 'https://stream.radioparadise.com/flac' },
  { key: 'rp-mellow',      genre: 'eclectic',    url: 'https://stream.radioparadise.com/mellow-flac' },
  { key: 'rp-rock',        genre: 'rock',        url: 'https://stream.radioparadise.com/rock-flac' },
  { key: 'rp-global',      genre: 'eclectic',    url: 'https://stream.radioparadise.com/global-flac' },
  // === FIP (Radio France 旗下,公开 stream) (11) — hifi 192k AAC ===
  { key: 'fip',            genre: 'eclectic',    url: 'https://icecast.radiofrance.fr/fip-hifi.aac' },
  { key: 'fip-rock',       genre: 'rock',        url: 'https://icecast.radiofrance.fr/fiprock-hifi.aac' },
  { key: 'fip-jazz',       genre: 'jazz',        url: 'https://icecast.radiofrance.fr/fipjazz-hifi.aac' },
  { key: 'fip-groove',     genre: 'electronic',  url: 'https://icecast.radiofrance.fr/fipgroove-hifi.aac' },
  { key: 'fip-pop',        genre: 'pop',         url: 'https://icecast.radiofrance.fr/fippop-hifi.aac' },
  { key: 'fip-electro',    genre: 'electronic',  url: 'https://icecast.radiofrance.fr/fipelectro-hifi.aac' },
  { key: 'fip-world',      genre: 'world',       url: 'https://icecast.radiofrance.fr/fipworld-hifi.aac' },
  { key: 'fip-reggae',     genre: 'reggae',      url: 'https://icecast.radiofrance.fr/fipreggae-hifi.aac' },
  { key: 'fip-hiphop',     genre: 'hiphop',      url: 'https://icecast.radiofrance.fr/fiphiphop-hifi.aac' },
  { key: 'fip-nouveautes', genre: 'pop',         url: 'https://icecast.radiofrance.fr/fipnouveautes-hifi.aac' },
  { key: 'france-inter',   genre: 'news',        url: 'https://icecast.radiofrance.fr/franceinter-hifi.aac' },
  // === NTS Radio (London) (2) ===
  { key: 'nts1',           genre: 'eclectic',    url: 'https://stream-relay-geo.ntslive.net/stream' },
  { key: 'nts2',           genre: 'eclectic',    url: 'https://stream-relay-geo.ntslive.net/stream2' },
  // === 美国独立电台 (3) — KEXP 升 160k AAC ===
  { key: 'kexp',           genre: 'indie',       url: 'https://kexp.streamguys1.com/kexp160.aac' },
  { key: 'kcrw-e24',       genre: 'eclectic',    url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_e24' },
  { key: 'wfmu',           genre: 'eclectic',    url: 'https://stream0.wfmu.org/freeform-128k.mp3' },
  // === 瑞士公共电台 (3) ===
  { key: 'swiss-pop',      genre: 'pop',         url: 'http://stream.srg-ssr.ch/m/rsp/mp3_128' },
  { key: 'swiss-classic',  genre: 'classical',   url: 'http://stream.srg-ssr.ch/m/rsc_de/mp3_128' },
  { key: 'swiss-jazz',     genre: 'jazz',        url: 'http://stream.srg-ssr.ch/m/rsj/mp3_128' },
  // === 德国 Deutschlandfunk (2) — 源仅 128k ===
  { key: 'dlf',            genre: 'news',        url: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3' },
  { key: 'dlf-nova',       genre: 'news',        url: 'https://st03.sslstream.dlf.de/dlf/03/128/mp3/stream.mp3' },
  // === Listen.moe (动漫流行) (2) — Opus(同带宽优于 Vorbis)===
  { key: 'listen-jpop',    genre: 'jpop',        url: 'https://listen.moe/opus' },
  { key: 'listen-kpop',    genre: 'kpop',        url: 'https://listen.moe/kpop/opus' },
  // === 香港 RTHK 港台 (6) ===
  { key: 'rthk1',          genre: 'news',        url: 'https://rthkaudio1-lh.akamaihd.net/i/radio1_1@355864/master.m3u8' },
  { key: 'rthk2',          genre: 'cpop',        url: 'https://rthkaudio2-lh.akamaihd.net/i/radio2_1@355865/master.m3u8' },
  { key: 'rthk3',          genre: 'news',        url: 'https://rthkaudio3-lh.akamaihd.net/i/radio3_1@355866/master.m3u8' },
  { key: 'rthk4',          genre: 'classical',   url: 'https://rthkaudio4-lh.akamaihd.net/i/radio4_1@355867/master.m3u8' },
  { key: 'rthk5',          genre: 'eclectic',    url: 'https://rthkaudio5-lh.akamaihd.net/i/radio5_1@355868/master.m3u8' },
  { key: 'rthk-pth',       genre: 'news',        url: 'https://rthkaudio6-lh.akamaihd.net/i/radiopth_1@355869/master.m3u8' },
  // === 台湾华语台 (9) ===
  { key: 'icrt',           genre: 'pop',         url: 'https://n27a-eu.rcs.revma.com/nkdfurztxp3vv' },
  { key: 'rti',            genre: 'news',        url: 'https://streamak0138.akamaized.net/live0138lh-mbm9/_definst_/rti3/chunklist.m3u8' },
  { key: 'bcc-news',       genre: 'news',        url: 'https://n03.rcs.revma.com/78fm9wyy2tzuv' },
  { key: 'bcc-music',      genre: 'cpop',        url: 'https://n03.rcs.revma.com/ndk05tyy2tzuv' },
  { key: 'bcc-pop',        genre: 'cpop',        url: 'https://n03.rcs.revma.com/aw9uqyxy2tzuv' },
  { key: 'hit-fm',         genre: 'cpop',        url: 'http://202.39.43.67:1935/live/RA000036/chunklist.m3u8' },
  { key: 'pbs-tw',         genre: 'news',        url: 'http://stream.pbs.gov.tw:1935/live/TPS/playlist.m3u8' },
  { key: 'ufo-tw',         genre: 'eclectic',    url: 'https://n10.rcs.revma.com/em90w4aeewzuv' },
  { key: 'news98',         genre: 'news',        url: 'https://n17a-eu.rcs.revma.com/pntx1639ntzuv' },
  // === 马来西亚华语台 (5) ===
  { key: '988fm',          genre: 'cpop',        url: 'https://28103.live.streamtheworld.com/988_FMAAC.aac' },
  { key: 'ai-fm',          genre: 'cpop',        url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/AI_FMAAC.aac' },
  { key: 'melody-fm',      genre: 'cpop',        url: 'https://n09.rcs.revma.com/2u1n6dtbv4uvv/9_11l86ncot7z1w02/playlist.m3u8' },
  { key: 'cityplus',       genre: 'news',        url: 'https://stream.rcs.revma.com/9ykdmcawe1bwv' },
  { key: 'eight-fm',       genre: 'cpop',        url: 'https://stream.rcs.revma.com/qp0xrd9mtd3vv' },
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
