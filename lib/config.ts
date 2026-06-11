import path from "path";

export const DATA_DIR = path.join(process.cwd(), "data");
export const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
export const DAYS_DIR = path.join(DATA_DIR, "days");

export const userDir = (userId: string) => path.join(DATA_DIR, "users", userId);
export const userCategoriesFile = (userId: string) =>
  path.join(userDir(userId), "categories.json");
export const userDaysDir = (userId: string) => path.join(userDir(userId), "days");
