import fs from "fs/promises";
import path from "path";
import {
  CATEGORIES_FILE,
  userCategoriesFile,
  userDaysDir,
} from "@/lib/config";
import type { CategoryName, DayEntry, IDataAccess } from "@/lib/dal/types";

const DEFAULT_CATEGORIES_FALLBACK = [
  "God", "Diet", "Exercise", "Code", "Social", "Drinking",
];

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function readDefaultCategories(): Promise<CategoryName[]> {
  try {
    const raw = await fs.readFile(CATEGORIES_FILE, "utf-8");
    return JSON.parse(raw) as CategoryName[];
  } catch {
    return DEFAULT_CATEGORIES_FALLBACK;
  }
}

export const jsonDataAccess: IDataAccess = {
  async getCategories(userId: string): Promise<CategoryName[]> {
    const filePath = userCategoriesFile(userId);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      return JSON.parse(raw) as CategoryName[];
    } catch {
      // First access for this user — seed from global defaults
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
