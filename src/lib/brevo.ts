import "server-only";
import type { Product } from "@/types/product";

const API_BASE = "https://api.brevo.com/v3";

export type ProductAnnouncement = Pick<
  Product,
  "id" | "slug" | "signerName" | "sport" | "condition" | "description" | "price" | "imageUrl"
>;

function apiKey() {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY is not configured");
  return key;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/** Adds (or updates) a contact on our subscriber list. Idempotent — safe to call for existing contacts. */
export async function addSubscriber(email: string): Promise<void> {
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!listId) throw new Error("BREVO_LIST_ID is not configured");

  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo addSubscriber failed (${res.status}): ${body}`);
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function buildProductCard(product: ProductAnnouncement): string {
  const productUrl = `${siteUrl()}/products/${product.slug}`;
  const price = `$${product.price.toLocaleString()}`;

  return `
    <div style="padding:24px; text-align:center; border-bottom:1px solid #e1e1e1;">
      ${
        product.imageUrl
          ? `<img src="${product.imageUrl}" alt="${product.signerName}" width="432" style="width:100%; max-width:432px; display:block; margin:0 auto 16px;" />`
          : ""
      }
      <h2 style="margin:0 0 4px; font-size:20px; color:#111111;">${product.signerName}</h2>
      <p style="margin:0 0 12px; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#666666;">
        ${product.sport} &middot; ${product.condition}
      </p>
      <p style="margin:0 0 16px; font-size:14px; line-height:1.5; color:#333333;">
        ${truncate(product.description, 160)}
      </p>
      <p style="margin:0 0 20px; font-size:18px; font-weight:bold; color:#1b3f8f;">${price}</p>
      <a href="${productUrl}"
         style="display:inline-block; background:#f4c400; color:#111111; font-weight:bold; font-size:14px; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:14px 32px; border-radius:999px;">
        Shop This Piece
      </a>
    </div>
  `;
}

function buildDigestHtml(products: ProductAnnouncement[]): string {
  const eyebrow = products.length > 1 ? "New Arrivals" : "New Arrival";

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#eaeaea; padding:24px 0;">
      <div style="max-width:480px; margin:0 auto; background:#ffffff; border:1px solid #e1e1e1;">
        <div style="background:#111111; padding:20px; text-align:center;">
          <span style="color:#ffffff; font-size:18px; font-weight:bold; letter-spacing:1px;">
            ON DEMAND ORIGINALS
          </span>
        </div>
        <div style="padding:8px 0 16px; text-align:center; background:#eaeaea;">
          <span style="display:inline-block; margin-top:16px; color:#f4c400; background:#111111; font-size:11px; font-weight:bold; letter-spacing:2px; padding:6px 14px; text-transform:uppercase;">
            ${eyebrow}
          </span>
        </div>
        ${products.map((p) => buildProductCard(p)).join("")}
        <div style="padding:16px 24px; text-align:center;">
          <a href="{{ unsubscribe }}" style="font-size:11px; color:#999999;">Unsubscribe</a>
        </div>
      </div>
    </div>
  `;
}

function digestSubject(products: ProductAnnouncement[]): string {
  if (products.length === 1) {
    return `New Arrival: ${products[0].signerName} Signed ${products[0].sport} Memorabilia`;
  }
  return `${products.length} New Arrivals at On Demand Originals`;
}

/** Creates and immediately sends one campaign announcing one or more newly-published products to the full list. */
export async function sendProductDigestCampaign(products: ProductAnnouncement[]): Promise<void> {
  if (products.length === 0) return;

  const listId = Number(process.env.BREVO_LIST_ID);
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!listId) throw new Error("BREVO_LIST_ID is not configured");
  if (!senderEmail) throw new Error("BREVO_SENDER_EMAIL is not configured");

  const createRes = await fetch(`${API_BASE}/emailCampaigns`, {
    method: "POST",
    headers: {
      "api-key": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `New arrivals digest (${new Date().toISOString()})`,
      subject: digestSubject(products),
      sender: { name: "On Demand Originals", email: senderEmail },
      type: "classic",
      htmlContent: buildDigestHtml(products),
      recipients: { listIds: [listId] },
    }),
  });

  if (!createRes.ok) {
    const body = await createRes.text().catch(() => "");
    throw new Error(`Brevo campaign creation failed (${createRes.status}): ${body}`);
  }

  const { id } = (await createRes.json()) as { id: number };

  const sendRes = await fetch(`${API_BASE}/emailCampaigns/${id}/sendNow`, {
    method: "POST",
    headers: { "api-key": apiKey() },
  });

  if (!sendRes.ok) {
    const body = await sendRes.text().catch(() => "");
    throw new Error(`Brevo campaign send failed (${sendRes.status}): ${body}`);
  }
}
