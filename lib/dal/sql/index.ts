import { getPool } from "@/lib/db";
import type { Category, DayEntry, IDataAccess } from "@/lib/dal/types";

export const sqlDataAccess: IDataAccess = {
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("userId", userId)
        .query(`
          SELECT DisplayText, LegendText
          FROM goodbad.Category
          WHERE UserId = @userId
          ORDER BY SortOrder
        `);
      return result.recordset.map((row) => ({
        displayText: row.DisplayText as string,
        legendText: row.LegendText as string,
      }));
    } catch (err) {
      console.error("[DAL] getCategories failed", { userId, err });
      throw err;
    }
  },

  async getDayEntry(userId: string, date: string): Promise<DayEntry | null> {
    try {
      const pool = await getPool();

      const dayResult = await pool
        .request()
        .input("userId", userId)
        .input("date", date)
        .query(`
          SELECT Id FROM goodbad.Day
          WHERE UserId = @userId AND Date = @date
        `);

      if (dayResult.recordset.length === 0) return null;

      const dayId = dayResult.recordset[0].Id as number;

      const valuesResult = await pool
        .request()
        .input("dayId", dayId)
        .query(`
          SELECT c.DisplayText, d_v.Value
          FROM goodbad.Day_Category d_v
          JOIN goodbad.Category c ON c.Id = d_v.CategoryId
          WHERE d_v.DayId = @dayId
        `);

      const values: Record<string, boolean | null> = {};
      for (const row of valuesResult.recordset) {
        const v = row.Value as boolean | null;
        values[row.DisplayText as string] = v === null ? null : Boolean(v);
      }

      return { date, values };
    } catch (err) {
      console.error("[DAL] getDayEntry failed", { userId, date, err });
      throw err;
    }
  },

  async saveDayEntry(userId: string, entry: DayEntry): Promise<void> {
    try {
      const pool = await getPool();

      // Ensure the day row exists, then fetch its Id
      const dayResult = await pool
        .request()
        .input("userId", userId)
        .input("date", entry.date)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM goodbad.Day WHERE UserId = @userId AND Date = @date)
            INSERT INTO goodbad.Day (UserId, Date) VALUES (@userId, @date);
          SELECT Id FROM goodbad.Day WHERE UserId = @userId AND Date = @date;
        `);

      const dayId = dayResult.recordset[0].Id as number;

      // Upsert each category value
      for (const [categoryName, value] of Object.entries(entry.values)) {
        await pool
          .request()
          .input("dayId", dayId)
          .input("userId", userId)
          .input("categoryName", categoryName)
          .input("value", value)
          .query(`
            MERGE goodbad.Day_Category AS target
            USING (
              SELECT c.Id AS CategoryId
              FROM goodbad.Category c
              WHERE c.UserId = @userId AND c.DisplayText = @categoryName
            ) AS source ON target.DayId = @dayId AND target.CategoryId = source.CategoryId
            WHEN MATCHED THEN
              UPDATE SET target.Value = @value
            WHEN NOT MATCHED BY TARGET THEN
              INSERT (DayId, CategoryId, Value) VALUES (@dayId, source.CategoryId, @value);
          `);
      }
    } catch (err) {
      console.error("[DAL] saveDayEntry failed", { userId, entry, err });
      throw err;
    }
  },
};
