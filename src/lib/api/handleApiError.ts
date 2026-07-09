type ApiErrorShape = {
  data?: unknown;
  error?: string;
  message?: string;
  status?: number | string;
};

function extractMessage(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const firstMessage = value
      .map((item) => extractMessage(item))
      .find(Boolean);

    return firstMessage ?? null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.message === "string") {
      return record.message;
    }

    if (typeof record.detail === "string") {
      return record.detail;
    }

    for (const nestedValue of Object.values(record)) {
      const nestedMessage = extractMessage(nestedValue);

      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return null;
}

export function handleApiError(error: unknown) {
  const fallbackMessage = "حدث خطأ غير متوقع أثناء تنفيذ الطلب.";

  if (!error || typeof error !== "object") {
    return fallbackMessage;
  }

  const typedError = error as ApiErrorShape;

  return (
    extractMessage(typedError.data) ??
    typedError.message ??
    typedError.error ??
    fallbackMessage
  );
}
