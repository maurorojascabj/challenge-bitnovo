import { AppError } from '@/features/payments/types';

export function normalizeError(error: unknown): AppError {
  const err = error as {
    response?: { status: number; data: Record<string, unknown> };
    request?: unknown;
    code?: string;
    message?: string;
  };

  if (err?.response) {
    const status = err.response.status;
    const data = err.response.data;
    const message =
      (data?.detail as string) ||
      (data?.message as string) ||
      (data?.error as string) ||
      (typeof data === 'string' ? data : null) ||
      `Error ${status}`;

    return { code: `HTTP_${status}`, message, status, raw: data };
  }

  if (err?.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'No se pudo conectar con el servidor. Revisa tu conexión.',
      raw: err.message,
    };
  }

  if (err?.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'La petición tardó demasiado. Inténtalo de nuevo.',
      raw: err.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: err?.message ?? 'Ha ocurrido un error inesperado.',
    raw: error,
  };
}
