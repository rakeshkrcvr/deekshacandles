"use client";

import { useCartStore } from "@/store/cart";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { initiateRazorpayOrder, verifyAndCompleteOrder } from "./actions";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Cart is empty</h2>
        <Link href="/" className="text-amber-600 font-semibold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      const cartData = items.map(i => ({ id: i.id, price: i.price, quantity: i.quantity, title: i.title }));
      
      // Step 1: Initiate Razorpay
      const { orderId, keyId, isCashOnDelivery, error } = await initiateRazorpayOrder(totalAmount);

      if (isCashOnDelivery) {
        // Fallback or intentionally COD
        const finalId = await verifyAndCompleteOrder(null, formData, cartData);
        if (finalId) {
          clearCart();
          router.push("/checkout/success");
        }
        return;
      }

      if (error || !orderId) {
        alert(error || "Payment failed to initiate");
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay window
      const options = {
        key: keyId,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Deeksha Candles",
        description: "Candles Order",
        order_id: orderId,
        handler: async function (response: any) {
           // Step 3: Verify and capture order server side
           try {
             const finalId = await verifyAndCompleteOrder(
               {
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_signature: response.razorpay_signature
               },
               formData,
               cartData
             );
             if (finalId) {
               clearCart();
               router.push("/checkout/success");
             }
           } catch (err) {
             console.error("Verification failed", err);
             alert("Payment verification failed. Please contact support.");
             setLoading(false);
           }
        },
        prefill: {
          name: formData.get("name"),
          email: formData.get("email"),
          contact: formData.get("phone"),
        },
        theme: { color: "#F59E0B" } // Amber 500
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function(response: any) {
         console.error(response.error);
         alert("Payment failed.");
         setLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <span className="font-semibold text-sm tracking-widest uppercase text-gray-800">
          Secure Checkout
        </span>
        <div className="w-9" />
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col-reverse md:flex-row gap-8">
        <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Details</h2>
          <form id="checkoutForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input required name="name" type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input required name="email" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="johndoe@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input required name="phone" type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="+91 98765 43210" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
              <textarea required name="address" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="123 Street Name..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input required name="city" type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input required name="state" type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="Maharashtra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input required name="pincode" type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="400001" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all"
              >
                {loading ? "Processing..." : "Pay Now securely"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full md:w-96 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
          <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
