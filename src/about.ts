// 项目元信息 — 从 package.json 抽取并归一化,供 TUI / CLI 显示
// 改作者/版本/更新时间:直接改 package.json 对应字段,不需要改这里
import pkg from '../package.json' with { type: 'json' };

interface AuthorObject {
  name?: string;
  email?: string;
  url?: string;
}

function extractAuthorName(raw: unknown): string {
  if (!raw) return '';
  if (typeof raw === 'string') {
    // npm 标准格式: "Name <email> (url)" — 只截取 name 部分,避免 email 暴露在 UI
    const m = raw.match(/^([^<(]+)/);
    return m && m[1] ? m[1].trim() : raw;
  }
  if (typeof raw === 'object') {
    return (raw as AuthorObject).name ?? '';
  }
  return '';
}

export const author: string = extractAuthorName(pkg.author);
export const version: string = pkg.version;
export const lastUpdated: string =
  typeof (pkg as Record<string, unknown>).lastUpdated === 'string'
    ? ((pkg as Record<string, unknown>).lastUpdated as string)
    : '';

export const homepage: string =
  typeof (pkg as Record<string, unknown>).homepage === 'string'
    ? ((pkg as Record<string, unknown>).homepage as string)
    : '';
