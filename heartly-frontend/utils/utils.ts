import { redirect } from "next/navigation";

// Define storage interface locally
interface SupportedStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
): never {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Decodes a message from the URL query parameters.
 * @param {URLSearchParams} searchParams - The URL search params object.
 * @returns {{ type: 'error' | 'success' | null, message: string | null }} The decoded message and its type.
 */
export function decodeMessage(searchParams: URLSearchParams) {
  const errorMessage = searchParams.get("error");
  const successMessage = searchParams.get("success");

  if (errorMessage) {
    return {
      type: "error" as const,
      message: decodeURIComponent(errorMessage),
    };
  }

  if (successMessage) {
    return {
      type: "success" as const,
      message: decodeURIComponent(successMessage),
    };
  }

  return { type: null, message: null };
}

const supportsLocalStorage = (): boolean => {
  try {
    const testKey = "__test__";
    globalThis.localStorage.setItem(testKey, "test");
    globalThis.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const inMemoryStorage: Record<string, string> = {};

export const customStorageAdapter: SupportedStorage = {
  getItem: (key) => {
    if (!supportsLocalStorage()) {
      return inMemoryStorage[key] || null;
    }
    return globalThis.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (!supportsLocalStorage()) {
      inMemoryStorage[key] = value;
      return;
    }
    globalThis.localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (!supportsLocalStorage()) {
      delete inMemoryStorage[key];
      return;
    }
    globalThis.localStorage.removeItem(key);
  },
};

export const generateTenantDomain = (tenantName: string) => {
  return tenantName.toLowerCase().replace(/ /g, "-");
};
