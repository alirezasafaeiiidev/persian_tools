'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '@/shared/ui/Container';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  IconPdf,
  IconImage,
  IconCalculator,
  IconMenu,
  IconX,
  IconCalendar,
  IconZap,
  IconChevronDown,
} from '@/shared/ui/icons';

const isV3NavEnabled = process.env['NEXT_PUBLIC_FEATURE_V3_NAV'] === '1';

const v2NavItems = [
  { label: 'ابزارهای PDF', href: '/pdf-tools', icon: IconPdf },
  { label: 'ابزارهای تصویر', href: '/image-tools', icon: IconImage },
  { label: 'ابزارهای مالی', href: '/tools', icon: IconCalculator },
  { label: 'ابزارهای تاریخ', href: '/date-tools', icon: IconCalendar },
  { label: 'ابزارهای متنی', href: '/text-tools', icon: IconZap },
];

const v3NavItems = [
  { label: 'همه ابزارها', href: '/tools', icon: IconCalculator },
  { label: 'موضوعات', href: '/topics', icon: IconCalendar },
  { label: 'PDF', href: '/pdf-tools', icon: IconPdf },
  { label: 'تصویر', href: '/image-tools', icon: IconImage },
];

const navItems = isV3NavEnabled ? v3NavItems : v2NavItems;

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const safePathname = pathname ?? '';
  const isActive = (href: string) => safePathname === href || safePathname.startsWith(`${href}/`);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--surface-1)]/90 backdrop-blur-xl shadow-[var(--shadow-subtle)]"
      role="banner"
    >
      <Container className="flex items-center justify-between gap-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg p-2 text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--text-inverted)] shadow-[var(--shadow-subtle)]">
            <span className="text-sm font-bold">P</span>
          </span>
          <span className="text-xl font-black">جعبه ابزار فارسی</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-[var(--motion-fast)] ${
                isActive(item.href)
                  ? 'border-[var(--color-primary)] bg-[rgb(var(--color-primary-rgb)/0.12)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--text-primary)] hover:border-[var(--border-light)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <ThemeToggle />
        </div>

        <div className="hidden lg:flex items-center">
          <Link href="/tools" className="btn btn-primary btn-md px-5">
            <IconChevronDown className="h-4 w-4 rotate-90" />
            همه ابزارها
          </Link>
        </div>

        <button
          data-testid="mobile-menu"
          aria-label={isMobileMenuOpen ? 'بستن منوی ناوبری' : 'باز کردن منوی ناوبری'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-panel"
          className="lg:hidden flex items-center gap-2 rounded-full p-2.5 text-[var(--text-primary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--surface-2)]"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
        >
          {isMobileMenuOpen ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </Container>

      <div
        id="mobile-menu-panel"
        className={`lg:hidden border-t border-[var(--border-light)] bg-[var(--surface-1)]/95 backdrop-blur-xl transition-all duration-[var(--motion-fast)] ${
          isMobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <Container className="space-y-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-[var(--motion-fast)] ${
                isActive(item.href)
                  ? 'bg-[rgb(var(--color-primary-rgb)/0.12)] text-[var(--color-primary)]'
                  : 'text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <div className="pt-1">
            <div className="mb-2">
              <ThemeToggle />
            </div>
            <Link
              href="/tools"
              className="btn btn-primary btn-md w-full justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              همه ابزارها
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
