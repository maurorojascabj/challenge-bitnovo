// Generic, typed WebSocket client with exponential-backoff reconnect

export type WsLifecycleState = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

type MessageListener<T> = (event: T) => void;
type StateListener = (state: WsLifecycleState) => void;

interface WebSocketClientOptions {
  maxRetries?: number;
  baseDelay?: number;  // ms
  maxDelay?: number;   // ms
}

export class WebSocketClient<TEvent = unknown> {
  private ws: WebSocket | null = null;
  private url: string = '';
  private headers: Record<string, string> = {};
  private state: WsLifecycleState = 'idle';
  private retries: number = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private closed: boolean = false;

  private messageListeners: Set<MessageListener<TEvent>> = new Set();
  private stateListeners: Set<StateListener> = new Set();

  private readonly maxRetries: number;
  private readonly baseDelay: number;
  private readonly maxDelay: number;

  constructor(options: WebSocketClientOptions = {}) {
    this.maxRetries = options.maxRetries ?? 5;
    this.baseDelay = options.baseDelay ?? 1_000;
    this.maxDelay = options.maxDelay ?? 30_000;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  connect(url: string, headers: Record<string, string> = {}): void {
    this.url = url;
    this.headers = headers;
    this.closed = false;
    this.retries = 0;
    this.open();
  }

  disconnect(): void {
    this.closed = true;
    this.clearRetryTimer();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }
    this.setState('closed');
  }

  onMessage(listener: MessageListener<TEvent>): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  getState(): WsLifecycleState {
    return this.state;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private open(): void {
    if (this.closed) return;
    this.setState('connecting');

    // React Native WebSocket doesn't support custom headers in constructor,
    // so we append the deviceId as a query param if needed.
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      this.retries = 0;
      this.setState('open');
    };

    ws.onmessage = (evt: MessageEvent) => {
      try {
        const parsed: TEvent = JSON.parse(evt.data as string);
        this.messageListeners.forEach((l) => l(parsed));
      } catch {
        // Ignore non-JSON frames
      }
    };

    ws.onerror = () => {
      this.setState('error');
    };

    ws.onclose = (evt: CloseEvent) => {
      this.ws = null;
      if (this.closed || evt.code === 1000) {
        this.setState('closed');
        return;
      }
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.closed || this.retries >= this.maxRetries) {
      this.setState('closed');
      return;
    }
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.retries),
      this.maxDelay
    );
    this.retries += 1;
    this.retryTimer = setTimeout(() => this.open(), delay);
  }

  private clearRetryTimer(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private setState(state: WsLifecycleState): void {
    this.state = state;
    this.stateListeners.forEach((l) => l(state));
  }
}
