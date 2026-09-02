/*
 * Navbar — Cedar Homes "Kenyan Earth Modernism"
 * Sticky nav with scroll-aware background, mobile drawer.
 * Mixes home-page section anchors with the standalone content pages.
 */
import { useState, useEffect, useCallback } from "react";
import { Phone, Mail, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";

import { CONTACT } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

type NavLink =
  | { label: string; kind: "hash"; hash: string }
  | { label: string; kind: "page"; to: string };

const navLinks: NavLink[] = [
  { label: "Units", kind: "hash", hash: "units" },
  { label: "Why Lusegetti", kind: "hash", hash: "why-kikuyu" },
  { label: "Specs", kind: "hash", hash: "specs" },
  { label: "Floor Plans", kind: "page", to: "/floor-plans" },
  { label: "Investment", kind: "page", to: "/investment" },
  { label: "ROI Calculator", kind: "page", to: "/roi-calculator" },
  { label: "Payment Plans", kind: "page", to: "/payment-plans" },
  { label: "Why Trust Us", kind: "page", to: "/why-trust-us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const renderLink = (link: NavLink, className: string, onClick?: () => void) =>
    link.kind === "page" ? (
      <Link key={link.label} to={link.to} onClick={onClick} className={className}>
        {link.label}
      </Link>
    ) : (
      <Link key={link.label} to="/" hash={link.hash} onClick={onClick} className={className}>
        {link.label}
      </Link>
    );

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-cedar-forest/5 ${
          scrolled ? "bg-white/95 backdrop-blur-lg" : "bg-white"
        }`}
      >
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group shrink-0" aria-label="Cedar Homes - Home">
            <div className="w-10 h-10 bg-cedar-forest flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-cedar-cream font-serif text-xl leading-none">G</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-cedar-forest text-2xl leading-tight">Cedar Homes</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-cedar-light-gray font-semibold">
                by GAP Developers
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8">
            {navLinks.map((link) =>
              renderLink(
                link,
                "text-xs font-semibold uppercase tracking-wider text-cedar-warm-gray hover:text-cedar-forest transition-colors duration-200 whitespace-nowrap"
              )
            )}
          </div>

          <Link
            to="/book-a-visit"
            className="hidden lg:inline-block bg-cedar-terracotta text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-cedar-terracotta-dark transition-colors duration-200 active:scale-[0.96]"
          >
            Book a Visit
          </Link>


          {/* Mobile toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-cedar-forest -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-cedar-forest/5">
                <span className="font-serif text-cedar-forest text-lg">Menu</span>
                <button
                  onClick={closeMobile}
                  className="w-8 h-8 flex items-center justify-center text-cedar-warm-gray hover:text-cedar-forest"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-1">
                {navLinks.map((link) =>
                  renderLink(
                    link,
                    "flex items-center justify-between py-3 px-3 text-[15px] font-medium text-cedar-charcoal/70 hover:text-cedar-forest hover:bg-cedar-cream/50 transition-colors",
                    closeMobile
                  )
                )}

                <Link
                  to="/virtual-tour"
                  onClick={closeMobile}
                  className="flex items-center justify-between py-3 px-3 text-[15px] font-medium text-cedar-charcoal/70 hover:text-cedar-forest hover:bg-cedar-cream/50 transition-colors"
                >
                  Virtual Tour
                  <ChevronRight size={14} className="text-cedar-warm-gray/40" />
                </Link>

                <Link
                  to="/book-a-visit"
                  onClick={closeMobile}
                  className="bg-cedar-terracotta text-white px-5 py-3.5 text-center font-semibold mt-4 text-[15px]"
                >
                  Book a Showhouse Visit
                </Link>

                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-cedar-forest/5">
                  <a
                    href={`tel:${CONTACT.phone}`}
                    onClick={() => trackEvent("phone_click", { location: "mobile_menu" })}
                    className="flex items-center gap-2.5 text-sm text-cedar-warm-gray hover:text-cedar-forest"
                  >
                    <Phone size={14} /> {CONTACT.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-2.5 text-sm text-cedar-warm-gray hover:text-cedar-forest"
                  >
                    <Mail size={14} /> {CONTACT.email}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
