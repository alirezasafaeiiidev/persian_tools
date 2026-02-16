import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Container from '@/components/ui/Container';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { buildMetadata } from '@/lib/seo';
import { getPublicSiteSettings } from '@/lib/server/siteSettings';

const baseMetadata = buildMetadata({
  title: 'ASDEV Portfolio (Temporary) - PersianToolbox',
  description:
    'صفحه موقت براي لينک نمونه کارها. اين مسير در آينده به سايت asdev-portfolio منتقل مي شود.',
  path: '/asdev-portfolio',
});

export const metadata: Metadata = {
  ...baseMetadata,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AsdevPortfolioPage() {
  const settings = await getPublicSiteSettings();

  if (settings.portfolioUrl) {
    redirect(settings.portfolioUrl);
  }

  const handle = 'alirezasafaeisystems';
  const socials = [
    { label: 'GitHub', href: `https://github.com/${handle}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/in/${handle}/` },
    { label: 'Instagram', href: `https://www.instagram.com/${handle}/` },
    { label: 'Telegram', href: `https://t.me/${handle}` },
  ];

  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10 space-y-6">
          <h1 className="text-3xl font-black text-[var(--text-primary)]">صفحه شخصی (موقت)</h1>
          <p className="text-[var(--text-secondary)] leading-7">
            این مسیر فعلا به عنوان لینک موقت برای نمونه کارها فعال است. بعدا با آماده شدن سایت
            <span className="font-semibold text-[var(--text-primary)]"> asdev-portfolio </span>
            روی همین سرور، این صفحه به مقصد نهایی منتقل می شود.
          </p>
          <section className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--surface-1)]/92 p-6 shadow-[var(--shadow-subtle)]">
            <h2 className="text-xl font-black text-[var(--text-primary)]">
              ASDEV | Alireza Safaei
            </h2>
            <p className="mt-2 text-[var(--text-secondary)] leading-7">
              Production-Grade Web Systems Engineer | Architecture • Scalability • Reliability
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                >
                  {social.label}: {handle}
                </a>
              ))}
            </div>
          </section>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/services" className="btn btn-primary btn-md px-5">
              درخواست ابزار اختصاصی
            </Link>
            <span className="text-sm font-semibold text-[var(--text-muted)]">
              برای اتصال لینک مستقیم، مقدار `PORTFOLIO_URL` را تنظیم کنید.
            </span>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
