"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Star, Truck, ShieldCheck, Heart, Share2, 
  Leaf, Info, ChevronDown, ChevronUp, ShoppingBag, Clock
} from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductClient({ product }: { product: any }) {
  const [mainImage, setMainImage] = useState(
    product.imageUrls?.[0] || 
    product.images?.[0]?.url || 
    "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1000"
  );
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  const imagesList = product.imageUrls?.length > 0 
    ? product.imageUrls 
    : product.images?.map((i: any) => i.url) || [];

  const finalImages = imagesList.length > 0 
    ? imagesList 
    : [
        mainImage,
        "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1000"
      ];

  const avgRating = 4.8;
  const reviewCount = product.reviews?.length || 128;
  const finalPrice = product.price - (product.discount ? (product.price * product.discount) / 100 : 0);

  let specs: any = {
    "Net Weight": "350gm",
    "Burn Time": "60hrs",
    "Wax Type": "Soy + Gel",
    "Fragrance": "Coffee & Oud",
    "Glass Dimensions": "3x2 inch"
  };

  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      try {
        specs = JSON.parse(product.specifications);
      } catch (e) {}
    } else {
      specs = product.specifications;
    }
  }

  return (
    <>
      <main className="max-w-7xl mx-auto md:px-8 md:py-12 flex flex-col md:flex-row gap-8 lg:gap-16 relative">
        {/* Gallery Section */}
        <section className="md:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square md:aspect-[4/5] bg-gray-100 overflow-hidden md:rounded-3xl shadow-sm border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={mainImage} 
              alt={product.title} 
              className="object-cover w-full h-full object-center hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            {product.offerTag && (
               <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                {product.offerTag}
              </div>
            )}
            {!product.offerTag && product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                -{product.discount}% OFF
              </div>
            )}
            <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-700 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 px-4 md:px-0 overflow-x-auto snap-x hide-scrollbar pb-2">
            {finalImages.map((img: string, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-amber-500 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Product Info Section */}
        <section className="md:w-1/2 px-5 md:px-0 flex flex-col py-2 lg:py-6">
          {product.category && (
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
          )}
          
          <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 mb-3 leading-tight">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-700 font-medium">{reviewCount} Reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight">
              ₹{finalPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-xl text-gray-400 line-through mb-1.5 font-light">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Triple Treat Alert */}
          {product.tripleTreatAlert && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 items-start mb-6">
              <span className="text-2xl mt-0.5">🎁</span>
              <div>
                <h4 className="font-bold text-red-800 text-sm tracking-wide uppercase mb-1">Triple Treat Alert</h4>
                <p className="text-red-700/90 text-sm leading-relaxed font-medium">
                  {product.tripleTreatAlert}
                </p>
              </div>
            </div>
          )}

          {/* Countdown timer */}
          {product.countdownExpiry && (
             <div className="flex items-center gap-2 text-red-600 bg-red-50/50 px-4 py-3 rounded-xl border border-red-100 mb-6 font-medium text-sm">
               <Clock className="w-5 h-5" />
               Ends Soon! Offer expires in 04:23:45
             </div>
          )}

          <p className="text-gray-600 leading-relaxed mb-8 text-[15px] lg:text-lg">
            {product.description || "Indulge in the calming aura of our hand-poured artisan candles. Crafted thoughtfully with premium soy wax and infused with rich botanical fragrances to elevate your space and soothe your mind."}
          </p>

          <hr className="border-gray-100 mb-8" />

          {/* Icon Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
             <div className="flex items-center gap-2 px-4 py-2 bg-amber-50/50 border border-amber-100 rounded-full text-amber-900 text-sm font-semibold shadow-sm">
                <Leaf className="w-4 h-4 text-emerald-600" />
                100% Pure Soy
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-800 text-sm font-semibold shadow-sm">
                <Info className="w-4 h-4 text-blue-600" />
                Handmade in India
             </div>
          </div>

          {/* Specifications JSON Rendering */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-gray-100 pb-2">Crafting Specifications</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-500 mb-0.5">{key}</span>
                  <span className="font-semibold text-gray-900">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Actions (Desktop) */}
          <div className="hidden md:block mb-8">
            <AddToCartButton 
              product={{
                id: product.id,
                title: product.title,
                price: finalPrice,
                image: mainImage,
                stock: product.stock,
              }}
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50/80 text-orange-900 border border-orange-100/50">
              <Truck className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-bold text-sm">Delivery Estimate</p>
                <p className="text-xs text-orange-700/80 font-medium">{product.deliveryEstimate || "4-7 Business Days"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/80 text-emerald-900 border border-emerald-100/50">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-bold text-sm">Quality Promise</p>
                <p className="text-xs text-emerald-700/80 font-medium">Hassle-Free Returns</p>
              </div>
            </div>
          </div>
          
        </section>
      </main>

      {/* Sticky Mobile Buy Now Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Total Price</span>
            <span className="text-xl font-bold text-gray-900">₹{finalPrice}</span>
         </div>
         <button onClick={() => alert("Add to Cart Logic Hooked up inside store")} className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-gray-900/20 active:scale-95 transition-all flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Buy Now
         </button>
      </div>
    </>
  );
}
