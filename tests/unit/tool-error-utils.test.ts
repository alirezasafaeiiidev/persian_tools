import { describe, expect, it } from 'vitest';
import { ValidationError } from '@/shared/errors/base';
import { mapToolErrorToUx, normalizeToolError, toToolErrorWithUx } from '@/shared/errors/tool';

describe('tool error utils', () => {
  it('normalizes BaseError instances with code/details', () => {
    const source = new ValidationError('نامعتبر', 'field');
    const normalized = normalizeToolError(source);

    expect(normalized.code).toBe('VALIDATION_ERROR');
    expect(normalized.message).toContain('نامعتبر');
    expect(normalized.details).toBeDefined();
  });

  it('maps known codes to Persian UX metadata', () => {
    const ux = mapToolErrorToUx({
      code: 'PDF_INVALID_PASSWORD',
      message: 'wrong password',
    });

    expect(ux.title).toBe('رمز فایل PDF نامعتبر است');
    expect(ux.recoverable).toBe(true);
    expect(ux.hint).toContain('رمز درست');
  });

  it('returns normalized error with ux payload for unknown errors', () => {
    const mapped = toToolErrorWithUx({ reason: 'bad input' });

    expect(mapped.error.code).toBe('ERROR');
    expect(mapped.ux.title).toBe('خطای نامشخص');
  });
});
