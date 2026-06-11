"use client";

import { useState } from "react";
import DayCard from "@/components/DayCard";
import type { Category, DayEntry } from "@/lib/dal";

type Props = {
  dates: string[];
  categories: Category[];
  initialEntries: Record<string, DayEntry | null>;
  activeDates: Set<string>;
};

function getSundayLabel(dates: string[]): string {
  const sunday = dates[0];
  const [year, month, day] = sunday.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CalendarGrid({ dates, categories, initialEntries, activeDates }: Props) {
  const [entries, setEntries] = useState<Record<string, DayEntry | null>>(initialEntries);

  async function handleRecord(date: string, category: string, value: boolean) {
    const existing = entries[date];
    const updatedValues = { ...(existing?.values ?? {}), [category]: value };
    const updatedEntry: DayEntry = { date, values: updatedValues };

    setEntries((prev) => ({ ...prev, [date]: updatedEntry }));

    await fetch("/api/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, category, value }),
    });
  }

  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto w-full">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex items-stretch gap-1 mb-2 w-full">
          <div className="w-12 shrink-0 flex items-center justify-end text-xs text-gray-400 font-medium pr-1">
            {getSundayLabel(week)}
          </div>
          {week.map((date) => (
            <DayCard
              key={date}
              date={date}
              categories={categories}
              entry={entries[date] ?? null}
              isActive={activeDates.has(date)}
              onRecord={handleRecord}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
