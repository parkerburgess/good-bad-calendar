import fs from "fs/promises";
import path from "path";
import {
  CATEGORIES_FILE,
  userCategoriesFile,
  userDaysDir,
} from "@/lib/config";
import type { Category, DayEntry, IDataAccess } from "@/lib/dal/types";

const DEFAULT_CATEGORIES_FALLBACK: Category[] = [
  { displayText: "God", legendText: "Spiritual Practice" },
  { displayText: "Diet", legendText: "Healthy Eating" },
  { displayText: "Exercise", legendText: "Physical Activity" },
  { displayText: "Code", legendText: "Coding / Development" },
  { displayText: "Social", legendText: "Social Interaction" },
  { displayText: "Drinking", legendText: "Alcohol Consumption" },
];

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function readDefaultCategories(): Promise<Category[]> {
  try {
    const raw = await fs.readFile(CATEGORIES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Category[] | string[];
    // Support legacy format (plain string array) from old categories.json
    if (parsed.length === 0) return DEFAULT_CATEGORIES_FALLBACK;
    if (typeof parsed[0] === "string") {
      return (parsed as string[]).map((s) => ({ displayText: s, legendText: s }));
    }
    return parsed as Category[];
  } catch {
    return DEFAULT_CATEGORIES_FALLBACK;
  }
}

export const jsonDataAccess: IDataAccess = {
  async getCategories(userId: string): Promise<Category[]> {
    const filePath = userCategoriesFile(userId);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw) as Category[] | string[];
      if (parsed.length === 0) return DEFAULT_CATEGORIES_FALLBACK;
      if (typeof parsed[0] === "string") {
        // Migrate legacy per-user categories file on next read
        const migrated = (parsed as string[]).map((s) => ({ displayText: s, legendText: s }));
        await fs.writeFile(filePath, JSON.stringify(migrated, null, 2), "utf-8");
        return migrated;
      }
      return parsed as Category[];
    } catch {
      const defaults = await readDefaultCategories();
      await ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, JSON.stringify(defaults, null, 2), "utf-8");
      return defaults;
    }
  },

  async getDayEntry(userId: string, date: string): Promise<DayEntry | null> {
    const filePath = path.join(userDaysDir(userId), `${date}.json`);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      return JSON.parse(raw) as DayEntry;
    } catch {
      return null;
    }
  },

  async saveDayEntry(userId: string, entry: DayEntry): Promise<void> {
    const dir = userDaysDir(userId);
    await ensureDir(dir);
    const filePath = path.join(dir, `${entry.date}.json`);
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2), "utf-8");
  },
};
