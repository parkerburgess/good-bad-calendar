import sql from "mssql";
import { getPool } from "@parkerburgess/wandering-parker-server";
import type { Category, DayEntry, IDataAccess } from "@/lib/dal/types";

type CategoryRow = { DisplayText: string; LegendText: string };
type DayIdRow    = { DayId: number };
type DayValueRow = { DisplayText: string; Value: boolean | null };

export const sqlDataAccess: IDataAccess = {
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("userId", sql.NVarChar(50), userId)
        .query<CategoryRow>(`
          SELECT DisplayText, LegendText
          FROM goodbad.Category
          WHERE UserId = @userId
          ORDER BY SortOrder
        `);
      return result.recordset.map((row) => ({
        displayText: row.DisplayText,
        legendText: row.LegendText,
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
        .input("userId", sql.NVarChar(50), userId)
        .input("date", sql.Date, date)
        .query<DayIdRow>(`
          SELECT DayId FROM goodbad.Day
          WHERE UserId = @userId AND Date = @date
        `);

      if (dayResult.recordset.length === 0) return null;

      const dayId = dayResult.recordset[0].DayId;

      const valuesResult = await pool
        .request()
        .input("dayId", sql.Int, dayId)
        .query<DayValueRow>(`
          SELECT c.DisplayText, d_v.Value
          FROM goodbad.Day_Category d_v
          JOIN goodbad.Category c ON c.CategoryId = d_v.CategoryId
          WHERE d_v.DayId = @dayId
        `);

      const values: Record<string, boolean | null> = {};
      for (const row of valuesResult.recordset) {
        values[row.DisplayText] = row.Value === null ? null : Boolean(row.Value);
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

      const dayResult = await pool
        .request()
        .input("userId", sql.NVarChar(50), userId)
        .input("date", sql.Date, entry.date)
        .query<DayIdRow>(`
          IF NOT EXISTS (SELECT 1 FROM goodbad.Day WHERE UserId = @userId AND Date = @date)
            INSERT INTO goodbad.Day (UserId, Date) VALUES (@userId, @date);
          SELECT DayId FROM goodbad.Day WHERE UserId = @userId AND Date = @date;
        `);

      const dayId = dayResult.recordset[0].DayId;

      for (const [categoryName, value] of Object.entries(entry.values)) {
        await pool
          .request()
          .input("dayId", sql.Int, dayId)
          .input("userId", sql.NVarChar(50), userId)
          .input("categoryName", sql.NVarChar(100), categoryName)
          .input("value", sql.Bit, value)
          .query(`
            MERGE goodbad.Day_Category AS target
            USING (
              SELECT c.CategoryId
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
