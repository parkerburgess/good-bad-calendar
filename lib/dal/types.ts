export type CategoryName = string;

export type DayEntry = {
  date: string; // ISO date: "YYYY-MM-DD"
  values: Record<CategoryName, boolean | null>; // null = not yet recorded
};

export interface IDataAccess {
  getCategories(userId: string): Promise<CategoryName[]>;
  getDayEntry(userId: string, date: string): Promise<DayEntry | null>;
  saveDayEntry(userId: string, entry: DayEntry): Promise<void>;
}
