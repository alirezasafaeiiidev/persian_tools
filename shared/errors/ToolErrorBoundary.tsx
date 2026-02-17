import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import AsyncState from '@/shared/ui/AsyncState';
import type { ToolError } from '@/shared/utils/result';
import { mapToolErrorToUx, normalizeToolError } from './tool';

type ToolErrorBoundaryProps = {
  children: ReactNode;
  onRetry?: () => void;
  onError?: (error: ToolError, info: ErrorInfo) => void;
  fallback?: (error: ToolError, retry: () => void) => ReactNode;
};

type ToolErrorBoundaryState = {
  error: ToolError | null;
};

export default class ToolErrorBoundary extends Component<
  ToolErrorBoundaryProps,
  ToolErrorBoundaryState
> {
  override state: ToolErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown): ToolErrorBoundaryState {
    return {
      error: normalizeToolError(error),
    };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    if (this.state.error) {
      this.props.onError?.(this.state.error, info);
      return;
    }

    const normalized = normalizeToolError(error);
    this.props.onError?.(normalized, info);
  }

  private handleRetry = () => {
    this.setState({ error: null });
    this.props.onRetry?.();
  };

  override render() {
    if (!this.state.error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(this.state.error, this.handleRetry);
    }

    const ux = mapToolErrorToUx(this.state.error);
    const description = ux.hint ? `${ux.message} ${ux.hint}` : ux.message;

    const action = ux.recoverable ? { label: 'تلاش مجدد', onClick: this.handleRetry } : null;

    return (
      <AsyncState
        variant="error"
        title={ux.title}
        description={description}
        {...(action ? { action } : {})}
      />
    );
  }
}
