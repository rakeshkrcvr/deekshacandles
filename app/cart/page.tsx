"use client";

import { useCartStore } from "@/store/cart";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <span className="font-semibold text-sm tracking-widest uppercase text-gray-800">
          Your Cart
        </span>
        <div className="w-9" /> {/* Spacer */}
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 mt-4 text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any candles to your cart yet.</p>
            <Link href="/" className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl flex gap-4 border border-gray-100 items-center shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                    <p className="text-amber-600 font-medium mb-3">₹{item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl w-max">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-80 h-fit bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white py-4 rounded-xl flex justify-center font-bold text-lg shadow-xl shadow-gray-900/20 transition-all">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
