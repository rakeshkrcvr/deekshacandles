import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, ShoppingBag } from "lucide-react";
import { deleteProduct } from "../actions";
import ImportExportManager from "./ImportExportManager";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-2">Manage your candle catalog, inventory, and pricing.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <ImportExportManager />
          
          <Link href="/admin/products/new" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
            <Plus className="w-5 h-5" />
             New Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        {p.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.category ? (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          {p.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{p.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${p.stock > 10 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${p.id}/edit`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteProduct(p.id);
                        }}>
                          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                     <p className="font-semibold text-gray-900">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
