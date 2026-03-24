import Link from 'next/link';
import { Search, ShoppingBag, User, Phone, Mail } from 'lucide-react';

export default function Navbar({ theme }: { theme: any }) {
  return (
    <>
      <div className="bg-gray-900 text-white/90 text-xs font-medium py-2 px-4 flex flex-col sm:flex-row justify-between items-center z-50 relative gap-2 sm:gap-0">
        <div className="flex items-center gap-4">
          <a href={`tel:${theme?.contact?.phone || ""}`} className="flex items-center gap-1.5 hover:text-white transition"><Phone className="w-3.5 h-3.5" /> {theme?.contact?.phone || "+91-9971459984"}</a>
          <a href={`mailto:${theme?.contact?.email || ""}`} className="hidden sm:flex items-center gap-1.5 hover:text-white transition"><Mail className="w-3.5 h-3.5" /> {theme?.contact?.email || "deekshachauhancandles@gmail.com"}</a>
        </div>
        <div className="tracking-wide">
           {theme?.contact?.announcement || "✨ FREE SHIPPING ON PREPAID ORDERS"}
        </div>
      </div>

      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-gray-900 drop-shadow-sm flex-shrink-0">
              DEEKSHA CANDLES
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              {theme?.navbar?.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-amber-700 transition">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <button className="text-gray-700 hover:text-amber-700 transition p-1"><Search className="w-5 h-5" /></button>
              <button className="text-gray-700 hover:text-amber-700 transition p-1 hidden sm:block"><User className="w-5 h-5" /></button>
              
              <Link href="/cart" className="text-gray-700 hover:text-amber-700 transition p-1 relative flex items-center">
                <ShoppingBag className="w-[22px] h-[22px]" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 border border-white text-white text-[10px] font-bold w-4.5 h-4.5 px-1.5 py-0.5 rounded-full flex items-center justify-center shadow-sm">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
