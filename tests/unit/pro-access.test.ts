import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  disableProLocalUnlock,
  enableProLocalUnlock,
  isProEnabled,
  onProAccessUpdate,
  readProAccessState,
} from '@/shared/monetization/proAccess';

describe('pro access local unlock', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is disabled by default and enables with local unlock', () => {
    expect(isProEnabled()).toBe(false);
    expect(readProAccessState()).toBeNull();

    const state = enableProLocalUnlock();
    expect(state.enabled).toBe(true);
    expect(state.source).toBe('honor_support');
    expect(isProEnabled()).toBe(true);
    expect(readProAccessState()).toMatchObject({ enabled: true, source: 'honor_support' });
  });

  it('notifies listeners on updates', () => {
    const listener = vi.fn();
    const unsubscribe = onProAccessUpdate(listener);

    enableProLocalUnlock();
    expect(listener).toHaveBeenCalledTimes(1);

    disableProLocalUnlock();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });
});
