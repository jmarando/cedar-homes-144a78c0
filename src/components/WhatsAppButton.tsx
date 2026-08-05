/*
 * WhatsAppButton — sticky click-to-chat launcher with intent shortcuts.
 * Free tier of the WhatsApp strategy: wa.me deep links, no API required.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Eye, ShoppingBag, Video, Wallet } from "lucide-react";

import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

const shortcuts = [
  { icon: Eye, label: "Book a showhouse visit", message: WHATSAPP_MESSAGES.showhouseVisit, intent: "showhouse_visit" },
  { icon: ShoppingBag, label: "Pre-order a unit", message: WHATSAPP_MESSAGES.preOrder, intent: "pre_order" },
  { icon: Video, label: "Virtual tour from abroad", message: WHATSAPP_MESSAGES.virtualTour, intent: "virtual_tour" },
  { icon: Wallet, label: "Payment plans", message: WHATSAPP_MESSAGES.paymentPlan, intent: "payment_plan" },
];

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-[268px] bg-white shadow-2xl border border-cedar-forest/10 overflow-hidden"
          >
            <div className="bg-cedar-forest px-4 py-3">
              <p className="text-white text-[13px] font-semibold">Chat with Cedar Homes</p>
              <p className="text-white/50 text-[11px] mt-0.5">Typically replies within minutes</p>
            </div>
            <div className="p-2">
              {shortcuts.map((item) => (
                <a
                  key={item.intent}
                  href={whatsappLink(item.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { intent: item.intent })}
                  className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-cedar-charcoal/80 hover:bg-cedar-cream hover:text-cedar-forest transition-colors"
                >
                  <item.icon size={15} className="text-cedar-terracotta shrink-0" />
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp menu" : "Chat on WhatsApp"}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={24} /> : <MessageCircle size={26} fill="currentColor" />}
      </button>
    </div>
  );
}
