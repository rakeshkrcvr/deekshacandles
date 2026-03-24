"use client";

import { useFormStatus } from "react-dom";
import { savePageAction } from "./actions";
import { Save, Loader2, ArrowLeft, Type, AlignLeft } from "lucide-react";
import Link from "next/link";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all shrink-0"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
      Save & Publish Page
    </button>
  );
}

export default function PageForm({ initialData }: { initialData?: any }) {
  return (
    <form action={savePageAction} className="space-y-8 pb-24">
      <input type="hidden" name="id" value={initialData?.id || ""} />
      
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/pages" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {initialData ? "Edit Protocol / Page" : "Create New Page"}
        </h1>
      </div>

      <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-3xl space-y-6">
        <div>
           <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center gap-2">
             <Type className="w-4 h-4 text-amber-500" /> Page Title
           </label>
           <input 
             required 
             type="text" 
             name="title" 
             defaultValue={initialData?.title} 
             placeholder="e.g. Terms and Conditions"
             className="w-full border-2 border-gray-100 bg-gray-50/50 p-4 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-lg font-semibold text-gray-900 transition-all"
           />
           <p className="text-sm text-gray-400 mt-2 font-medium">This automatically defines the URL (e.g. /pages/{initialData?.title || 'Terms_and_Conditions'})</p>
        </div>

        <div>
           <label className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center gap-2">
             <AlignLeft className="w-4 h-4 text-amber-500" /> Content Body (HTML Supported)
           </label>
           <textarea 
             required 
             name="body" 
             defaultValue={initialData?.body} 
             rows={15}
             placeholder="<p>Type your policies or about us content here...</p>"
             className="w-full border-2 border-gray-100 bg-gray-50/50 p-5 rounded-xl outline-none focus:border-amber-400 focus:bg-white font-mono text-sm leading-relaxed text-gray-800 transition-all resize-y"
           />
           <p className="text-sm text-gray-400 mt-2 font-medium">Use basic HTML blocks like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;br&gt; to format the content elegantly.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white/80 backdrop-blur-md px-8 py-5 border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-end z-20">
         <SubmitBtn />
      </div>
    </form>
  );
}
