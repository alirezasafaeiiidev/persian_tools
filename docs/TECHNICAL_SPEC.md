# ASDEV PersianToolbox — Technical Specification (فنی)

> این سند برای قرار گرفتن در پوشه `docs/` یا Wiki پروژه طراحی شده و استانداردهای معماری، پیاده‌سازی، امنیت، Offline/PWA و SEO را تعریف می‌کند.

---

## 0) Executive Summary

ASDEV PersianToolbox یک پلتفرم ابزارهای کاربردی فارسی با فلسفه‌ی **Local‑First، Offline‑Friendly، بدون وابستگی Runtime به سرویس‌های خارجی** است. ستون فقرات فنی پروژه:

- Next.js (App Router) + TypeScript + Tailwind
- پردازش محلی با Web Worker (خصوصاً PDF/Image)
- Service Worker برای Offline/PWA و caching
- رجیستری مرکزی ابزارها (SEO‑driven IA) برای تولید صفحات ابزار/دسته‌ها/سایت‌مپ
- زیرساخت آماده برای مسیر آینده (Auth/Subscription/DB) اما Feature‑flag شده

---

## 1) Terminology

- **Local‑First**: پردازش و نگهداری داده‌ها تا جای ممکن روی دستگاه کاربر
- **No External Runtime Dependency**: در زمان اجرای اپلیکیشن نیاز به سرویس ثالث نباشد (به جز دامنه خود پروژه)
- **Offline‑Guaranteed Tool**: پس از یک‌بار لود/نصب، بدون اینترنت هم ۱۰۰٪ کار کند
- **Hybrid Tool**: هسته آفلاین؛ آپدیت/داده از دامنه خودی (same‑origin)
- **Online‑Required**: فقط برای Billing/Sync یا سرویس‌های سنگینِ hosted در دامنه خودی

---

## 2) Project Policies (قوانین پروژه)

### 2.1 Hard Rules

1. فایل‌های کاربران **نباید** به سرویس ثالث ارسال شوند.
2. هیچ ابزار Offline‑Guaranteed نباید به اینترنت وابسته باشد (به‌جز دریافت اولیه assetها).
3. هر ابزار باید:
   - ورودی‌ها/خروجی‌ها
   - محدودیت‌های سایز/کارایی
   - سناریوهای شکست (Failure modes)
   - پیام‌های خطا + مسیر Recovery
     را مشخص کند.
4. هر قابلیت Pro باید با **لایسنس آفلاین** قابل کنترل باشد (ترجیحاً).

### 2.2 Tool Tiers

هر ابزار باید یک Tier داشته باشد:

- Offline‑Guaranteed
- Hybrid
- Online‑Required

---

## 3) Architecture Overview

### 3.1 Layered Architecture

1. **Presentation**: app routes + صفحات + layout
2. **Shared UI**: components عمومی
3. **Features**: هر ابزار در `features/<tool>`
4. **Compute**: Web Workers برای پردازش سنگین
5. **Infrastructure**: registry + SEO helpers + server utilities (feature‑flag)
6. **Offline**: Service Worker + cache strategies + update flow

### 3.2 Tool Design Contract

هر ابزار باید این قرارداد را رعایت کند:

- منطق خالص در `*.logic.ts` جدا از UI
- پردازش‌های سنگین (بیشتر از ~200ms) در Web Worker
- پروتکل پیام: `requestId` + `progress/result/error`
- خروجی deterministic تا حد ممکن
- تست حداقلی برای منطق (Vitest)

---

## 4) Code Organization (ساختار کد)

### 4.1 Recommended Feature Structure

```text
features/<tool>/
  index.ts
  <tool>.ui.tsx (or components/)
  <tool>.logic.ts
  hooks/
  workers/   (if needed)
  __tests__/ (logic tests)
```

### 4.2 Registry Requirements

رجیستری ابزارها باید شامل:

- title/description/keywords
- tier
- FAQ
- related tools
- indexable flag
- lastModified (برای sitemap)

> نکته: برای جلوگیری از “God file”، رجیستری را ماژولار کنید (per‑category modules + aggregator).

---

## 5) State Management استاندارد

- ابزارهای ساده: `useState`
- ابزارهای چندمرحله‌ای (wizard): `useReducer` یا state machine سبک
- فرم‌ها: validation یکپارچه (بدون وابستگی سنگین)

---

## 6) Unified Error Handling (پیشنهاد استاندارد)

### 6.1 Error Contract

```ts
type ToolError = {
  code: string;
  message: string;
  detail?: string;
  recoverable?: boolean;
  hint?: string;
};
```

### 6.2 UX Rules

- خطای recoverable: ارائه‌ی Retry + Hint
- خطای غیر recoverable: پیشنهاد مسیر جایگزین
- اگر انتظار کاربر ممکن است mismatch شود (مثل Compress): توضیح علت + پیشنهاد راه‌حل

### 6.3 Implementation Targets

- `useToolError()`
- `ToolErrorBoundary`
- یک لایه map بین error codes و پیام‌های فارسی UX

---

## 7) Performance Guidelines

### 7.1 Worker‑First

- PDF/Image و هر پردازش CPU‑bound باید worker شود.
- UI thread نباید block شود.

### 7.2 Guardrails برای موبایل‌های ضعیف

- محدودیت/هشدار سایز فایل
- تخمین مصرف RAM
- پیشنهاد حالت سبک (Lite) و حالت دقیق (Accurate)
- Chunking/streaming اگر شدنی باشد

### 7.3 Resource Hygiene

- `URL.revokeObjectURL`
- terminate worker در unmount
- جلوگیری از نگه‌داشتن Bufferهای بزرگ در state

---

## 8) Security

### 8.1 CSP & Security Headers (الزامی)

- فعال‌سازی واقعی CSP/Headers از طریق `middleware.ts` یا `next.config headers()`
- ممنوعیت third‑party origins
- Nonce/strict‑dynamic در صورت نیاز

### 8.2 Input Safety

- Sanitization برای هر متن کاربر که در HTML قرار می‌گیرد
- Validation فایل‌ها قبل از پردازش (mime/extension/size)

### 8.3 Network Policy Gate

- گیت CI/Lint برای جلوگیری از fetch به دامنه غیرخودی (در کلاینت)

---

## 9) Offline & PWA Policy

### 9.1 Objectives

- Cache App Shell + registry + assets
- Offline fallback
- Update flow قابل فهم برای کاربر

### 9.2 Suggested Cache Strategy

- App shell: Cache First
- SEO pages: Stale‑While‑Revalidate
- Assets ابزارها (fonts/workers): Cache First + versioned
- Hybrid data: Network First با fallback cache

### 9.3 Update UX

- وقتی SW آپدیت شد:
  - پیام “نسخه جدید آماده است”
  - دکمه refresh/apply update

---

## 10) SEO Technical Requirements

### 10.1 Metadata

- canonical
- OG/Twitter
- locale fa_IR
- title/description هدفمند per tool

### 10.2 Structured Data (Schema)

برای صفحات ابزار:

- WebApplication/SoftwareApplication
- FAQPage
- BreadcrumbList

### 10.3 Internal Linking

- بلوک “ابزارهای مرتبط”
- لینک‌دهی بین دسته‌ها و guide pages

---

## 11) Testing Strategy

- Unit tests برای `*.logic.ts`
- Smoke tests برای worker protocol
- (اختیاری) e2e برای ابزارهای کلیدی (PDF merge/split/rotate)

---

## 12) Checklist — Adding a New Tool

1. اضافه‌کردن ToolEntry در registry (tier/SEO/FAQ/related)
2. ساخت route + صفحه ابزار
3. پیاده‌سازی logic + tests
4. اگر سنگین: worker + progress
5. guardrails فایل/ورودی
6. schema + SEO content
7. افزوده شدن به sitemap/topics/tools hub

---
