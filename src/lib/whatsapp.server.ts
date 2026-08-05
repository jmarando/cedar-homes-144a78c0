/*
 * Server-only WhatsApp Cloud API helpers.
 * Never imported by browser code (*.server.ts is blocked from client bundles).
 */
const GRAPH_VERSION = "v21.0";

export interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
}

export function getWhatsAppConfig(): WhatsAppConfig | null {
  const token = process.env["WHATSAPP_ACCESS_TOKEN"];
  const phoneNumberId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  if (!token || !phoneNumberId) return null;
  return { token, phoneNumberId };
}

/** Digits only, no leading + or zeros — Cloud API wants E.164 without '+'. */
export function normalizeMsisdn(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `254${digits.slice(1)}`;
  return digits;
}

/** Last 9 digits — used to match an inbound number to a stored lead phone. */
export function msisdnTail(raw: string): string {
  return normalizeMsisdn(raw).slice(-9);
}

export async function sendWhatsAppText(
  to: string,
  body: string,
): Promise<{ id: string | null }> {
  const config = getWhatsAppConfig();
  if (!config) {
    throw new Error(
      "WhatsApp is not connected yet. Add your WhatsApp Business access token and phone number ID.",
    );
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizeMsisdn(to),
        type: "text",
        text: { preview_url: false, body },
      }),
    },
  );

  const text = await response.text();
  if (!response.ok) {
    console.error(`[whatsapp] send failed [${response.status}]: ${text}`);
    throw new Error(`WhatsApp send failed [${response.status}]: ${text}`);
  }

  try {
    const json = JSON.parse(text) as { messages?: Array<{ id?: string }> };
    return { id: json.messages?.[0]?.id ?? null };
  } catch {
    return { id: null };
  }
}
