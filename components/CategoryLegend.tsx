"use client";

import { useState } from "react";
import type { Category } from "@/lib/dal";

type Props = {
  categories: Category[];
};

export default function CategoryLegend({ categories }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 justify-end">
      {visible &&
        categories.map((cat) => (
          <span key={cat.displayText} className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{cat.displayText}</span>
            {" = "}
            {cat.legendText}
          </span>
        ))}
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-xs text-gray-500 hover:text-gray-800 underline"
      >
        {visible ? "Hide legend" : "Show legend"}
      </button>
    </div>
  );
}
