import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ToolErrorBoundary from '@/shared/errors/ToolErrorBoundary';

const ThrowingChild = () => {
  throw new Error('boom');
};

describe('ToolErrorBoundary', () => {
  it('renders fallback async error state when child throws', () => {
    render(
      <ToolErrorBoundary>
        <ThrowingChild />
      </ToolErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('خطای نامشخص')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'تلاش مجدد' })).toBeInTheDocument();
  });

  it('runs retry callback on retry action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ToolErrorBoundary onRetry={onRetry}>
        <ThrowingChild />
      </ToolErrorBoundary>,
    );

    await user.click(screen.getByRole('button', { name: 'تلاش مجدد' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
