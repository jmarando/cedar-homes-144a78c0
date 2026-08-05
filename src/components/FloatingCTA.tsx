/*
 * FloatingCTA — Cedar Homes "Kenyan Earth Modernism"
 * Sticky bottom CTA bar on mobile, floating button on desktop
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Phone, X } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile: bottom bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-cedar-forest/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-2 px-4 py-3">
              <a
                href="#contact"
                className="flex-1 bg-cedar-terracotta text-white py-3 text-center text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2"
              >
                <Eye size={15} />
                Book a Visit
              </a>
              <a
                href="tel:+254797964858"
                className="bg-cedar-forest text-white w-12 h-12 flex items-center justify-center shrink-0"
                aria-label="Call us"
              >
                <Phone size={17} />
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="text-cedar-warm-gray hover:text-cedar-charcoal w-8 h-8 flex items-center justify-center shrink-0"
                aria-label="Dismiss floating bar"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>

          {/* Desktop: floating button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-8 right-8 z-40 hidden lg:block"
          >
            <a
              href="#contact"
              className="group bg-cedar-terracotta hover:bg-cedar-terracotta-dark text-white px-6 py-3.5 font-semibold tracking-wide shadow-xl shadow-cedar-terracotta/25 hover:shadow-2xl transition-all duration-200 flex items-center gap-2.5 text-[14px]"
            >
              <Eye size={17} />
              Book a Showhouse Visit
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
