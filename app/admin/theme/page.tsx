import { getThemeSettings } from "@/lib/theme";
import ThemeClient from "./ThemeClient";
import { LayoutTemplate } from "lucide-react";

export default async function ThemeSettingsPage() {
  const theme = await getThemeSettings();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <LayoutTemplate className="w-8 h-8 text-amber-500" /> Navigation & Theme
        </h1>
        <p className="text-gray-500 mt-2">Manage your header links, footer menus, and contact information seamlessly across your storefront.</p>
      </div>

      <ThemeClient initialData={theme} />
    </div>
  );
}
