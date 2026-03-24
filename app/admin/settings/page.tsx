import prisma from "@/lib/prisma";
import { Settings } from "lucide-react";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  let settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
  
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: "global" }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-amber-500" /> API Settings
        </h1>
        <p className="text-gray-500 mt-2">Manage your integrations for Razorpay (Payment Gateway) and Shiprocket (Order fulfillment).</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
