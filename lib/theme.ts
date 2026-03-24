import fs from 'fs/promises';
import path from 'path';

export async function getThemeSettings() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'themeSettings.json'), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {
      navbar: [],
      footer: { shop: [], company: [], legal: [] },
      contact: { phone: "", email: "", announcement: "" }
    };
  }
}
