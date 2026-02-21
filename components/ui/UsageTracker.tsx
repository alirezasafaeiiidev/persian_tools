'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageView } from '@/shared/analytics/localUsage';
import { analytics } from '@/lib/monitoring';

export default function UsageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const run = () => {
      recordPageView(pathname);
      analytics.trackEvent('page_view');
    };

    // Keep first paint responsive on low-end devices by deferring telemetry work.
    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(run);
      return () => {
        if (typeof idleWindow.cancelIdleCallback === 'function') {
          idleWindow.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = setTimeout(run, 0);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
