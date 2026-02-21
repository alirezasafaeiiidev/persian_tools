#!/usr/bin/env node
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((arg) => arg.trim())
    .filter(Boolean)
    .map((arg) => {
      const [key, value] = arg.split('=');
      return [key.replace(/^--/, ''), value ?? 'true'];
    }),
);

const url = args.url ?? 'https://persiantoolbox.ir';
const runs = Math.max(1, Number.parseInt(args.runs ?? '3', 10));
const maxAttempts = Math.max(runs, Number.parseInt(args.maxAttempts ?? String(runs * 2), 10));
const mode = args.mode ?? 'both';
const chromePath = args.chromePath ?? process.env['CHROME_PATH'];
const outDir = resolve(args.outDir ?? 'reports/lighthouse-avg');

const targets =
  mode === 'desktop' ? ['desktop'] : mode === 'mobile' ? ['mobile'] : ['desktop', 'mobile'];

function runCommand(cmd, commandArgs) {
  return new Promise((resolveRun) => {
    const child = spawn(cmd, commandArgs, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('close', (code) => {
      resolveRun({ code: code ?? 1, stdout, stderr });
    });
  });
}

function toSummary(audit) {
  return {
    score: Math.round((audit.categories.performance.score ?? 0) * 100),
    fcp: Math.round(audit.audits['first-contentful-paint']?.numericValue ?? 0),
    lcp: Math.round(audit.audits['largest-contentful-paint']?.numericValue ?? 0),
    tbt: Math.round(audit.audits['total-blocking-time']?.numericValue ?? 0),
    tti: Math.round(audit.audits['interactive']?.numericValue ?? 0),
    cls: Number((audit.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(4)),
    seo: Math.round((audit.categories.seo.score ?? 0) * 100),
    accessibility: Math.round((audit.categories.accessibility.score ?? 0) * 100),
    bestPractices: Math.round((audit.categories['best-practices'].score ?? 0) * 100),
  };
}

function average(items, key) {
  if (items.length === 0) return 0;
  return Math.round(items.reduce((sum, item) => sum + item[key], 0) / items.length);
}

function averageFloat(items, key) {
  if (items.length === 0) return 0;
  return Number((items.reduce((sum, item) => sum + item[key], 0) / items.length).toFixed(4));
}

async function runTarget(target) {
  const tmp = await mkdtemp(join(tmpdir(), `lh-${target}-`));
  const samples = [];
  const failures = [];
  let attempt = 0;

  try {
    while (samples.length < runs && attempt < maxAttempts) {
      attempt += 1;
      const outputPath = join(tmp, `${target}-${attempt}.json`);
      const commandArgs = [
        'dlx',
        'lighthouse',
        url,
        '--quiet',
        '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
        '--max-wait-for-load=120000',
        '--output=json',
        `--output-path=${outputPath}`,
      ];
      if (target === 'desktop') {
        commandArgs.push('--preset=desktop');
      }

      const result = await runCommand('pnpm', commandArgs);
      if (result.code !== 0) {
        failures.push({
          attempt,
          reason: result.stderr.trim().split('\n').pop() ?? `exit-${result.code}`,
        });
        continue;
      }

      try {
        const raw = JSON.parse(await readFile(outputPath, 'utf8'));
        if (raw.runtimeError?.code) {
          failures.push({ attempt, reason: raw.runtimeError.code });
          continue;
        }
        samples.push(toSummary(raw));
      } catch (error) {
        failures.push({ attempt, reason: `parse:${String(error)}` });
      }
    }
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }

  const avg = {
    score: average(samples, 'score'),
    fcp: average(samples, 'fcp'),
    lcp: average(samples, 'lcp'),
    tbt: average(samples, 'tbt'),
    tti: average(samples, 'tti'),
    cls: averageFloat(samples, 'cls'),
    seo: average(samples, 'seo'),
    accessibility: average(samples, 'accessibility'),
    bestPractices: average(samples, 'bestPractices'),
  };

  return {
    target,
    requestedRuns: runs,
    successfulRuns: samples.length,
    attempts: attempt,
    average: avg,
    samples,
    failures,
  };
}

async function main() {
  if (chromePath) {
    process.env['CHROME_PATH'] = chromePath;
  }
  await mkdir(outDir, { recursive: true });

  const report = {
    generatedAt: new Date().toISOString(),
    url,
    mode,
    runs,
    maxAttempts,
    chromePath: process.env['CHROME_PATH'] ?? null,
    results: [],
  };

  for (const target of targets) {
    // Run sequentially to keep memory and Chrome contention stable on VPS.
    const targetResult = await runTarget(target);
    report.results.push(targetResult);
  }

  const fileName = `lighthouse-average-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const fullPath = join(outDir, fileName);
  await import('node:fs/promises').then(({ writeFile }) =>
    writeFile(fullPath, JSON.stringify(report, null, 2), 'utf8'),
  );

  console.log(`[lh-avg] report: ${fullPath}`);
  for (const entry of report.results) {
    console.log(
      `[lh-avg] ${entry.target}: ${entry.successfulRuns}/${entry.requestedRuns} runs, perf(avg)=${entry.average.score}, LCP=${entry.average.lcp}ms, TBT=${entry.average.tbt}ms`,
    );
  }
}

main().catch((error) => {
  console.error(`[lh-avg] failed: ${String(error)}`);
  process.exit(1);
});
