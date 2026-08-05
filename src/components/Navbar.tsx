/*
 * Navbar — Cedar Homes "Kenyan Earth Modernism"
 * Sticky nav with top utility bar, scroll-aware background, mobile drawer
 */
import { useState, useEffect, useCallback } from "react";
import { Phone, Mail, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Units", href: "#units" },
  { label: "Why Kikuyu", href: "#why-kikuyu" },
  { label: "Specs", href: "#specs" },
  { label: "Trust", href: "#trust" },
  { label: "Progress", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  // Scroll detection with throttling
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

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Utility bar */}
      <div className="bg-cedar-forest text-cedar-cream/80 text-[13px] hidden md:block">
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <a
              href="tel:+254797964858"
              className="flex items-center gap-1.5 hover:text-cedar-gold transition-colors duration-200"
              aria-label="Call us"
            >
              <Phone size={12} strokeWidth={2.5} />
              <span>+254 797 964 858</span>
            </a>
            <a
              href="mailto:info@gapdevelopers.co.ke"
              className="flex items-center gap-1.5 hover:text-cedar-gold transition-colors duration-200"
              aria-label="Email us"
            >
              <Mail size={12} strokeWidth={2.5} />
              <span>info@gapdevelopers.co.ke</span>
            </a>
          </div>
          <span className="text-cedar-gold/90 font-semibold tracking-wide text-[11px] uppercase">
            Showhouse Open for Viewing — 4 Units for Pre-Order
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/97 backdrop-blur-lg shadow-[0_1px_3px_0_rgba(27,58,45,0.08)]"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-[68px]">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group shrink-0" aria-label="Cedar Homes - Home">
            <div className="w-9 h-9 bg-cedar-forest flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-cedar-gold font-serif text-base font-bold leading-none">G</span>
            </div>
            <div className="leading-tight">
              <span className="font-serif text-cedar-forest text-lg tracking-tight block">Cedar Homes</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-cedar-warm-gray font-semibold">
                by GAP Developers
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-cedar-forest"
                      : "text-cedar-charcoal/60 hover:text-cedar-forest"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-cedar-terracotta"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
            <a
              href="#contact"
              className="ml-4 bg-cedar-terracotta text-white px-5 py-2 text-[13px] font-semibold tracking-wide hover:bg-cedar-terracotta-dark transition-colors duration-200 shadow-sm shadow-cedar-terracotta/15"
            >
              Book a Visit
            </a>
          </div>

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 lg:hidden shadow-2xl"
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
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={`flex items-center justify-between py-3 px-3 text-[15px] font-medium transition-colors ${
                      activeSection === link.href
                        ? "text-cedar-forest bg-cedar-cream"
                        : "text-cedar-charcoal/70 hover:text-cedar-forest hover:bg-cedar-cream/50"
                    }`}
                  >
                    {link.label}
                    <ChevronRight size={14} className="text-cedar-warm-gray/40" />
                  </a>
                ))}

                <a
                  href="#contact"
                  onClick={closeMobile}
                  className="bg-cedar-terracotta text-white px-5 py-3.5 text-center font-semibold mt-4 text-[15px]"
                >
                  Book a Showhouse Visit
                </a>

                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-cedar-forest/5">
                  <a href="tel:+254797964858" className="flex items-center gap-2.5 text-sm text-cedar-warm-gray hover:text-cedar-forest">
                    <Phone size={14} /> +254 797 964 858
                  </a>
                  <a href="mailto:info@gapdevelopers.co.ke" className="flex items-center gap-2.5 text-sm text-cedar-warm-gray hover:text-cedar-forest">
                    <Mail size={14} /> info@gapdevelopers.co.ke
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
