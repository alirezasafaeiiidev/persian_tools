import SupportPage from '@/components/features/monetization/SupportPage';
import Container from '@/components/ui/Container';
import Footer from '@/components/ui/Footer';
import Navigation from '@/components/ui/Navigation';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'حمایت از PersianToolbox - مدل پرو محلی',
  description:
    'صفحه حمایت مالی PersianToolbox برای مدل honor-based و فعال‌سازی قابلیت‌های Pro به‌صورت محلی.',
  path: '/support',
});

export default function SupportRoute() {
  return (
    <div className="min-h-dvh flex flex-col page-shell">
      <Navigation />
      <main className="flex-1">
        <Container className="py-10 space-y-8">
          <SupportPage />
          <section className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] p-5 text-sm leading-7 text-[var(--text-secondary)]">
            فعال‌سازی Pro در V3 به‌صورت honor-based و کاملاً محلی انجام می‌شود. PersianToolbox برای
            فعال‌سازی این قابلیت به API پرداخت یا اسکریپت شخص ثالث وابسته نیست.
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
