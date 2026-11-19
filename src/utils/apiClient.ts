import type { ValidationErrors } from './rescueLogic';

export interface ApiJsonResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  fieldErrors?: ValidationErrors;
}

export async function postApiJson<T>(url: string, payload: unknown): Promise<ApiJsonResult<T>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get('content-type') || '';
  let parsed: Record<string, unknown> | null = null;

  if (contentType.includes('application/json')) {
    try {
      parsed = (await response.json()) as Record<string, unknown>;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok || !parsed) {
    return {
      ok: false,
      status: response.status,
      data: null,
      error:
        (parsed && typeof parsed.error === 'string' && parsed.error) ||
        `Unable to process request (HTTP ${response.status}). Please try again or reach us on WhatsApp +256 704 290 817.`,
      fieldErrors:
        parsed && typeof parsed.fieldErrors === 'object' && parsed.fieldErrors !== null
          ? (parsed.fieldErrors as ValidationErrors)
          : undefined,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: parsed as unknown as T,
  };
}
