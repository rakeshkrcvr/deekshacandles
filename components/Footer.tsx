import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
export default function Footer({ theme }: { theme?: any }) {

  return (
    <footer className="bg-stone-50 pt-20 pb-10 border-t border-gray-200 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold text-gray-900 mb-4 block">
              DEEKSHA CANDLES
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
              Handcrafted with love and 100% pure organic soy & gel wax. Light up your special moments with our premium, eco-friendly scented candles.
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              {theme.contact?.phone && <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-700" /> {theme.contact.phone}</p>}
              {theme.contact?.email && <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-700" /> {theme.contact.email}</p>}
              <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-700" /> New Delhi, India</p>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all shadow-sm"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all shadow-sm"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all shadow-sm"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-5 font-serif uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {theme.footer?.shop?.length > 0 ? (
                theme.footer.shop.map((link: any) => (
                  <li key={link.id}><Link href={link.url} className="hover:text-amber-700 transition">{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/" className="hover:text-amber-700 transition">Home</Link></li>
                  <li><Link href="/products?category=mini" className="hover:text-amber-700 transition">Mini Candle</Link></li>
                  <li><Link href="/products?filter=new" className="hover:text-amber-700 transition">New Arrivals</Link></li>
                  <li><Link href="/products" className="hover:text-amber-700 transition">All Products</Link></li>
                  <li><Link href="/collections" className="hover:text-amber-700 transition">All Collections</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-5 font-serif uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {theme.footer?.company?.length > 0 ? (
                theme.footer.company.map((link: any) => (
                  <li key={link.id}><Link href={link.url} className="hover:text-amber-700 transition">{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/collections" className="hover:text-amber-700 transition">All collections</Link></li>
                  <li><Link href="/products?category=gifts" className="hover:text-amber-700 transition">Gifts</Link></li>
                  <li><Link href="/products?category=jelly" className="hover:text-amber-700 transition">Jelly Candles</Link></li>
                  <li><Link href="/products?category=scented" className="hover:text-amber-700 transition">Scented Candles</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-5 font-serif uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {theme.footer?.legal?.length > 0 ? (
                theme.footer.legal.map((link: any) => (
                  <li key={link.id}><Link href={link.url} className="hover:text-amber-700 transition">{link.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/search" className="hover:text-amber-700 transition">Search</Link></li>
                  <li><Link href="/about" className="hover:text-amber-700 transition">About Us</Link></li>
                  <li><Link href="/terms" className="hover:text-amber-700 transition">Terms & Conditions</Link></li>
                  <li><Link href="/shipping" className="hover:text-amber-700 transition">Shipping Policy</Link></li>
                  <li><Link href="/returns" className="hover:text-amber-700 transition flex flex-col"><span>Returns Refunds and</span><span>Cancellations Policy</span></Link></li>
                  <li><Link href="/blogs" className="hover:text-amber-700 transition mt-1 block">Blogs</Link></li>
                  <li><Link href="/contact" className="hover:text-amber-700 transition">Contact Us</Link></li>
                </>
              )}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-200 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Deeksha Candles. All Rights Reserved.</p>
          <div className="flex gap-2 items-center opacity-80">
            <div className="h-6 w-10 bg-gray-200 rounded shrink-0 flex items-center justify-center font-bold text-[8px] text-gray-500">VISA</div>
            <div className="h-6 w-10 bg-gray-200 rounded shrink-0 flex items-center justify-center font-bold text-[8px] text-gray-500">MC</div>
            <div className="h-6 w-10 bg-gray-200 rounded shrink-0 flex items-center justify-center font-bold text-[8px] text-gray-500">UPI</div>
            <div className="h-6 w-10 bg-gray-200 rounded shrink-0 flex items-center justify-center font-bold text-[8px] text-gray-500">RPAY</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
