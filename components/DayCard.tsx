"use client";

import CategoryControl from "@/components/CategoryControl";
import type { DayEntry } from "@/lib/dal";

type Props = {
  date: string;
  categories: string[];
  entry: DayEntry | null;
  isActive: boolean;
  onRecord: (date: string, category: string, value: boolean) => void;
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
}

function cardTint(categories: string[], values: Record<string, boolean | null>): string {
  const yesCount = categories.filter((c) => values[c] === true).length;
  const noCount = categories.filter((c) => values[c] === false).length;
  if (yesCount + noCount === 0) return "";
  return yesCount >= noCount ? "bg-green-400/30" : "bg-red-400/30";
}

export default function DayCard({ date, categories, entry, isActive, onRecord }: Props) {
  const values = entry?.values ?? {};
  const tint = cardTint(categories, values);

  return (
    <div
      className={`border border-gray-200 rounded-lg p-2 flex flex-col gap-1 flex-1 min-w-[128px] transition-opacity ${tint} ${
        isActive ? "opacity-100" : "opacity-40"
      }`}
    >
      <div className="text-center text-xs font-bold text-gray-700 mb-1">
        {formatDate(date)}
      </div>
      {categories.map((cat) => (
        <CategoryControl
          key={cat}
          category={cat}
          value={values[cat] ?? null}
          isActive={isActive}
          onRecord={(c, v) => onRecord(date, c, v)}
        />
      ))}
    </div>
  );
}
