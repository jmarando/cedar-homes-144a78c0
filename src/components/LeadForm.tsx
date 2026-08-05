/*
 * LeadForm — the single lead-capture form used across the site.
 * Persists to the database, attaches campaign attribution, fires conversion
 * events, and offers WhatsApp as a zero-friction alternative.
 */
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { submitLead } from "@/lib/leads.functions";
import { leadSchema, INTEREST_OPTIONS, TIMELINE_OPTIONS } from "@/lib/lead-schema";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site-config";

interface LeadFormProps {
  /** Pre-selects the "I'm interested in" dropdown. */
  defaultInterest?: string;
  /** Persona tag recorded against the lead for segmentation. */
  persona?: string;
  /** Which page/section produced the lead. */
  source?: string;
  /** Shows the timeline and country fields. */
  extended?: boolean;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  /** "dark" for forest backgrounds, "light" for cream backgrounds. */
  variant?: "dark" | "light";
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  timeline: string;
  country: string;
  preferredContact: "whatsapp" | "phone" | "email";
  company: string;
}

const blankForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
  timeline: "",
  country: "",
  preferredContact: "whatsapp",
  company: "",
};

export default function LeadForm({
  defaultInterest = "",
  persona = "",
  source = "website",
  extended = false,
  title = "Get in Touch",
  subtitle = "Fill in your details and our team will reach out within 24 hours.",
  submitLabel = "Send My Enquiry",
  variant = "dark",
}: LeadFormProps) {
  const [form, setForm] = useState<FormState>({ ...blankForm, interest: defaultInterest });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const send = useServerFn(submitLead);

  useEffect(() => {
    setForm((prev) => ({ ...prev, interest: prev.interest || defaultInterest }));
  }, [defaultInterest]);

  const update = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const attribution = getAttribution();
      const payload = { ...form, persona, source, ...attribution };

      const parsed = leadSchema.safeParse(payload);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0]);
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        toast.error("Please check the highlighted fields");
        return;
      }

      setLoading(true);
      try {
        await send({ data: parsed.data });
        trackEvent("lead_submitted", { interest: parsed.data.interest, persona, source });
        if (parsed.data.interest === "showhouse-visit") {
          trackEvent("visit_requested", { source });
        }
        setSubmitted(true);
        toast.success("Thank you! We'll be in touch within 24 hours.");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try WhatsApp instead.");
      } finally {
        setLoading(false);
      }
    },
    [form, persona, source, send]
  );

  const dark = variant === "dark";
  const panel = dark
    ? "bg-white/[0.03] backdrop-blur-sm border border-white/[0.08]"
    : "bg-white border border-cedar-forest/10 shadow-sm";
  const labelCls = dark ? "text-white/60" : "text-cedar-charcoal/70";
  const inputCls = dark
    ? "w-full bg-white/[0.04] border border-white/[0.1] text-white px-4 py-3 text-[14px] placeholder:text-white/25 focus:border-cedar-gold/50 focus:outline-none focus:ring-1 focus:ring-cedar-gold/20 transition-all duration-200"
    : "w-full bg-cedar-cream/40 border border-cedar-forest/12 text-cedar-charcoal px-4 py-3 text-[14px] placeholder:text-cedar-warm-gray/60 focus:border-cedar-terracotta/50 focus:outline-none focus:ring-1 focus:ring-cedar-terracotta/15 transition-all duration-200";
  const optionCls = dark ? "bg-[#1B3A2D]" : "bg-white";
  const headingCls = dark ? "text-white" : "text-cedar-forest";
  const subCls = dark ? "text-white/40" : "text-cedar-warm-gray";

  if (submitted) {
    return (
      <div className={`${panel} p-8 lg:p-10 text-center`}>
        <div className="w-14 h-14 bg-cedar-gold/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} className="text-cedar-gold" />
        </div>
        <h3 className={`font-serif text-2xl mb-3 ${headingCls}`}>Thank You!</h3>
        <p className={`text-[15px] leading-relaxed max-w-sm mx-auto mb-6 ${dark ? "text-white/60" : "text-cedar-charcoal/70"}`}>
          Your enquiry is with our sales team. Expect a call or WhatsApp message within 24 hours,
          along with the full information pack.
        </p>
        <a
          href={whatsappLink(WHATSAPP_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { intent: "post_submit" })}
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 text-[14px] font-semibold"
        >
          <MessageCircle size={16} />
          Or message us now on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${panel} p-7 lg:p-8`} noValidate>
      <h3 className={`font-serif text-xl mb-1.5 ${headingCls}`}>{title}</h3>
      <p className={`text-[13px] mb-7 ${subCls}`}>{subtitle}</p>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="firstName" label="First Name" error={errors["firstName"]} labelCls={labelCls}>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={inputCls}
              placeholder="Wanjiru"
              autoComplete="given-name"
              maxLength={80}
            />
          </Field>
          <Field id="lastName" label="Last Name" error={errors["lastName"]} labelCls={labelCls}>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={inputCls}
              placeholder="Kamau"
              autoComplete="family-name"
              maxLength={80}
            />
          </Field>
        </div>

        <Field id="email" label="Email Address" error={errors["email"]} labelCls={labelCls}>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls}
            placeholder="you@email.com"
            autoComplete="email"
            maxLength={255}
          />
        </Field>

        <Field id="phone" label="Phone / WhatsApp Number" error={errors["phone"]} labelCls={labelCls}>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputCls}
            placeholder="+254 7XX XXX XXX"
            autoComplete="tel"
            maxLength={32}
          />
        </Field>

        <Field id="interest" label="I am interested in" error={errors["interest"]} labelCls={labelCls}>
          <select
            id="interest"
            value={form.interest}
            onChange={(e) => update("interest", e.target.value)}
            className={`${inputCls} appearance-none`}
          >
            <option value="" className={optionCls}>Select an option</option>
            {INTEREST_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className={optionCls}>{o.label}</option>
            ))}
          </select>
        </Field>

        {extended && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="timeline" label="When are you looking to buy?" labelCls={labelCls}>
              <select
                id="timeline"
                value={form.timeline}
                onChange={(e) => update("timeline", e.target.value)}
                className={`${inputCls} appearance-none`}
              >
                <option value="" className={optionCls}>Select</option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className={optionCls}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field id="country" label="Where are you based?" labelCls={labelCls}>
              <input
                id="country"
                type="text"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={inputCls}
                placeholder="Kenya / UK / USA…"
                autoComplete="country-name"
                maxLength={80}
              />
            </Field>
          </div>
        )}

        <Field id="message" label="Anything else we should know? (optional)" labelCls={labelCls}>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${inputCls} min-h-[88px] resize-y`}
            placeholder="Questions about finishes, timelines, payment…"
            maxLength={1500}
          />
        </Field>

        <div>
          <span className={`text-[13px] mb-2 block font-medium ${labelCls}`}>Best way to reach you</span>
          <div className="flex gap-2">
            {(["whatsapp", "phone", "email"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => update("preferredContact", method)}
                className={`flex-1 py-2.5 text-[13px] font-medium capitalize border transition-colors ${
                  form.preferredContact === method
                    ? "bg-cedar-terracotta border-cedar-terracotta text-white"
                    : dark
                      ? "border-white/[0.12] text-white/55 hover:border-white/30"
                      : "border-cedar-forest/12 text-cedar-charcoal/60 hover:border-cedar-terracotta/40"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Honeypot — hidden from humans, irresistible to bots */}
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] w-px h-px opacity-0"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cedar-terracotta hover:bg-cedar-terracotta-light disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cedar-terracotta/15 mt-2 text-[14px]"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              {submitLabel}
            </>
          )}
        </button>

        <p className={`text-[11px] leading-relaxed text-center ${subCls}`}>
          We use your details only to respond to this enquiry, in line with the Kenya Data
          Protection Act. No spam, and you can ask us to delete your data at any time.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  labelCls,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  labelCls: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={`text-[13px] mb-1.5 block font-medium ${labelCls}`}>
        {label}
      </label>
      {children}
      {error && <p className="text-cedar-terracotta text-[12px] mt-1.5">{error}</p>}
    </div>
  );
}
