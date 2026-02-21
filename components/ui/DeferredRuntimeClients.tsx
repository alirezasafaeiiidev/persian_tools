'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

type NullComponent = ComponentType<Record<string, never>>;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export default function DeferredRuntimeClients() {
  const [UsageTracker, setUsageTracker] = useState<NullComponent | null>(null);
  const [ServiceWorkerRegistration, setServiceWorkerRegistration] = useState<NullComponent | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;
    const idleWindow = window as IdleWindow;

    const loadRuntimeClients = async () => {
      const [usageModule, swModule] = await Promise.all([
        import('@/components/ui/UsageTracker'),
        import('@/components/ui/ServiceWorkerRegistration'),
      ]);
      if (cancelled) {
        return;
      }
      setUsageTracker(() => usageModule.default as NullComponent);
      setServiceWorkerRegistration(() => swModule.default as NullComponent);
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleId = idleWindow.requestIdleCallback(
        () => {
          void loadRuntimeClients();
        },
        { timeout: 2000 },
      );
    } else {
      timeoutId = setTimeout(() => {
        void loadRuntimeClients();
      }, 250);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      {UsageTracker ? <UsageTracker /> : null}
      {ServiceWorkerRegistration ? <ServiceWorkerRegistration /> : null}
    </>
  );
}
