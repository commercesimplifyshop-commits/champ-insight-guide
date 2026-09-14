import "@testing-library/jest-dom";

// jsdom doesn't implement localStorage by default — without this, any
// component using it (e.g. CookieConsentBanner) silently no-ops in tests,
// masking real bugs in the code path that only runs once it's readable.
if (typeof window !== "undefined" && !window.localStorage) {
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    writable: true,
    value: {
      getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    },
  });
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
