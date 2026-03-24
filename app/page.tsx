import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Flame, ShoppingBag } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { images: true }
  });

  return (
    <div className="min-h-screen bg-[#faf9f6]">


      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=2000" 
              alt="Beautiful candles" 
              className="w-full h-full object-cover brightness-[0.85]"
            />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-lg">
              Illuminate Your Senses
            </h1>
            <p className="text-lg md:text-2xl mb-10 text-white/90 font-light max-w-2xl mx-auto drop-shadow-md">
              Hand-poured artisan candles crafted with premium soy wax and pure botanical fragrances.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/products/lavender-dreams" 
                className="bg-white text-gray-900 hover:bg-amber-50 px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2 transform hover:scale-105"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/admin" 
                className="bg-gray-900/60 hover:bg-gray-900 backdrop-blur text-white px-8 py-4 rounded-full font-semibold transition-all border border-white/20 transform hover:scale-105"
              >
                Go to Admin
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 flex flex-col items-center">
              <span className="text-amber-600 font-semibold tracking-widest uppercase mb-3 text-sm">New Arrivals</span>
              <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6 font-bold">Latest Collections</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden mb-5 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600"} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        Sold Out
                      </div>
                    )}
                    {(product.discount ?? 0) > 0 && product.stock > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                        -{product.discount}% OFF
                      </div>
                    )}
                    <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-lg hover:bg-gray-900 hover:text-white">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-col flex-1 px-1">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">{product.title}</h3>
                    <div className="flex items-center gap-3 mt-auto pt-2">
                       <span className="font-bold text-gray-900">₹{product.price - (product.discount ? (product.price * product.discount) / 100 : 0)}</span>
                       {(product.discount ?? 0) > 0 && (
                         <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                       )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {products.length === 0 && (
              <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-3xl border border-gray-100">
                <Leaf className="w-10 h-10 mx-auto text-gray-300 mb-4" />
                <p>No products available yet. Check back soon!</p>
              </div>
            )}
            
            {products.length > 0 && (
              <div className="mt-16 text-center">
                <Link href="/products" className="inline-flex items-center justify-center border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-full font-bold transition-all group">
                   View All Candles <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-amber-50 rounded-[40px] mx-4 mb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Why Deeksha Candles?</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <Leaf className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Natural Soy</h3>
                <p className="text-gray-600 leading-relaxed">
                  Eco-friendly, biodegradable, and burns cleaner than traditional paraffin wax.
                </p>
              </div>
              <div className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <Sparkles className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Fragrances</h3>
                <p className="text-gray-600 leading-relaxed">
                  Infused with pure essential oils and high-quality fragrance blends.
                </p>
              </div>
              <div className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <Flame className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Long Lasting Burn</h3>
                <p className="text-gray-600 leading-relaxed">
                  Carefully selected wicks ensure an even, slow burn that lasts hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
