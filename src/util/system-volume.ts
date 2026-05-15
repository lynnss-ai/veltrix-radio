// 跨平台系统音量控制器。app 滑块直接驱动 OS 混音器,这样 0 = 真静音、100 = 系统满格。
// 不支持的平台(Windows / 没有 pactl)返回 supported=false,App 端 fallback 到 mpv softvol。

import { execFileSync, spawn } from 'node:child_process';

export interface SystemVolume {
  readonly supported: boolean;
  get(): number | null;       // 同步读;不支持或失败返回 null
  set(value: number): void;   // 异步 fire-and-forget;长按 +/- 时内部 throttle,避免狂 spawn osascript
  flush(): void;              // 立即写出 pending 值。退出还原系统音量时必须调,否则 trailing timer 可能被进程退出吞掉
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

// leading + trailing throttle:首次按键立即写入(不丢失响应感),冷却窗口内的连续按键合并成一次 trailing 写入
// 解决"长按 +/- 时每次 keypress 都 spawn 一个 osascript / pactl,macOS 上 osascript 冷启 30-50ms,
// 堆叠起来音量会卡阶梯"的问题
function createThrottledSetter(rawSet: (n: number) => void, waitMs: number): { schedule: (n: number) => void; flush: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: number | null = null;
  let lastFiredAt = 0;
  return {
    schedule(value: number) {
      const now = Date.now();
      const since = now - lastFiredAt;
      if (since >= waitMs && !timer) {
        lastFiredAt = now;
        rawSet(value);
        return;
      }
      pending = value;
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        if (pending !== null) {
          lastFiredAt = Date.now();
          rawSet(pending);
          pending = null;
        }
      }, Math.max(0, waitMs - since));
    },
    flush() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (pending !== null) {
        rawSet(pending);
        pending = null;
        lastFiredAt = Date.now();
      }
    },
  };
}

const NOOP: SystemVolume = {
  supported: false,
  get: () => null,
  set: () => { /* noop */ },
  flush: () => { /* noop */ },
};

export function createSystemVolume(): SystemVolume {
  // 40ms ≈ 25Hz,长按时 keyrepeat 通常 30-40Hz,基本一一对应又能挡掉短突发
  const THROTTLE_MS = 40;
  if (process.platform === 'darwin') {
    const throttled = createThrottledSetter(
      (n) => fireAndForget('osascript', ['-e', `set volume output volume ${n}`]),
      THROTTLE_MS,
    );
    return {
      supported: true,
      get() {
        const out = syncQuery('osascript', ['-e', 'output volume of (get volume settings)']);
        const n = out ? parseInt(out, 10) : NaN;
        return Number.isFinite(n) ? n : null;
      },
      set(value: number) {
        throttled.schedule(Math.max(0, Math.min(100, Math.round(value))));
      },
      flush() { throttled.flush(); },
    };
  }
  if (process.platform === 'linux') {
    const throttled = createThrottledSetter(
      (n) => fireAndForget('pactl', ['set-sink-volume', '@DEFAULT_SINK@', `${n}%`]),
      THROTTLE_MS,
    );
    return {
      supported: true,
      get() {
        // pactl 输出形如:Volume: front-left: 32768 / 50% / -18.06 dB,...
        const out = syncQuery('pactl', ['get-sink-volume', '@DEFAULT_SINK@']);
        const m = out?.match(/(\d+)%/);
        return m && m[1] ? parseInt(m[1], 10) : null;
      },
      set(value: number) {
        throttled.schedule(Math.max(0, Math.min(100, Math.round(value))));
      },
      flush() { throttled.flush(); },
    };
  }
  return NOOP;
}
