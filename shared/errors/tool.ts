import { useCallback, useMemo, useState } from 'react';
import type { ToolError } from '@/shared/utils/result';
import { isBaseError } from './base';

export type ToolErrorUx = {
  title: string;
  message: string;
  hint?: string;
  recoverable: boolean;
};

type ToolErrorPreset = Omit<ToolErrorUx, 'message'>;

const ERROR_PRESETS: Record<string, ToolErrorPreset> = {
  ERROR: {
    title: 'خطای نامشخص',
    recoverable: true,
    hint: 'دوباره تلاش کنید. اگر خطا تکرار شد، ورودی را بررسی کنید.',
  },
  VALIDATION_ERROR: {
    title: 'ورودی نامعتبر است',
    recoverable: true,
    hint: 'فرمت ورودی را با راهنمای ابزار تطبیق دهید.',
  },
  PROCESSING_ERROR: {
    title: 'خطا در پردازش',
    recoverable: true,
    hint: 'با تنظیمات سبک‌تر (Lite) دوباره امتحان کنید.',
  },
  FILE_ERROR: {
    title: 'خطای فایل',
    recoverable: true,
    hint: 'نوع و اندازه فایل را بررسی و دوباره تلاش کنید.',
  },
  PERMISSION_ERROR: {
    title: 'مجوز کافی نیست',
    recoverable: false,
    hint: 'دسترسی لازم را فعال کنید و دوباره وارد ابزار شوید.',
  },
  PDF_FILE_TOO_LARGE: {
    title: 'فایل بیش از حد بزرگ است',
    recoverable: true,
    hint: 'فایل کوچک‌تر یا حالت Lite را انتخاب کنید.',
  },
  PDF_INVALID_PASSWORD: {
    title: 'رمز فایل PDF نامعتبر است',
    recoverable: true,
    hint: 'رمز درست را وارد کنید.',
  },
  PDF_CORRUPTED_FILE: {
    title: 'فایل PDF خراب است',
    recoverable: false,
    hint: 'فایل را دوباره تولید یا از نسخه سالم استفاده کنید.',
  },
};

const DEFAULT_FALLBACK_MESSAGE = 'خطای نامشخص رخ داد.';

const pickPreset = (code: string): ToolErrorPreset =>
  ERROR_PRESETS[code] ??
  ERROR_PRESETS[code.toUpperCase()] ??
  ERROR_PRESETS['ERROR'] ?? {
    title: 'خطای نامشخص',
    recoverable: true,
  };

export const normalizeToolError = (
  error: unknown,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
): ToolError => {
  if (isBaseError(error)) {
    return {
      code: error.code,
      message: error.message,
      details: error.toJSON(),
    };
  }

  if (error instanceof Error) {
    return {
      code: 'ERROR',
      message: error.message,
    };
  }

  return {
    code: 'ERROR',
    message: fallbackMessage,
    details: error,
  };
};

export const mapToolErrorToUx = (error: ToolError): ToolErrorUx => {
  const preset = pickPreset(error.code);
  const mapped: ToolErrorUx = {
    title: preset.title,
    message: error.message || DEFAULT_FALLBACK_MESSAGE,
    recoverable: preset.recoverable,
  };

  if (preset.hint) {
    return {
      ...mapped,
      hint: preset.hint,
    };
  }

  return mapped;
};

export const toToolErrorWithUx = (error: unknown): { error: ToolError; ux: ToolErrorUx } => {
  const normalized = normalizeToolError(error);
  return {
    error: normalized,
    ux: mapToolErrorToUx(normalized),
  };
};

export const useToolError = (initialError: ToolError | null = null) => {
  const [error, setError] = useState<ToolError | null>(initialError);

  const setErrorFromUnknown = useCallback((nextError: unknown, fallbackMessage?: string) => {
    setError(normalizeToolError(nextError, fallbackMessage));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const ux = useMemo(() => (error ? mapToolErrorToUx(error) : null), [error]);

  return {
    error,
    hasError: error !== null,
    ux,
    setError,
    setErrorFromUnknown,
    clearError,
  };
};
