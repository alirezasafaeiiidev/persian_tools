import { test, expect, type Browser, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ colorScheme: 'light' });
test.describe.configure({ timeout: 180_000 });

function isContextRaceError(message: string): boolean {
  return (
    message.includes('Execution context was destroyed') ||
    message.includes('frame.evaluate: Test ended') ||
    message.includes('page.waitForLoadState: Test ended')
  );
}

async function analyzeA11yWithRetry(page: Page, attempts = 3) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(250);
      return await new AxeBuilder({ page }).analyze();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      const isNavigationRace = isContextRaceError(message);

      if (!isNavigationRace || attempt === attempts) {
        throw error;
      }

      if (page.isClosed()) {
        throw error;
      }

      await page.waitForTimeout(250);
    }
  }

  throw lastError;
}

async function analyzeRoute(page: Page, route: string) {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto(route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  let results: Awaited<ReturnType<AxeBuilder['analyze']>> | undefined;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      results = await analyzeA11yWithRetry(page, 2);
      break;
    } catch (error) {
      lastError = error;
      if (attempt === 3) {
        throw error;
      }

      await page.goto(route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
    }
  }

  if (!results) {
    throw lastError ?? new Error(`A11y analysis failed on ${route}`);
  }

  return results;
}

async function analyzeRouteInFreshContext(browser: Browser, route: string) {
  const context = await browser.newContext();
  try {
    const isolatedPage = await context.newPage();
    return await analyzeRoute(isolatedPage, route);
  } finally {
    await context.close();
  }
}

const routes = ['/', '/loan', '/salary', '/date-tools', '/image-tools', '/offline'];

routes.forEach((route) => {
  test(`a11y serious/critical violations: ${route}`, async ({ page, browser }) => {
    let results: Awaited<ReturnType<AxeBuilder['analyze']>>;

    try {
      results = await analyzeRoute(page, route);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!isContextRaceError(message) && !message.includes('Target page, context or browser')) {
        throw error;
      }

      results = await analyzeRouteInFreshContext(browser, route);
    }
    const serious = results.violations.filter((v) =>
      ['serious', 'critical'].includes((v.impact ?? '').toLowerCase()),
    );

    expect(serious, `Serious/critical a11y issues on ${route}`).toHaveLength(0);
  });
});
