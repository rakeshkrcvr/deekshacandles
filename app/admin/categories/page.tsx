import prisma from "@/lib/prisma";
import { Tags, Trash2, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
        <p className="text-gray-500 mt-2">Organize your products into logical categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <form action={handleCreate} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" /> Add Category
            </h2>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Name</label>
              <input required name="name" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Soy Candles" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Slug</label>
              <input required name="slug" type="text" className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="soy-candles" />
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-medium transition-all text-sm mt-2">
              Save Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length > 0 ? (
                 categories.map(c => (
                   <tr key={c.id}>
                     <td className="px-6 py-4 font-medium text-gray-900 flex flex-col">
                       <span>{c.name}</span>
                       <span className="text-xs text-gray-400 font-normal">/{c.slug}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <form action={handleDelete}>
                          <input type="hidden" name="id" value={c.id} />
                          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                     </td>
                   </tr>
                 ))
              ) : (
                <tr>
                   <td colSpan={2} className="px-6 py-8 text-center text-gray-500">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
