/*
 * Social proof strip. Quotes and the walkthrough video are placeholders until
 * the real buyer testimonials and showhouse footage are supplied.
 */
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Placeholder — a local family buyer's story about choosing Kikuyu and how the build progressed.",
    name: "Buyer name",
    detail: "Family buyer, Nairobi",
  },
  {
    quote:
      "Placeholder — a diaspora buyer describing the live video walkthrough and how they verified the title from abroad.",
    name: "Buyer name",
    detail: "Diaspora buyer, London",
  },
  {
    quote:
      "Placeholder — an investor's note on rental demand in Kikuyu and pre-completion pricing.",
    name: "Buyer name",
    detail: "Investor, Nairobi",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What buyers say
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real stories from families, diaspora buyers and investors who bought with GAP
            Developers.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.detail}
              className="flex h-full flex-col rounded-xl border bg-background p-6"
            >
              <Quote className="h-5 w-5 text-primary" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 border-t pt-4 text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="block text-xs text-muted-foreground">{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed bg-background text-center text-sm text-muted-foreground">
            <div className="px-6">
              <p className="font-medium text-foreground">Showhouse video walkthrough</p>
              <p className="mt-1">Video coming shortly — send the file or YouTube link.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
