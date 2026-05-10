import { spawn, type ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import net from 'node:net';
import { existsSync, unlinkSync } from 'node:fs';

// mpv 在 Windows 上 winget 安装后不一定加到 PATH —— 做 fallback 探测
const MPV_FALLBACK_WIN = [
  'C:\\Program Files\\MPV Player\\mpv.exe',
  'C:\\Program Files (x86)\\MPV Player\\mpv.exe',
];

const MPV_FALLBACK_DARWIN = [
  '/opt/homebrew/bin/mpv',
  '/usr/local/bin/mpv',
];

export function findMpvBinary(): string {
  const fromEnv = process.env.VELTRIX_MPV_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  if (process.platform === 'win32') {
    for (const p of MPV_FALLBACK_WIN) {
      if (existsSync(p)) return p;
    }
  } else if (process.platform === 'darwin') {
    for (const p of MPV_FALLBACK_DARWIN) {
      if (existsSync(p)) return p;
    }
  }
  // 兜底:依赖 PATH 解析,装好后重启 shell 应能拿到
  return 'mpv';
}

export interface MpvMetadata {
  title?: string;
  raw?: Record<string, string>;
}

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

// mpv softvol 上限。app 默认走系统音量(SystemVolume),mpv 这边保持不衰减;
// 当系统音量不可用(Windows / 缺 pactl)时,作为 fallback 回退到 mpv softvol
export const MAX_VOLUME = 100;

interface MpvIpcCommand {
  command: unknown[];
}

interface MpvIpcMessage {
  event?: string;
  name?: string;
  data?: unknown;
  request_id?: number;
  error?: string;
}

export interface MpvPlayerEvents {
  metadata: (md: MpvMetadata) => void;
  state: (s: PlaybackState) => void;
  volume: (v: number) => void;
  level: (level: number) => void;          // 实时音频 RMS,归一化 [0, 1]
  error: (e: Error) => void;
  exit: (code: number | null) => void;
}

export declare interface MpvPlayer {
  on<K extends keyof MpvPlayerEvents>(event: K, listener: MpvPlayerEvents[K]): this;
  emit<K extends keyof MpvPlayerEvents>(event: K, ...args: Parameters<MpvPlayerEvents[K]>): boolean;
}

export class MpvPlayer extends EventEmitter {
  private process?: ChildProcess;
  private socket?: net.Socket;
  private readonly ipcPath: string;
  private requestId = 0;
  private buffer = '';
  private connected = false;
  private state: PlaybackState = 'idle';
  private currentVolume = 70;

  constructor(options: { initialVolume?: number } = {}) {
    super();
    // pid 隔离:同时跑多个实例也不会撞 pipe 名
    this.ipcPath = process.platform === 'win32'
      ? `\\\\.\\pipe\\veltrix-radio-${process.pid}`
      : `/tmp/veltrix-radio-${process.pid}.sock`;
    if (options.initialVolume !== undefined) {
      this.currentVolume = Math.max(0, Math.min(MAX_VOLUME, options.initialVolume));
    }
  }

  async start(): Promise<void> {
    if (this.process) return;
    const mpvBin = findMpvBinary();

    // pid 复用 + 上次崩溃残留:同名 socket 文件已存在会让 mpv bind 失败后立刻退出
    if (process.platform !== 'win32' && existsSync(this.ipcPath)) {
      try { unlinkSync(this.ipcPath); } catch { /* 残留权限异常时让 mpv 报错出来 */ }
    }

    const args = [
      '--idle=yes',
      '--no-terminal',
      '--no-video',
      '--no-input-default-bindings',
      '--no-config', // 避免用户全局 mpv.conf 干扰
      `--volume=${this.currentVolume}`,
      `--input-ipc-server=${this.ipcPath}`,
    ];

    this.process = spawn(mpvBin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    this.process.on('exit', (code) => {
      this.emit('exit', code);
      this.cleanup();
    });
    this.process.on('error', (err) => this.emit('error', err));

    await this.connectWithRetry();
    // 动态加 audio filter 拿实时电平 — 失败不影响主播放,只是 Waveform 拿不到数据
    // length=0.05 给 50ms RMS 窗口;reset=1 让 metadata 是 instantaneous 值而非累积
    this.send({ command: ['af', 'add', '@aud:lavfi=[astats=metadata=1:reset=1:length=0.05]'] });
    // 订阅关键属性,获得推送式更新
    this.send({ command: ['observe_property', 1, 'metadata'] });
    this.send({ command: ['observe_property', 2, 'pause'] });
    this.send({ command: ['observe_property', 3, 'core-idle'] });
    this.send({ command: ['observe_property', 4, 'volume'] });
    this.send({ command: ['observe_property', 5, 'af-metadata/aud'] });
  }

  private async connectWithRetry(maxAttempts = 50, intervalMs = 100): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await this.tryConnect();
        return;
      } catch {
        await delay(intervalMs);
      }
    }
    throw new Error(`无法连接 mpv IPC: ${this.ipcPath} (mpv 是否启动失败?)`);
  }

  private tryConnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sock = net.createConnection(this.ipcPath);
      const onError = (err: Error) => {
        sock.removeListener('connect', onConnect);
        sock.destroy();
        reject(err);
      };
      const onConnect = () => {
        sock.removeListener('error', onError);
        this.socket = sock;
        this.connected = true;
        sock.on('data', (chunk) => this.onData(chunk));
        sock.on('close', () => { this.connected = false; });
        sock.on('error', (err) => this.emit('error', err));
        resolve();
      };
      sock.once('error', onError);
      sock.once('connect', onConnect);
    });
  }

  private onData(chunk: Buffer | string): void {
    this.buffer += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
    let nl: number;
    while ((nl = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, nl).trim();
      this.buffer = this.buffer.slice(nl + 1);
      if (!line) continue;
      try {
        this.handleMessage(JSON.parse(line) as MpvIpcMessage);
      } catch {
        // 忽略畸形 JSON
      }
    }
  }

  private handleMessage(msg: MpvIpcMessage): void {
    if (msg.event !== 'property-change') return;

    switch (msg.name) {
      case 'metadata': {
        if (!msg.data || typeof msg.data !== 'object') return;
        const md = msg.data as Record<string, string>;
        // icy-title 是 SHOUTcast/Icecast 推送的当前曲目
        const title = md['icy-title'] ?? md['title'] ?? md['Title'] ?? md['icy-name'];
        this.emit('metadata', { title, raw: md });
        break;
      }
      case 'pause': {
        // mpv --idle 启动时 pause 默认 true,observe_property 注册后会立即推送 pause:true
        // 这不是用户"暂停",而是 idle 初始状态 — 忽略,保持 idle
        if (this.state === 'idle') return;
        this.state = msg.data ? 'paused' : 'playing';
        this.emit('state', this.state);
        break;
      }
      case 'core-idle': {
        // core-idle=false 意味着真正在出声(已度过缓冲)
        if (msg.data === false && this.state !== 'paused') {
          this.state = 'playing';
          this.emit('state', this.state);
        }
        break;
      }
      case 'volume': {
        if (typeof msg.data === 'number') {
          this.currentVolume = Math.round(msg.data);
          this.emit('volume', this.currentVolume);
        }
        break;
      }
      case 'af-metadata/aud': {
        // astats 输出 metadata 包括 lavfi.astats.Overall.RMS_level (dB,负数,0=最大,-∞=静默)
        // mpv 可能返回 dict 或 string 两种形态,都处理
        const data = msg.data;
        let rmsStr: string | undefined;
        if (data && typeof data === 'object') {
          rmsStr = (data as Record<string, string>)['lavfi.astats.Overall.RMS_level'];
        } else if (typeof data === 'string') {
          const m = data.match(/lavfi\.astats\.Overall\.RMS_level=(-?[\d.]+)/);
          if (m && m[1]) rmsStr = m[1];
        }
        if (!rmsStr) break;
        const db = parseFloat(rmsStr);
        if (!Number.isFinite(db)) break;
        // 网络电台 RMS 多在 -25~-10 dB,旧 (db+60)/60 把这段挤进 [0.5, 0.85]
        // → 4 行波形里下面两行永远占满,看不出动态。改成 -30 dB 当静音,-5 dB 当满值
        // → -25 dB ≈ 0.2、-15 dB ≈ 0.6、-10 dB ≈ 0.8、-5 dB ≈ 1.0,可视范围铺满 4 行
        const normalized = Math.max(0, Math.min(1, (db + 30) / 25));
        this.emit('level', normalized);
        break;
      }
    }
  }

  private send(cmd: MpvIpcCommand): void {
    if (!this.socket || !this.connected) return;
    const payload = JSON.stringify({ ...cmd, request_id: ++this.requestId }) + '\n';
    this.socket.write(payload);
  }

  play(url: string): void {
    this.state = 'loading';
    this.emit('state', this.state);
    this.send({ command: ['loadfile', url, 'replace'] });
    this.send({ command: ['set_property', 'pause', false] });
  }

  togglePause(): void {
    this.send({ command: ['cycle', 'pause'] });
  }

  changeVolume(delta: number): void {
    const next = Math.max(0, Math.min(MAX_VOLUME, this.currentVolume + delta));
    this.currentVolume = next;
    this.send({ command: ['set_property', 'volume', next] });
  }

  getVolume(): number {
    return this.currentVolume;
  }

  getState(): PlaybackState {
    return this.state;
  }

  async stop(): Promise<void> {
    this.send({ command: ['quit'] });
    await new Promise<void>((resolve) => {
      if (!this.process) return resolve();
      const killTimer = setTimeout(() => {
        this.process?.kill('SIGKILL');
        resolve();
      }, 1500);
      this.process.once('exit', () => {
        clearTimeout(killTimer);
        resolve();
      });
    });
    this.cleanup();
  }

  private cleanup(): void {
    this.socket?.destroy();
    this.socket = undefined;
    this.process = undefined;
    this.connected = false;
    this.state = 'idle';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
