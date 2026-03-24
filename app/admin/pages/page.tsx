import prisma from "@/lib/prisma";
import Link from "next/link";
import { Edit3, Plus, Trash2, FileText, ExternalLink } from "lucide-react";
import { deletePageAction } from "./actions";

export default async function PagesList() {
  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const pages = await prisma.content.findMany();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-500" /> Custom Pages 
          </h1>
          <p className="text-gray-500 mt-1">Manage standard pages like About Us, Terms, and Policies.</p>
        </div>
        <Link href="/admin/pages/new" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-sm font-semibold shrink-0">
          <Plus className="w-5 h-5" /> Add New Page
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Page Title</th>
              <th className="p-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Public URL Path</th>
              <th className="p-5 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-amber-50/30 transition">
                <td className="p-5 font-semibold text-gray-900">{p.title}</td>
                <td className="p-5 text-gray-500 font-mono text-[13px] truncate">
                  <div className="bg-gray-100/70 inline-block px-3 py-1.5 rounded-lg border border-gray-200">
                    /pages/{generateSlug(p.title)}
                  </div>
                </td>
                <td className="p-5 flex gap-2 justify-end">
                  <a href={`/pages/${generateSlug(p.title)}`} target="_blank" className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="View Public Page">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link href={`/admin/pages/${p.id}/edit`} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <form action={async () => { "use server"; await deletePageAction(p.id); }}>
                    <button type="submit" className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
               <tr><td colSpan={3} className="p-10 text-center text-gray-500">No custom pages added yet. Click 'Add New Page' to create your first policy or about page.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
