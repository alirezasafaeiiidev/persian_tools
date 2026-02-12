import LoanPage from '@/components/features/loan/LoanPage';
import ToolSeoContent from '@/components/seo/ToolSeoContent';
import { buildMetadata } from '@/lib/seo';
import { getToolByPathOrThrow } from '@/lib/tools-registry';
import Link from 'next/link';

const tool = getToolByPathOrThrow('/loan');

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords,
  path: tool.path,
});

export default function LoanRoute() {
  return (
    <div className="space-y-10">
      <LoanPage />
      <ToolSeoContent tool={tool} />
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">ابزارهای مرتبط مالی</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/salary"
            className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            محاسبه‌گر حقوق
          </Link>
          <Link
            href="/interest"
            className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            محاسبه‌گر سود بانکی
          </Link>
          <Link
            href="/tools"
            className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            هاب مالی
          </Link>
        </div>
      </section>
    </div>
  );
}
