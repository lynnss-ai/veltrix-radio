// 全 UI 内容区宽度(不含边框/padding)。所有顶级行 — banner by-line / track marquee / waveform /
// 频道行 — 都对齐到这个宽度,避免每个组件凭手感各取一个数,边框右侧出现锯齿留白。
//
// 78 是为了让 cfonts slick 字体(banner 78 cells 宽)能完整居中不折行;
// 同时 keysHint 在最长 CJK 语言下也宽裕(zh ~75 cells)。
// BOX_WIDTH=82,比标准 80 列终端略宽 2 cells — 现代终端默认基本都 ≥ 100 列,可接受。
export const CONTENT_WIDTH = 78;

// 外层 Box 总宽 = 内容 + 左右 padding(1+1) + 左右边框(1+1)
export const BOX_WIDTH = CONTENT_WIDTH + 4;
