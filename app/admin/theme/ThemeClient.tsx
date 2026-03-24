"use client";

import { useState } from "react";
import { saveThemeSettings } from "./actions";
import { Plus, Trash2, Save, Loader2, Link as LinkIcon, Phone, Mail, Megaphone } from "lucide-react";

export default function ThemeClient({ initialData }: any) {
  const [data, setData] = useState<any>(initialData || {
    navbar: [],
    footer: { shop: [], company: [], legal: [] },
    contact: { phone: "", email: "", announcement: "" }
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await saveThemeSettings(data);
    setLoading(false);
    if (!res?.success) alert("Failed: " + res?.error);
    else alert("Navigation menus and footer successfully published to storefront!");
  };

  const updateLink = (section: string, index: number, field: string, value: string) => {
    const copy = { ...data };
    if (section === "navbar") copy.navbar[index][field] = value;
    else copy.footer[section][index][field] = value;
    setData(copy);
  };

  const addLink = (section: string) => {
    const copy = { ...data };
    const newLink = { id: Date.now().toString(), label: "New Link", url: "/" };
    if (section === "navbar") copy.navbar.push(newLink);
    else copy.footer[section].push(newLink);
    setData(copy);
  };

  const removeLink = (section: string, index: number) => {
    const copy = { ...data };
    if (section === "navbar") copy.navbar.splice(index, 1);
    else copy.footer[section].splice(index, 1);
    setData(copy);
  };

  const updateContact = (field: string, value: string) => {
    setData({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const renderSection = (title: string, sectionKey: string) => {
    const arr = sectionKey === "navbar" ? data.navbar : data.footer[sectionKey];
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-gray-400" /> {title}
        </h3>
        <div className="space-y-3">
          {arr?.map((item: any, idx: number) => (
            <div key={item.id} className="flex gap-3 items-center">
              <input 
                type="text" 
                value={item.label} 
                onChange={e => updateLink(sectionKey, idx, "label", e.target.value)}
                className="flex-1 w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Label (e.g. Terms)"
              />
              <input 
                type="text" 
                value={item.url} 
                onChange={e => updateLink(sectionKey, idx, "url", e.target.value)}
                className="flex-1 w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="URL (e.g. /pages/terms)"
              />
              <button 
                onClick={() => removeLink(sectionKey, idx)}
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={() => addLink(sectionKey)}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors border border-amber-100/50"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Contact & Header Bar</h3>
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone number</label>
                 <input type="text" value={data.contact?.phone || ""} onChange={e => updateContact("phone", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="+91-9971459984" />
               </div>
               <div>
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Support Email</label>
                 <input type="text" value={data.contact?.email || ""} onChange={e => updateContact("email", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="support@deekshacandles.com" />
               </div>
               <div>
                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Megaphone className="w-3 h-3"/> Top Announcement Bar</label>
                 <input type="text" value={data.contact?.announcement || ""} onChange={e => updateContact("announcement", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="Free shipping on orders over ₹999!" />
               </div>
             </div>
           </div>
           
           {renderSection("Main Header Links", "navbar")}
        </div>

        <div className="space-y-6 border-l-0 md:border-l border-gray-100 md:pl-6">
           {renderSection("Footer - Shop Links", "shop")}
           {renderSection("Footer - Company Links", "company")}
           {renderSection("Footer - Legal Links", "legal")}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white/80 backdrop-blur-md px-8 py-5 border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-end z-20">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Settings
        </button>
      </div>
    </div>
  );
}
