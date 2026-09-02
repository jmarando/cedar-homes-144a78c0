/*
 * Lead validation schema — shared by the browser form and the server handler.
 * Client-safe: contains no server-only imports.
 */
import { z } from "zod";

export const INTEREST_OPTIONS = [
  { value: "showhouse-visit", label: "Visiting the showhouse" },
  { value: "pre-order", label: "Booking one of the available homes" },
  { value: "buy-showhouse", label: "Buying the show house" },
  { value: "virtual-tour", label: "Virtual tour (from abroad)" },
  { value: "investment-brief", label: "The investment brief" },
  { value: "roi-calculator", label: "ROI and rental projections" },
  { value: "payment-plan", label: "Payment plan details" },
  { value: "general", label: "Something else" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "immediately", label: "Ready now" },
  { value: "0-3-months", label: "Within 3 months" },
  { value: "3-6-months", label: "3 – 6 months" },
  { value: "6-12-months", label: "6 – 12 months" },
  { value: "researching", label: "Just researching" },
] as const;

const interestValues = INTEREST_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(32)
    .regex(/^[+0-9()\-.\s]+$/, "Phone can only contain digits and + ( ) - ."),
  interest: z.enum(interestValues, { errorMap: () => ({ message: "Choose what you need" }) }),
  persona: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  preferredContact: z.enum(["whatsapp", "phone", "email"]).default("whatsapp"),
  source: z.string().trim().max(60).default("website"),
  utmSource: z.string().trim().max(120).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(120).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(120).optional().or(z.literal("")),
  utmTerm: z.string().trim().max(120).optional().or(z.literal("")),
  utmContent: z.string().trim().max(120).optional().or(z.literal("")),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
  landingPage: z.string().trim().max(500).optional().or(z.literal("")),
  // Honeypot — must stay empty. Bots fill it in.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadParsed = z.output<typeof leadSchema>;
