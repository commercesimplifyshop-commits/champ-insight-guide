const TRUSTED_STRIPE_HOSTS = ["checkout.stripe.com", "billing.stripe.com"];

/**
 * Navigates to a Stripe Checkout/Customer Portal URL returned by our own
 * backend, after checking it's actually a Stripe-hosted URL. Defense in
 * depth: this value should only ever come from Stripe's own SDK response on
 * our server, but validating it here means a compromised/misconfigured
 * backend response can't be turned into an open redirect for this tab.
 */
export const redirectToStripeUrl = (url: unknown): boolean => {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !TRUSTED_STRIPE_HOSTS.includes(parsed.hostname)) {
      console.error("[billing] Refusing to redirect to untrusted URL:", parsed.hostname);
      return false;
    }
  } catch {
    return false;
  }
  window.location.href = url;
  return true;
};
