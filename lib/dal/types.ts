export type CategoryName = string; // stable key used in DayEntry.values records

export type Category = {
  displayText: CategoryName; // shown on day cards
  legendText: string;        // shown in the legend
};

export type DayEntry = {
  date: string; // ISO date: "YYYY-MM-DD"
  values: Record<CategoryName, boolean | null>; // null = not yet recorded
};

export interface IDataAccess {
  getCategories(userId: string): Promise<Category[]>;
  getDayEntry(userId: string, date: string): Promise<DayEntry | null>;
  saveDayEntry(userId: string, entry: DayEntry): Promise<void>;
}
