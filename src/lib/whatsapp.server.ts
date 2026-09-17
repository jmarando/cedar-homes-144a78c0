/*
 * Server-only WhatsApp helpers via the Lovable connector gateway.
 * Never imported by browser code (*.server.ts is blocked from client bundles).
 *
 * The gateway injects the connected account's identifiers — paths carry no
 * phone-number or account ID. Credentials stay server-side.
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

export interface WhatsAppConfig {
  /** Lovable gateway key (Authorization: Bearer). */
  token: string;
  /** Connector connection key (X-Connection-Api-Key). */
  connectionKey: string;
}

export function getWhatsAppConfig(): WhatsAppConfig | null {
  const token = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["WHATSAPP_API_KEY"];
  if (!token || !connectionKey) return null;
  return { token, connectionKey };
}

/** Digits only, no leading + or zeros — E.164 without '+'. */
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

async function postMessage(payload: Record<string, unknown>): Promise<{ id: string | null }> {
  const config = getWhatsAppConfig();
  if (!config) {
    throw new Error(
      "WhatsApp is not connected yet. Link the WhatsApp Business connector in Connectors settings.",
    );
  }

  const response = await fetch(`${GATEWAY_URL}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "X-Connection-Api-Key": config.connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

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

/** Send a document (e.g. the brochure PDF) by public link. */
export async function sendWhatsAppDocument(
  to: string,
  link: string,
  filename: string,
  caption?: string,
): Promise<{ id: string | null }> {
  return postMessage({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizeMsisdn(to),
    type: "document",
    document: { link, filename, ...(caption ? { caption } : {}) },
  });
}

export async function sendWhatsAppText(
  to: string,
  body: string,
): Promise<{ id: string | null }> {
  return postMessage({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizeMsisdn(to),
    type: "text",
    text: { preview_url: false, body },
  });
}
