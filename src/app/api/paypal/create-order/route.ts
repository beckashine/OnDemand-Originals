import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPayPalOrder } from "@/lib/paypal";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

type RequestItem = { productId: string; quantity: number };

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`checkout-create:${ip}`, 10)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: { items?: RequestItem[]; customer?: CustomerInfo };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = body.items;
  const customer = body.customer;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (
    !customer ||
    !customer.fullName ||
    !customer.email ||
    !customer.phone ||
    !customer.addressLine1 ||
    !customer.city ||
    !customer.state ||
    !customer.zip ||
    !customer.country
  ) {
    return NextResponse.json({ error: "Missing required customer information" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const productIds = items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, quantity, published")
    .in("id", productIds);

  if (productsError || !products) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }

  // Recompute the total from real database prices — never trust a client-supplied amount.
  let total = 0;
  const orderItems: {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.published) {
      return NextResponse.json({ error: "One or more items are no longer available" }, { status: 400 });
    }
    if (item.quantity < 1 || item.quantity > product.quantity) {
      return NextResponse.json(
        { error: `${product.name} does not have enough stock available` },
        { status: 400 }
      );
    }
    total += product.price * item.quantity;
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
    });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customer.fullName,
      customer_email: customer.email,
      shipping_address: {
        phone: customer.phone,
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2 || "",
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        country: customer.country,
      },
      subtotal: total,
      total,
      payment_status: "pending",
      fulfillment_status: "unfulfilled",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
  }

  let paypalOrderId: string;
  try {
    paypalOrderId = await createPayPalOrder(total);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create PayPal order" },
      { status: 500 }
    );
  }

  await supabase.from("orders").update({ paypal_order_id: paypalOrderId }).eq("id", order.id);

  return NextResponse.json({ orderId: order.id, paypalOrderId });
}
