"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function saveThemeSettings(data: any) {
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    
    const filepath = path.join(dir, "themeSettings.json");
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf8");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
