"use server";

import prisma from "@/lib/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function initiateRazorpayOrder(amount: number) {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
  
  if (!settings?.razorpayKeyId || !settings?.razorpaySecret) {
    return { error: "Razorpay not configured", isCashOnDelivery: true };
  }

  const razorpay = new Razorpay({
    key_id: settings.razorpayKeyId,
    key_secret: settings.razorpaySecret,
  });

  const options = {
    amount: Math.round(amount * 100), // in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return { orderId: order.id, keyId: settings.razorpayKeyId };
  } catch (error) {
    console.error("Razorpay initiation failed", error);
    return { error: "Payment initiation failed", isCashOnDelivery: true };
  }
}

export async function verifyAndCompleteOrder(
  paymentData: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string } | null,
  formData: FormData, 
  cartItems: {id: string, price: number, quantity: number, title: string}[]
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;

  if (!email || cartItems.length === 0) {
    throw new Error("Invalid checkout data.");
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
  let paymentId = null;

  // Verify Razorpay signature if payment is made
  if (paymentData && settings?.razorpaySecret) {
    const body = paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', settings.razorpaySecret).update(body.toString()).digest('hex');
    if (expectedSignature !== paymentData.razorpay_signature) {
      throw new Error("Invalid payment signature");
    }
    paymentId = paymentData.razorpay_payment_id;
  }

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Use a transaction
  const order = await prisma.$transaction(async (tx) => {
    let user = await tx.user.findUnique({ where: { email } });
    if (!user) {
      user = await tx.user.create({ data: { name, email } });
    }

    const newOrder = await tx.order.create({
      data: {
        total,
        userId: user.id,
        status: paymentId ? "paid" : "pending",
        paymentId: paymentId,
        items: {
          create: cartItems.map(item => ({
            productId: item.id,
            price: item.price,
            quantity: item.quantity,
          }))
        },
        address: {
          create: { fullName: name, phone, address, city, state, pincode }
        }
      },
      include: {
        address: true,
        items: true
      }
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return newOrder;
  });

  // Sync with Shiprocket
  if (settings?.shiprocketEmail && settings?.shiprocketPassword) {
    try {
      // 1. Get Auth Token
      const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: settings.shiprocketEmail, password: settings.shiprocketPassword })
      });
      
      if (authRes.ok) {
        const { token } = await authRes.json();
        
        // 2. Create Order in Shiprocket
        const srOrder = {
          order_id: order.id,
          order_date: new Date().toISOString().slice(0, 10),
          pickup_location: "Primary", // Requires proper valid pickup location assigned in SR Dashboard
          billing_customer_name: name,
          billing_last_name: "",
          billing_address: address,
          billing_city: city,
          billing_pincode: pincode,
          billing_state: state,
          billing_country: "India",
          billing_email: email,
          billing_phone: phone,
          shipping_is_billing: true,
          order_items: cartItems.map(item => ({
            name: item.title,
            sku: item.id,
            units: item.quantity,
            selling_price: item.price
          })),
          payment_method: paymentId ? "Prepaid" : "COD",
          sub_total: total,
          length: 10, breadth: 10, height: 10, weight: 0.5 // Default dimensions
        };

        const createRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
           method: "POST",
           headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
           body: JSON.stringify(srOrder)
        });

        if (createRes.ok) {
           const srData = await createRes.json();
           await prisma.order.update({
             where: { id: order.id },
             data: { shiprocketOrderId: srData.order_id?.toString() || srData.shipment_id?.toString() }
           });
        }
      }
    } catch (err) {
      console.error("Shiprocket sync failed:", err);
      // Fails silently for user, but order is saved
    }
  }

  return order.id;
}
