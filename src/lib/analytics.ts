/*
 * Analytics — GA4 + Meta Pixel loader and a single trackEvent entry point.
 * Both IDs are optional: nothing loads until the env vars are set, so the
 * site works fine before the ad accounts exist.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: unknown };
    _fbq?: unknown;
  }
}

const GA_ID = import.meta.env["VITE_GA4_MEASUREMENT_ID"] as string | undefined;
const META_PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"] as string | undefined;

let initialised = false;

export function initAnalytics() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  if (GA_ID) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: true });
  }

  if (META_PIXEL_ID) {
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function (...args: unknown[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq?.("init", META_PIXEL_ID);
    window.fbq?.("track", "PageView");
  }
}

/** Fire a page view on client-side route changes. */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "page_view", { page_path: path });
  window.fbq?.("track", "PageView");
}

type EventParams = Record<string, string | number | boolean | undefined>;

/** Fire a custom conversion event to every configured platform. */
export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);

  const metaStandard: Record<string, string> = {
    lead_submitted: "Lead",
    whatsapp_click: "Contact",
    phone_click: "Contact",
    brochure_download: "ViewContent",
    roi_calculated: "ViewContent",
    visit_requested: "Schedule",
  };
  const standard = metaStandard[name];
  if (standard) {
    window.fbq?.("track", standard, params);
  } else {
    window.fbq?.("trackCustom", name, params);
  }
}
