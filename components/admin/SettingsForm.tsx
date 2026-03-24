"use client";

import { Save, CreditCard, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { updateStoreSettings } from "@/app/admin/settings/actions";

export default function SettingsForm({ settings }: { settings: any }) {
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings?.razorpayKeyId || "");
  const [razorpaySecret, setRazorpaySecret] = useState(settings?.razorpaySecret || "");
  const [shiprocketEmail, setShiprocketEmail] = useState(settings?.shiprocketEmail || "");
  const [shiprocketPassword, setShiprocketPassword] = useState(settings?.shiprocketPassword || "");

  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.source !== window || !event.data || event.data.type !== "EXT_CREDENTIALS") {
        return;
      }

      console.log("Received credentials from extension:", event.data);
      const data = event.data.data;

      if (data.razorpayKeyId) setRazorpayKeyId(data.razorpayKeyId);
      if (data.razorpaySecret) setRazorpaySecret(data.razorpaySecret);
      if (data.shiprocketEmail) setShiprocketEmail(data.shiprocketEmail);
      if (data.shiprocketPassword) setShiprocketPassword(data.shiprocketPassword);
      
      alert(`Auto-filled credentials from ${data.source}! Please save the integration.`);
    };

    window.addEventListener("message", handleExtensionMessage);
    return () => window.removeEventListener("message", handleExtensionMessage);
  }, []);

  const handleQuickSetup = () => {
    // Notify the extension to start scraping
    window.postMessage({ type: "START_QUICK_SETUP" }, "*");
    
    // Fallback: Just open the windows for manual setup if extension isn't running
    window.open("https://dashboard.razorpay.com/app/keys", "_blank");
    window.open("https://app.shiprocket.in/api-settings", "_blank");
  };

  return (
    <form action={updateStoreSettings} className="space-y-8">
      {/* Razorpay Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
          <CreditCard className="w-6 h-6 text-blue-500" /> Razorpay Integration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key ID</label>
            <input 
              name="razorpayKeyId" 
              value={razorpayKeyId} 
              onChange={(e) => setRazorpayKeyId(e.target.value)} 
              type="password" 
              placeholder="rzp_test_xxxxxx" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Secret</label>
            <input 
              name="razorpaySecret" 
              value={razorpaySecret} 
              onChange={(e) => setRazorpaySecret(e.target.value)} 
              type="password" 
              placeholder="xxxxxxxxxxxx" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">Leaving these blank will revert checkout to "Cash on Delivery".</p>
      </div>

      {/* Shiprocket Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
          <Truck className="w-6 h-6 text-emerald-500" /> Shiprocket Integration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shiprocket Email</label>
            <input 
              name="shiprocketEmail" 
              value={shiprocketEmail} 
              onChange={(e) => setShiprocketEmail(e.target.value)} 
              type="email" 
              placeholder="email@company.com" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shiprocket Password</label>
            <input 
              name="shiprocketPassword" 
              value={shiprocketPassword} 
              onChange={(e) => setShiprocketPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">Upon successful checkout, orders will be automatically pushed to Shiprocket if these credentials are valid.</p>
      </div>

      <div className="flex flex-col items-end gap-4 mt-8">
        <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] w-full max-w-sm">
          <Save className="w-5 h-5" /> Save Integrations
        </button>
        
        <button 
          type="button" 
          onClick={handleQuickSetup}
          className="bg-gray-900 hover:bg-gray-800 text-amber-500 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] w-full max-w-sm border border-gray-800"
        >
          <Zap className="w-5 h-5" /> Quick Setup
        </button>
      </div>
    </form>
  );
}
