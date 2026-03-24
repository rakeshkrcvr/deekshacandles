"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Star, Heart, Truck, Clock, 
  RotateCcw, Droplets, Box, Leaf, ChevronDown, ChevronUp,
  ShieldCheck, ArrowRight, CheckCircle2, ShoppingCart
} from "lucide-react";
import CartNavbarIcon from "@/components/CartNavbarIcon";
// Since AddToCartButton might be custom, we will implement one here or use a dummy for visual
// Let's assume we just want an awesome landing page UI

const images = [
  "https://images.unsplash.com/photo-1609175225301-382103f5adba?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1605369680373-b3c1d9b33a57?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&q=80&w=1000"
];

export default function IcedCoffeeCandleLanding() {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 45, seconds: 12 });
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [isMobileFixed, setIsMobileFixed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsMobileFixed(true);
      } else {
        setIsMobileFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const toggleAccordion = (val: string) => {
    setOpenAccordion(openAccordion === val ? null : val);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24 font-sans text-stone-900 overflow-x-hidden selection:bg-amber-200">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Sticky Urgency Header */}
      <div className="bg-amber-900 text-amber-50 text-sm font-semibold py-2.5 overflow-hidden whitespace-nowrap sticky top-0 z-50 shadow-md">
        <div className="animate-marquee flex gap-8 whitespace-nowrap w-max">
          <span className="flex items-center gap-2">🔥 Buy 1 Get 3 Free – Best Deal!</span>
          <span className="flex items-center gap-2">🚚 COD Available</span>
          <span className="flex items-center gap-2">🔄 Hassle-Free Returns</span>
          
          {/* Duplicate for seamless infinite loop */}
          <span className="flex items-center gap-2">🔥 Buy 1 Get 3 Free – Best Deal!</span>
          <span className="flex items-center gap-2">🚚 COD Available</span>
          <span className="flex items-center gap-2">🔄 Hassle-Free Returns</span>
        </div>
      </div>

      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-[40px] z-40">
        <Link href="/" className="p-2 hover:bg-stone-100 rounded-full transition-colors active:scale-95">
          <ArrowLeft className="w-5 h-5 text-stone-700" />
        </Link>
        <span className="font-bold text-sm tracking-widest uppercase text-stone-800">
          Deeksha
        </span>
        <CartNavbarIcon />
      </nav>

      <main className="max-w-6xl mx-auto md:px-8 md:py-8 flex flex-col md:flex-row gap-8 lg:gap-14">
        
        {/* Gallery Section */}
        <section className="md:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-[4/5] md:aspect-square bg-stone-100 overflow-hidden md:rounded-3xl cursor-zoom-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeImage} 
              alt="Iced Coffee Scented Candle" 
              className="object-cover w-full h-full object-center transition-opacity duration-300"
            />
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-lg">
              Save 50%
            </div>
            <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur shadow-sm rounded-full text-stone-500 hover:text-red-500 hover:scale-110 transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Thumbnail Slider */}
          <div className="flex gap-3 px-4 md:px-0 overflow-x-auto hide-scrollbar snap-x pb-2 pt-1">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden cursor-pointer snap-start transition-all transform ${activeImage === img ? 'ring-2 ring-amber-800 ring-offset-2 scale-95' : 'opacity-80 hover:opacity-100'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Product Details Section */}
        <section className="md:w-1/2 px-5 md:px-0 flex flex-col pb-8">
          
          {/* Reviews Badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs font-semibold text-stone-600 underline cursor-pointer hover:text-stone-900">
              4.9 (1,284 Reviews)
            </span>
            <span className="bg-stone-200 text-stone-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ml-2">
              Best Seller
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-4 leading-[1.15] tracking-tight">
            Iced Coffee Scented Candle <span className="block text-2xl md:text-3xl font-medium text-stone-500 mt-2">– Premium Soy & Gel Wax</span>
          </h1>
          
          {/* Pricing Box */}
          <div className="flex flex-col gap-1 mb-5">
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter">
                ₹599
              </span>
              <span className="text-xl md:text-2xl text-stone-400 line-through font-medium mb-1">
                ₹1,198
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-600">You save ₹599 (50%)</p>
          </div>

          {/* Scarcity Timer */}
          <div className="bg-amber-100/50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <Clock className="w-5 h-5 animate-pulse text-amber-600" />
              <span>Hurry up! Offer expires in:</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-white border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg font-mono font-bold w-12 text-center shadow-sm">
                {formatTime(timeLeft.hours)}
              </div>
              <span className="text-amber-800 font-bold self-center">:</span>
              <div className="bg-white border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg font-mono font-bold w-12 text-center shadow-sm">
                {formatTime(timeLeft.minutes)}
              </div>
              <span className="text-amber-800 font-bold self-center">:</span>
              <div className="bg-amber-800 text-white px-3 py-1.5 rounded-lg font-mono font-bold w-12 text-center shadow-md animate-pulse">
                {formatTime(timeLeft.seconds)}
              </div>
            </div>
          </div>

          {/* Offer Box */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl p-6 mb-8 transform hover:-translate-y-1 transition-transform shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎁</span>
              <h3 className="text-lg font-black tracking-wide text-amber-300">TRIPLE TREAT ALERT!</h3>
            </div>
            <p className="font-bold text-2xl uppercase tracking-wider mb-2">BUY 2 GET 2 FREE</p>
            <p className="text-stone-300 text-sm">Add 4 candles to your cart. Discount applies automatically at checkout.</p>
          </div>

          {/* Desktop Buy Button */}
          <div className="hidden md:block mb-8">
            <button className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xl py-5 rounded-full shadow-lg shadow-amber-900/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              ADD TO CART NOW
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-center text-xs text-stone-500 mt-3 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed Safe & Secure Checkout
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">100% Soy Wax</p>
                <p className="text-xs text-stone-500">Pure & Eco-friendly</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Long Lasting</p>
                <p className="text-xs text-stone-500">Upto 60 Hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Tall Glass Jar</p>
                <p className="text-xs text-stone-500">Dimensions: 3" x 2"</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900">Sensory Aroma</p>
                <p className="text-xs text-stone-500">Coffee & Rich Oud</p>
              </div>
            </div>
          </div>

          {/* Delivery Estimate Box */}
          <div className="flex items-center gap-4 bg-stone-100 p-4 rounded-xl mb-8 border border-stone-200">
            <Truck className="w-8 h-8 text-stone-700" />
            <div>
              <p className="font-semibold text-stone-900 text-sm">Estimated Delivery</p>
              <p className="text-stone-600 text-sm font-medium">
                Order now to get it by <span className="font-bold text-amber-800">Thursday, 26 Mar - 02 Apr</span>
              </p>
            </div>
          </div>

          <hr className="border-stone-200 mb-8" />

          {/* Accordions */}
          <div className="flex flex-col gap-3">
            {/* Details Tab */}
            <div className="border border-stone-200 rounded-xl bg-white overflow-hidden">
              <button 
                onClick={() => toggleAccordion('details')}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors font-bold text-stone-800"
              >
                <span>Product Details & Description</span>
                {openAccordion === 'details' ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>
              {openAccordion === 'details' && (
                <div className="p-4 pt-0 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                  <p className="mb-3">Start your morning right with the ultimate <strong>Iced Coffee Scented Candle</strong>. Designed to look exactly like your favorite creamy iced latte, this stunning piece of home decor combines aesthetics with a powerful, mood-lifting aroma.</p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <strong>Bottom Layer:</strong> High-quality transparent gel wax shaped to resemble ice cubes floating in rich cold brew.</li>
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <strong>Top Layer:</strong> Piped 100% natural soy wax looking like a delicious dollop of whipped cream.</li>
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> <strong>Fragrance Notes:</strong> Freshly roasted espresso beans, a hint of vanilla cream, and deep, grounding oud wood.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Shipping Tab */}
            <div className="border border-stone-200 rounded-xl bg-white overflow-hidden">
              <button 
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors font-bold text-stone-800"
              >
                <span>Shipping & Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="p-4 pt-0 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                  <p className="mb-2"><strong>Standard Delivery:</strong> 4-7 business days via premium courier partners.</p>
                  <p className="mb-2"><strong>Cash on Delivery:</strong> Available on all orders with NO hidden fees.</p>
                  <p><strong>Returns:</strong> 7-day hassle-free replacement in case of transit damage. We pack our candles with extreme care utilizing 3-layer bubble wrap.</p>
                </div>
              )}
            </div>

            {/* Guarantee Tab */}
            <div className="border border-stone-200 rounded-xl bg-white overflow-hidden">
              <button 
                onClick={() => toggleAccordion('guarantee')}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors font-bold text-stone-800"
              >
                <span>Our Guarantee</span>
                {openAccordion === 'guarantee' ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>
              {openAccordion === 'guarantee' && (
                <div className="p-4 pt-0 text-stone-600 text-sm leading-relaxed border-t border-stone-100 flex flex-col gap-3">
                   <div className="flex gap-3">
                     <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                     <p>We believe in our products 100%. If you aren't absolutely delighted with your purchase, contact us within 30 days for a stress-free resolution.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Buy Now / Add to Cart for Mobile */}
      {isMobileFixed && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 md:hidden animate-in slide-in-from-bottom-full duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-stone-900 text-lg">Iced Coffee Candle</span>
            <span className="font-black text-red-600 text-xl">₹599</span>
          </div>
          <button className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ShoppingCart className="w-5 h-5" />
            BUY NOW
          </button>
        </div>
      )}
      {!isMobileFixed && (
        <div className="md:hidden px-4 mt-8 pb-8">
          <button className="w-full bg-amber-900 text-white font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ShoppingCart className="w-5 h-5" />
            ADD TO CART
          </button>
        </div>
      )}
    </div>
  );
}
