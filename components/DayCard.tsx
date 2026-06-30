"use client";

import CategoryControl from "@/components/CategoryControl";
import type { Category, DayEntry } from "@/lib/dal";

type Props = {
  date: string;
  categories: Category[];
  entry: DayEntry | null;
  isActive: boolean;
  onRecord: (date: string, category: string, value: boolean) => void;
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
}

function cardTint(categories: Category[], values: Record<string, boolean | null>): string {
  const yesCount = categories.filter((c) => values[c.displayText] === true).length;
  const noCount = categories.filter((c) => values[c.displayText] === false).length;
  if (yesCount + noCount === 0) return "";
  return yesCount >= noCount ? "bg-green-400/30" : "bg-red-400/30";
}

export default function DayCard({ date, categories, entry, isActive, onRecord }: Props) {
  const values = entry?.values ?? {};
  const tint = cardTint(categories, values);

  // #region Tailwind utility consts
  const cardCls = `border border-gray-200 rounded-lg p-2 flex flex-col gap-1 flex-1 min-w-[128px] transition-opacity ${tint} ${isActive ? "opacity-100" : "opacity-40"}`;
  const dateHeaderCls = "text-center text-xs font-bold text-gray-700 mb-1";
  // #endregion

  return (
    <div className={cardCls}>
      <div className={dateHeaderCls}>
        {formatDate(date)}
      </div>
      {categories.map((cat) => (
        <CategoryControl
          key={cat.displayText}
          category={cat}
          value={values[cat.displayText] ?? null}
          isActive={isActive}
          onRecord={(key, v) => onRecord(date, key, v)}
        />
      ))}
    </div>
  );
}
