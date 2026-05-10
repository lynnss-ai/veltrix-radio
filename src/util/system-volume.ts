// 跨平台系统音量控制器。app 滑块直接驱动 OS 混音器,这样 0 = 真静音、100 = 系统满格。
// 不支持的平台(Windows / 没有 pactl)返回 supported=false,App 端 fallback 到 mpv softvol。

import { execFileSync, spawn } from 'node:child_process';

export interface SystemVolume {
  readonly supported: boolean;
  get(): number | null;       // 同步读;不支持或失败返回 null
  set(value: number): void;   // 异步 fire-and-forget;同步执行 osascript 每次几十毫秒,会卡按键响应
}

function syncQuery(cmd: string, args: string[]): string | null {
  try {
    return execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

function fireAndForget(cmd: string, args: string[]): void {
  try {
    const p = spawn(cmd, args, { stdio: 'ignore' });
    p.on('error', () => { /* 命令不存在等异常 — 静默,设音量不该弹错 */ });
    p.unref();
  } catch { /* spawn 本身抛错也吞掉 */ }
}

const NOOP: SystemVolume = {
  supported: false,
  get: () => null,
  set: () => { /* noop */ },
};

export function createSystemVolume(): SystemVolume {
  if (process.platform === 'darwin') {
    return {
      supported: true,
      get() {
        const out = syncQuery('osascript', ['-e', 'output volume of (get volume settings)']);
        const n = out ? parseInt(out, 10) : NaN;
        return Number.isFinite(n) ? n : null;
      },
      set(value: number) {
        const n = Math.max(0, Math.min(100, Math.round(value)));
        fireAndForget('osascript', ['-e', `set volume output volume ${n}`]);
      },
    };
  }
  if (process.platform === 'linux') {
    return {
      supported: true,
      get() {
        // pactl 输出形如:Volume: front-left: 32768 / 50% / -18.06 dB,...
        const out = syncQuery('pactl', ['get-sink-volume', '@DEFAULT_SINK@']);
        const m = out?.match(/(\d+)%/);
        return m && m[1] ? parseInt(m[1], 10) : null;
      },
      set(value: number) {
        const n = Math.max(0, Math.min(100, Math.round(value)));
        fireAndForget('pactl', ['set-sink-volume', '@DEFAULT_SINK@', `${n}%`]);
      },
    };
  }
  return NOOP;
}
