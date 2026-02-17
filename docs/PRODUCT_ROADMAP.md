# ASDEV PersianToolbox — Product & Engineering Roadmap (فازبندی)

> نقشه راه مرحله‌ای (بدون زمان‌بندی) برای رشد فنی/محصولی/SEO/مونتایزیشن، بر اساس گیت‌ها و خروجی‌های قابل تحویل.

---

## 0) Principles (اصول)

- **Local‑First** و **No External Runtime Dependency** اصل بنیادین است.
- ابزارهای عمومی (Free‑Core) رایگان می‌مانند.
- درآمدزایی فقط با ارزش افزوده‌ی واقعی (کیفیت/Batch/حجم/خروجی حرفه‌ای) و با **لایسنس آفلاین** ترجیحاً.

---

## 1) Outcome Metrics (بدون عددگذاری زمانی)

این‌ها “شاخص‌ها” هستند نه KPI عددی؛ برای تصمیم‌گیری فازها استفاده شوند:

- کاهش نرخ شکست ابزارهای سنگین (PDF/Image) روی موبایل
- افزایش completion rate در flows ابزارها (Select → Configure → Process → Output)
- بهبود کیفیت خروجی در ابزارهای کلیدی (خصوصاً PDF compress/convert)
- رشد ارگانیک از طریق صفحات ابزار/دسته‌ها/راهنماها
- آمادگی درآمدزایی بدون degrade تجربه رایگان

---

## 2) Phase 1 — Hardening & Reliability Baseline

### Goal

محکم‌کردن پایه‌های امنیت، کیفیت، و تجربه ابزارها قبل از رشد شدید.

### Deliverables

1. **CSP + Security Headers واقعی**
   - enforce در production
   - تست دستی + چک در DevTools
2. **Unified Error System**
   - ToolError contract
   - ErrorBoundary و mapping پیام‌های فارسی
3. **Guardrails برای فایل‌های سنگین**
   - پیش از پردازش: هشدار سایز/نوع فایل
   - پیشنهاد Lite/Accurate
4. **Registry Modularization**
   - registry per category + aggregator
5. **Quality Gates**
   - lint/test/build gates قفل‌شده
   - جلوگیری از third‑party fetch در کلاینت (گیت CI)

### Definition of Done

- CSP فعال و هیچ ابزار کلیدی را نمی‌شکند
- خطاها استاندارد شده و UX راه‌حل ارائه می‌دهد
- ابزارهای PDF/Image در موبایل با فایل‌های متداول “بدون فریز” تجربه قابل قبول دارند (با guardrail)

### Risks

- CSP سخت‌گیرانه ممکن است build/inline styles را بشکند → نیاز به nonce/adjustments

---

## 3) Phase 2 — SEO Systemization & Content Engine

### Goal

ساخت موتور رشد ارگانیک با schema + content cluster.

### Deliverables

1. **Schema**: WebApplication/SoftwareApplication + FAQPage + BreadcrumbList
2. **Tool Landing Template**
   - الگوی ثابت محتوا برای هر ابزار (intro, steps, FAQ, related)
3. **Guide Pages (Content Cluster)**
   - راهنماهای عمیق برای intentهای پرتکرار:
     - کم‌حجم کردن PDF اسکن‌شده
     - تبدیل PDF فارسی به Word
     - ادغام/تقسیم PDF برای امور اداری
4. **Internal Linking System**
   - related tools داده‌محور و cross‑category
5. **OG Images**
   - OG اختصاصی برای ابزارهای کلیدی

### Definition of Done

- ابزارها در تست structured data بدون خطا هستند
- هر دسته حداقل یک guide page عمیق دارد که به ابزارها لینک می‌دهد
- snippet صفحات ابزار (FAQ/Schema) در SERP آماده رقابت است

### Risks

- تولید محتوای کم‌کیفیت اثر منفی دارد → استاندارد editorial لازم است

---

## 4) Phase 3 — Core Tools Quality Upgrade

### Goal

ارتقای کیفیت خروجی ابزارهای کلیدی بازار ایران (PDF/Image/Finance).

### Deliverables

1. **PDF Compression (Realistic Upgrade)**
   - تشخیص نوع PDF (text vs scanned)
   - پروفایل‌های خروجی + توضیح “چرا کم نشد”
2. **Batch Processing (Pro‑ready)**
   - چندفایل/چندعملیات با صف پردازش
3. **Finance/HR Accuracy & Trust**
   - نسخه‌بندی داده قوانین
   - نمایش “آخرین به‌روزرسانی داده”
   - خروجی‌های حرفه‌ای (CSV/PDF)

### Definition of Done

- ابزارهای کلیدی کیفیت بازار می‌گیرند و در نمونه‌های واقعی خروجی قابل ارائه هستند
- برای هر ابزار کلیدی benchmark داخلی (کیفیت/سرعت/حجم) تعریف شده است

### Risks

- محدودیت RAM مرورگر → محدودیت سایز + حالت Lite ضروری است

---

## 5) Phase 4 — Monetization Enablement (Local‑First Compatible)

### Goal

فعال‌سازی درآمدزایی بدون نقض فلسفه پروژه و بدون خراب‌کردن تجربه رایگان.

### Deliverables

1. **Offline License System**
   - توکن/کلید امضاشده
   - validate آفلاین
2. **Feature Gating**
   - تعریف دقیق: چه چیزی رایگان/پولی است
3. **Billing UX (Online‑Required)**
   - فقط مسیر پرداخت/Sync آنلاین
4. **Telemetry حداقلی و امن**
   - بدون track invasive
   - صرفاً برای بهبود تجربه (اختیاری و شفاف)

### Definition of Done

- کاربر پس از خرید، بدون اتصال دائمی به اینترنت، پرو را نگه می‌دارد
- گیت‌ها قابل پیش‌بینی و شفاف‌اند
- تجربه رایگان degrade نشده است

### Risks

- پیچیدگی licensing و پشتیبانی → باید ساده و robust طراحی شود

---

## 6) Phase 5 — Specialized Pro Tools Expansion

### Goal

افزودن ابزارهای پولی تخصصی با تقاضای بالا و رقابت کمتر در ایران.

### Candidate Tools (Prioritized Buckets)

**A) High Demand / High Value**

- OCR فارسی (Basic → Pro Batch)
- PDF Compression حرفه‌ای (پروفایل‌های متعدد، batch)

**B) B2B Money**

- HR/Salary Suite (گزارش‌ها، سناریوهای بیمه/مالیات، خروجی‌های قابل ارائه)

**C) Long‑term Bets**

- PDF↔Word با تمرکز روی فارسی (پرریسک، مرحله‌ای و محدود شروع شود)

### Definition of Done

- برای هر ابزار Pro: value proof واضح (قبل/بعد، مثال واقعی، خروجی استاندارد)
- onboarding و UX کامل (wizard + presets)
- گیت‌های Pro دقیق و قابل دفاع

### Risks

- OCR و PDF→Word پیچیده و پرهزینه‌اند → باید MVP محدود + فیدبک‌محور باشد

---

## 7) Issue Templates (Issue‑Ready)

### Template

- **Title**
- **Context/Problem**
- **Scope**
- **Acceptance Criteria**
- **Out of Scope**
- **Risk**
- **Test Plan**

### Example Issue: Enable CSP in Production

- Context: CSP تعریف شده اما enforce نشده
- Acceptance Criteria:
  - CSP header روی صفحات ابزار وجود دارد
  - PDF tools (worker + fonts) کار می‌کنند
  - هیچ third‑party origin مجاز نیست
- Test Plan:
  - بررسی response headers در DevTools
  - اجرای ابزار PDF merge و watermark
  - تست offline بعد از یک بار load

---
