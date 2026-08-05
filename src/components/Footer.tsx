/*
 * Footer — Cedar Homes "Kenyan Earth Modernism"
 * Brand, contact, location, quick links, and copyright
 */
import { Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#hero" },
  { label: "Unit Availability", href: "#units" },
  { label: "Why Kikuyu", href: "#why-kikuyu" },
  { label: "Property Specs", href: "#specs" },
  { label: "Trust & Transparency", href: "#trust" },
  { label: "Construction Timeline", href: "#timeline" },
  { label: "Book a Visit", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-cedar-charcoal" role="contentinfo">
      <div className="container py-14 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-cedar-forest flex items-center justify-center">
                <span className="text-cedar-gold font-serif text-base font-bold leading-none">G</span>
              </div>
              <div className="leading-tight">
                <span className="font-serif text-white text-lg block">Cedar Homes</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold">
                  by GAP Developers
                </span>
              </div>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-[240px]">
              Five exclusive 4-bedroom maisonettes in Kikuyu's premier gated community.
              Showhouse ready for viewing.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-[12px] uppercase tracking-[0.15em] mb-5">Contact</h4>
            <div className="space-y-3.5">
              <a
                href="tel:+254797964858"
                className="flex items-center gap-2.5 text-white/50 hover:text-cedar-gold transition-colors duration-200 text-[13px]"
              >
                <Phone size={13} className="shrink-0" />
                +254 797 964 858
              </a>
              <a
                href="mailto:info@gapdevelopers.co.ke"
                className="flex items-center gap-2.5 text-white/50 hover:text-cedar-gold transition-colors duration-200 text-[13px]"
              >
                <Mail size={13} className="shrink-0" />
                info@gapdevelopers.co.ke
              </a>
              <a
                href="https://www.gapdevelopers.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/50 hover:text-cedar-gold transition-colors duration-200 text-[13px]"
              >
                <Globe size={13} className="shrink-0" />
                www.gapdevelopers.co.ke
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-semibold text-[12px] uppercase tracking-[0.15em] mb-5">Showhouse Location</h4>
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-white/50 text-[13px]">
                <MapPin size={13} className="shrink-0 mt-0.5" />
                <span>Off Dagoretti Road, Lusegetti. Approx. 2 km from Shell Lusegetti.</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/50 text-[13px]">
                <Clock size={13} className="shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="block">Mon–Fri: 09:00 – 18:30</span>
                  <span className="block">Saturday: 09:00 – 15:30</span>
                  <span className="block text-cedar-gold/70 mt-1 text-[12px]">Visits by appointment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-[12px] uppercase tracking-[0.15em] mb-5">Quick Links</h4>
            <div className="space-y-2.5">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/50 hover:text-cedar-gold transition-colors duration-200 text-[13px]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-12 pt-7 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-[11px]">
            &copy; {new Date().getFullYear()} GAP Developers. All rights reserved.
          </p>
          <p className="text-white/25 text-[11px] font-medium tracking-wide">
            Cedar Homes — Built for Life.
          </p>
        </div>
      </div>
    </footer>
  );
}
