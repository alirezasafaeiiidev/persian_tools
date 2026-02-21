import Link from 'next/link';
import { IconHeart } from '@/shared/ui/icons';
import { BRAND, BRAND_REPOSITORY_URL } from '@/lib/brand';
import { DEFAULT_SITE_SETTINGS } from '@/lib/siteSettings';
import { getPublicSiteSettings } from '@/lib/server/siteSettings';

const quickLinks = [
  { href: '/tools', label: 'خانه' },
  { href: '/services', label: 'خدمات' },
  { href: '/case-studies', label: 'مطالعات موردی' },
  { href: '/brand', label: 'درباره برند' },
  { href: '/about', label: 'تماس' },
];

async function getFooterSettings() {
  try {
    return await getPublicSiteSettings();
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export default async function Footer() {
  const settings = await getFooterSettings();
  const currentYear = new Date().getFullYear();
  const personalUrl = settings.portfolioUrl ?? BRAND.ownerSiteUrl;
  const repositoryUrl = settings.orderUrl ?? BRAND_REPOSITORY_URL;
  const developerName = settings.developerName || BRAND.ownerName;

  return (
    <footer className="border-t border-[var(--border-light)] bg-[var(--surface-1)]/95 mt-auto">
      <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-[var(--color-primary)]">ASDEV</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {BRAND.ownerName} | مهندس سیستم‌های وب Production-Grade
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              تهران — همکاری حضوری/ریموت در سراسر ایران
            </p>
          </section>

          <nav aria-label="لینک‌های سریع" className="space-y-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">لینک‌های سریع</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">اتصال به سازنده</h3>
            <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <Link
                href={personalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--color-primary)]"
              >
                سایت شخصی
              </Link>
              <Link
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--color-primary)]"
              >
                مخزن GitHub پروژه
              </Link>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">تماس بگیرید</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              پروژه‌ای در ذهن دارید؟ بیایید روی آن کار کنیم.
            </p>
            <Link
              href={personalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md w-full justify-center"
            >
              ارسال پیام
            </Link>
          </section>
        </div>

        <div className="mt-8 border-t border-[var(--border-light)] pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-secondary)] text-center md:text-right">
            تمامی حقوق محفوظ است. {BRAND.ownerName} © {currentYear}
          </p>

          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1 text-center md:text-left flex-wrap justify-center md:justify-start">
            <span>ساخته شده توسط</span>
            <Link
              href={personalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:text-[var(--color-primary)]"
            >
              {developerName}
            </Link>
            <span>ساخته شده با</span>
            <IconHeart className="h-4 w-4 fill-[var(--color-primary)] text-[var(--color-primary)]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
