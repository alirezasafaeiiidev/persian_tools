#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const HOST = process.env.SITEMAP_CHECK_HOST ?? '127.0.0.1';
const PORT = Number(process.env.SITEMAP_CHECK_PORT ?? '3101');
const BASE_URL = `http://${HOST}:${PORT}`;
const START_TIMEOUT_MS = 120_000;
const REQUEST_TIMEOUT_MS = 20_000;
const POLL_INTERVAL_MS = 1_000;
const MAX_CONCURRENCY = 6;

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const waitForServer = async () => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < START_TIMEOUT_MS) {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/`, REQUEST_TIMEOUT_MS);
      if (response.ok) {
        return;
      }
    } catch {
      // Continue polling until ready.
    }
    await delay(POLL_INTERVAL_MS);
  }
  throw new Error(`Sitemap check server did not become ready within ${START_TIMEOUT_MS}ms`);
};

const parseSitemapLocations = (xmlBody) => {
  const matches = [...xmlBody.matchAll(/<loc>([^<]+)<\/loc>/g)];
  const routes = [];
  const seen = new Set();

  for (const match of matches) {
    const loc = match[1]?.trim();
    if (!loc) continue;
    let parsed;
    try {
      parsed = new URL(loc);
    } catch {
      continue;
    }
    const route = `${parsed.pathname}${parsed.search}` || '/';
    if (seen.has(route)) continue;
    seen.add(route);
    routes.push(route);
  }

  return routes;
};

const runWithConcurrency = async (items, worker, concurrency) => {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) return;
      await worker(item);
    }
  });
  await Promise.all(workers);
};

const runSitemapChecks = async () => {
  const sitemapResponse = await fetchWithTimeout(`${BASE_URL}/sitemap.xml`, REQUEST_TIMEOUT_MS);
  if (!sitemapResponse.ok) {
    throw new Error(`[sitemap-check] /sitemap.xml returned ${sitemapResponse.status}`);
  }

  const sitemapContentType = sitemapResponse.headers.get('content-type') ?? '';
  if (!sitemapContentType.includes('xml')) {
    throw new Error(
      `[sitemap-check] /sitemap.xml content-type expected xml, got ${sitemapContentType || 'unknown'}`,
    );
  }

  const xmlBody = await sitemapResponse.text();
  const routes = parseSitemapLocations(xmlBody);
  if (routes.length === 0) {
    throw new Error('[sitemap-check] no <loc> entries found in sitemap.xml');
  }

  const failures = [];
  await runWithConcurrency(
    routes,
    async (route) => {
      try {
        const response = await fetchWithTimeout(`${BASE_URL}${route}`, REQUEST_TIMEOUT_MS);
        if (response.status < 200 || response.status >= 400) {
          failures.push(`${route}: expected 2xx/3xx, got ${response.status}`);
        }
      } catch (error) {
        failures.push(`${route}: request failed (${String(error)})`);
      }
    },
    MAX_CONCURRENCY,
  );

  if (failures.length > 0) {
    throw new Error(`[sitemap-check] sitemap routes failed:\n- ${failures.join('\n- ')}`);
  }

  console.log(`[sitemap-check] all sitemap routes passed (${routes.length} routes)`);
};

const run = async () => {
  const nextBin = resolve(process.cwd(), 'node_modules/next/dist/bin/next');
  const child = spawn(process.execPath, [nextBin, 'start'], {
    env: {
      ...process.env,
      HOSTNAME: HOST,
      PORT: String(PORT),
      NODE_ENV: 'production',
    },
    stdio: 'inherit',
  });

  let interrupted = false;
  const terminateChild = async () => {
    if (child.killed || child.exitCode !== null) return;
    child.kill('SIGTERM');
    await delay(1_500);
    if (child.exitCode === null) child.kill('SIGKILL');
  };

  const handleSignal = async () => {
    interrupted = true;
    await terminateChild();
    process.exit(1);
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  try {
    await waitForServer();
    await runSitemapChecks();
  } finally {
    if (!interrupted) {
      await terminateChild();
    }
  }
};

run().catch((error) => {
  console.error(String(error));
  process.exit(1);
});
