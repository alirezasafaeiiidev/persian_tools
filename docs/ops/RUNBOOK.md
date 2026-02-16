# Ops Runbook (Design-Only)

این سند برای آماده سازی سرور و استقرار بدون downtime نوشته شده است. این پروژه تا زمانی که Owner به صورت صریح تاييد نکند، اجازه deploy به production ندارد.

## اهداف

- Zero-downtime deploy (reload امن، بدون قطع سرويس)
- Rollback قابل انجام در چند دقيقه
- مشاهده پذیری (logs + health + smoke)
- Local-first و حداقل وابستگی خارجی

## مسیرهای اصلی

- سرویس: `persian-tools`
- nginx: `ops/nginx/persian-tools.conf`
- systemd: `ops/systemd/persian-tools-production.service`, `ops/systemd/persian-tools-staging.service`
- deploy scripts: `ops/deploy/deploy.sh`, `ops/deploy/rollback.sh`
- env files (server): `/var/www/persian-tools/shared/env/production.env` و `/var/www/persian-tools/shared/env/staging.env`
  - template: `ops/env/production.env.example` و `ops/env/staging.env.example`
- readiness gates: `docs/deployment-readiness-gates.json` و runner: `scripts/deploy/run-readiness-gates.mjs`
- RC gates: `docs/release-candidate-checklist.json` و runner: `scripts/release/run-rc-gates.mjs`
- launch smoke: `docs/launch-day-checklist.json` و runner: `scripts/release/run-launch-smoke.mjs`

## آماده سازی سرور (یک بار)

1. Ubuntu hardening پایه و ابزارهای سیستم
2. node 20+ و pnpm (corepack)
3. nginx و certbot (TLS)
4. کاربر سرویس و مسیرها:

- shared: `/var/www/persian-tools/shared`
- releases: `/var/www/persian-tools/releases`

5. دیتابیس (اگر فعال است): postgres و دسترسی های محدود

برای bootstrap می توانید از `scripts/deploy/bootstrap-ubuntu-vps.sh` استفاده کنید (قبل از اجرا بازبینی شود).

## استقرار بدون downtime (الگو)

1. Build و gate ها:

- `pnpm ci:quick`
- `pnpm test:e2e:ci`
- `pnpm build`
- `pnpm predeploy:smoke`

2. Deploy به مسیر release جدید و تغییر symlink (یا مسیر نسخه)
3. Reload سرویس (به جای stop/start):

- در systemd: `systemctl reload` اگر پشتیبانی شود
- در غیر این صورت: `systemctl restart` با healthcheck قبل از قطع ترافیک

4. Smoke پس از deploy و ثبت گزارش:

- `pnpm release:launch:run`
- `pnpm deploy:post:report`

## Rollback

- اسکریپت: `ops/deploy/rollback.sh`
- هدف: بازگشت به release قبلی و اجرای smoke

## مانیتورینگ حداقلی

- log های systemd: `journalctl -u persian-tools-production -f`
- nginx access/error logs
- health endpoint (اگر اضافه شود): `/api/health`
- گزارش های readiness/rc/launch داخل `docs/**/reports`

## Google Verification (SEO)

1. وارد Google Search Console شوید و property دامنه `persiantoolbox.ir` را اضافه کنید.
2. روش "HTML tag" را انتخاب کنید و مقدار `content` را بردارید.
3. در فایل env سرور مقدار `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` را تنظیم کنید.
4. deploy کنید و در Search Console دکمه Verify را بزنید.

## Analytics Secret (Production-safe)

برای اینکه analytics در production هم کار کند و secret سمت مرورگر لو نرود:

1. در env سرور مقدارهای زیر را تنظیم کنید:
   - `NEXT_PUBLIC_ANALYTICS_ID` (یک شناسه عمومی)
   - `ANALYTICS_INGEST_SECRET` (یک secret تصادفی و محرمانه)
2. در nginx برای مسیر `/api/analytics` هدر `x-pt-analytics-secret` را به upstream تزریق کنید.
   - نمونه در `ops/nginx/persian-tools.conf` اضافه می‌شود (placeholder را با secret واقعی پر کنید).

## چک لیست قبل از production

- تایید Owner برای deploy
- تایید smoke واقعی (human QA) روی staging
- تطابق env ها با `env.production.example`
- آماده بودن دامنه و TLS
