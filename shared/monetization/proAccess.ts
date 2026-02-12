export type ProAccessState = {
  enabled: boolean;
  enabledAt: number;
  source: 'honor_support';
};

const STORAGE_KEY = 'persiantoolbox.pro.access.v1';
const UPDATE_EVENT = 'pro-access-updated';

function isValidState(value: unknown): value is ProAccessState {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<ProAccessState>;
  return (
    candidate.enabled === true &&
    typeof candidate.enabledAt === 'number' &&
    Number.isFinite(candidate.enabledAt) &&
    candidate.source === 'honor_support'
  );
}

export function readProAccessState(): ProAccessState | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidState(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isProEnabled(): boolean {
  return Boolean(readProAccessState()?.enabled);
}

export function enableProLocalUnlock(): ProAccessState {
  const nextState: ProAccessState = {
    enabled: true,
    enabledAt: Date.now(),
    source: 'honor_support',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }

  return nextState;
}

export function disableProLocalUnlock(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

export function onProAccessUpdate(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  window.addEventListener(UPDATE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(UPDATE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
