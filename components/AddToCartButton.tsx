"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Plus, Minus, CheckCircle } from "lucide-react";

export default function AddToCartButton({ 
  product 
}: { 
  product: { id: string; title: string; price: number; image: string; stock: number } 
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2s
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex items-center justify-between border border-gray-300 rounded-2xl px-4 py-3 sm:w-1/3">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="text-lg font-medium text-gray-900">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        onClick={handleAdd}
        disabled={product.stock < 1}
        className={`flex-1 ${product.stock < 1 ? 'bg-gray-300 cursor-not-allowed' : added ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-2xl flex items-center justify-center gap-2 py-4 font-semibold text-lg transition-transform active:scale-[0.98] shadow-xl shadow-gray-900/20`}
      >
        {product.stock < 1 ? (
          "Out of Stock"
        ) : added ? (
          <>
             <CheckCircle className="w-5 h-5" />
             Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
