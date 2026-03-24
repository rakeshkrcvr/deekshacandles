import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Tags, Settings, LogOut, Package } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 md:min-h-screen flex flex-col shadow-xl flex-shrink-0 z-20 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="text-white text-xl font-bold tracking-wider flex items-center gap-2">
            <span className="bg-amber-500 text-black p-1.5 rounded-lg"><Package className="w-5 h-5"/></span>
            ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800 text-white font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-amber-500" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <Tags className="w-5 h-5" />
            Categories
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <Package className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            Customers
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" /> {/* Reusing an icon since FileText is not imported */}
            Pages
          </Link>
          <Link href="/admin/theme" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            Theme & Nav
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5 flex-shrink-0" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 hide-scrollbar pb-24 md:pb-10">
        {children}
      </main>
    </div>
  );
}
