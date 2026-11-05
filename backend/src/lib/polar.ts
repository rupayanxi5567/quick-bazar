import type { Env } from "./env.js";

type CheckoutCreateBody = {
  products?: string[];
  product_id?: string;
  amount?: number;
  custom_price_amount?: number;
  currency?: string;
  prices?: Record<string, any>;
  success_url: string;
  return_url?: string;
  external_customer_id?: string;
  customer_email?: string;
  metadata?: Record<string, string | number | boolean>;
};

export async function polarCreateCheckout(env: Env, body: CheckoutCreateBody) {
  const token = env.POLAR_ACCESS_TOKEN;
  if (!token) throw new Error("POLAR_ACCESS_TOKEN is not configured");

  const res = await fetch(`${env.POLAR_API_BASE}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    // Terminal-এ Polar-এর আসল Validation Error প্রিন্ট করবে
    console.error("Polar API Error Response:", errText); 
    throw new Error(`Polar checkout failed: ${res.status} ${errText}`);
  }

  const data = (await res.json()) as { id: string; url: string };
  return { id: data.id, url: data.url };
}