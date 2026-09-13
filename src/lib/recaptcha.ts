// Google reCAPTCHA v3 (invisible) integration.
//
// The Site Key is PUBLIC and safe to expose in frontend code — it only
// identifies which reCAPTCHA configuration to use. The Secret Key must
// never live here: it stays server-side (in the Laravel backend) and is
// used to verify tokens against https://www.google.com/recaptcha/api/siteverify.
//
// Create a free key at https://www.google.com/recaptcha/admin/create

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

let scriptPromise: Promise<void> | null = null;

const loadScript = (): Promise<void> => {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar o script do reCAPTCHA"));
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Runs an invisible reCAPTCHA v3 check and returns a verification token to
 * send to the backend alongside the request it protects.
 *
 * Returns `null` when no Site Key is configured yet, so the app keeps
 * working locally (without bot protection) instead of breaking the flow.
 * Once VITE_RECAPTCHA_SITE_KEY is set, verification kicks in automatically.
 */
export const getRecaptchaToken = async (action: string): Promise<string | null> => {
  if (!SITE_KEY) {
    if (import.meta.env.DEV) {
      console.warn(
        "[recaptcha] VITE_RECAPTCHA_SITE_KEY não configurada — pulando verificação. " +
          "Crie uma chave gratuita em https://www.google.com/recaptcha/admin/create"
      );
    }
    return null;
  }

  try {
    await loadScript();
    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(SITE_KEY, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  } catch (err) {
    console.error("[recaptcha] Falha ao obter token", err);
    return null;
  }
};

export const isRecaptchaConfigured = (): boolean => Boolean(SITE_KEY);
