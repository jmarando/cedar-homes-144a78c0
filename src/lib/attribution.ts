/*
 * Campaign attribution — captures UTM params and the original referrer on
 * first visit and keeps them in sessionStorage so they survive navigation.
 */

const STORAGE_KEY = "cedar_attribution";

export interface Attribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
  landingPage: string;
}

const EMPTY: Attribution = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  referrer: "",
  landingPage: "",
};

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing) return { ...EMPTY, ...JSON.parse(existing) };

    const params = new URLSearchParams(window.location.search);
    const attribution: Attribution = {
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmTerm: params.get("utm_term") ?? "",
      utmContent: params.get("utm_content") ?? "",
      referrer: document.referrer.slice(0, 500),
      landingPage: window.location.pathname + window.location.search,
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return EMPTY;
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : captureAttribution();
  } catch {
    return EMPTY;
  }
}
