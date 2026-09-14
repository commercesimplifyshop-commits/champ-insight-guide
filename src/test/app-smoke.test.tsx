import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App smoke test", () => {
  it("renders without throwing, including components that need Router context (e.g. CookieConsentBanner's <Link>)", () => {
    render(<App />);
    // CookieConsentBanner renders a <Link> to /privacy — this only succeeds
    // if it's mounted inside <BrowserRouter> (regression test for exactly
    // that bug: rendering it outside crashes the whole app with
    // "Cannot destructure property 'basename' of useContext(...) as it is null").
    expect(screen.getByRole("button", { name: /aceitar/i })).toBeInTheDocument();
  });
});
