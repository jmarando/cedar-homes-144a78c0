/*
 * Central site configuration — contact details, pricing, and unit data.
 * Change values here rather than hardcoding them across components.
 */

export const CONTACT = {
  phone: "+254797964858",
  phoneDisplay: "+254 797 964 858",
  whatsapp: "254797964858",
  email: "info@gapdevelopers.co.ke",
  address: "Cedar Homes, Lusegetti, Off Dagoretti Road, Kikuyu, Kiambu County, Kenya",
  mapsUrl: "https://maps.google.com/?q=Lusegetti+Dagoretti+Road+Kikuyu+Kiambu+Kenya",
} as const;

export const PRICING = {
  fromPrice: 23_500_000,
  toPrice: 25_000_000,
  fromPriceLabel: "Ksh 23.5M",
  toPriceLabel: "Ksh 25M",
  rangeLabel: "from Ksh 23.5M",
  reservationDeposit: 500_000,
  reservationDepositLabel: "Ksh 500,000",
} as const;

export const PROJECT = {
  name: "Cedar Homes",
  developer: "GAP Developers",
  totalUnits: 5,
  availableUnits: 5,
  sqm: 266,
  bedrooms: 4,
  location: "Lusegetti (Kikuyu), Kiambu County",
  appreciationRate: "15–20%",
} as const;

/** Builds a wa.me deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Pre-written WhatsApp openers, one per intent. */
export const WHATSAPP_MESSAGES = {
  general: "Hi Cedar Homes, I'd like more information about the Lusegetti development.",
  showhouseVisit:
    "Hi Cedar Homes, I'd like to book a visit to the showhouse at Lusegetti. When are you available?",
  bookHouse:
    "Hi Cedar Homes, I'd like to book one of the available houses. Could you send me the details?",
  virtualTour:
    "Hi Cedar Homes, I'm based abroad and would like to schedule a live virtual tour of the showhouse.",
  paymentPlan:
    "Hi Cedar Homes, could you share the flexible payment schedule for the Cedar Homes units?",
  investment:
    "Hi Cedar Homes, I'd like the investment brief with appreciation and rental yield figures for the area.",
  roi: "Hi Cedar Homes, I've used the ROI calculator and would like to discuss the numbers with your team.",
} as const;


export const PERSONAS = [
  {
    id: "family",
    label: "A home for my family",
    blurb: "Space, a garden, and a short school run.",
    interest: "showhouse-visit",
    cta: "Book a showhouse visit",
  },
  {
    id: "local-investor",
    label: "An investment in Kenya",
    blurb: "Appreciation data, yields, and guaranteed title.",
    interest: "investment-brief",
    cta: "Get the investment brief",
  },
  {
    id: "diaspora-first-time",
    label: "My first home, from abroad",
    blurb: "Virtual tours and verified developer credentials.",
    interest: "virtual-tour",
    cta: "Schedule a virtual tour",
  },
  {
    id: "diaspora-investor",
    label: "Rental income while abroad",
    blurb: "Projected returns in Ksh, managed end to end.",
    interest: "roi-calculator",
    cta: "Run the ROI numbers",
  },
] as const;

export type PersonaId = (typeof PERSONAS)[number]["id"];
