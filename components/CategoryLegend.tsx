"use client";

import { useState } from "react";
import type { Category } from "@/lib/dal";

type Props = {
  categories: Category[];
};

export default function CategoryLegend({ categories }: Props) {
  const [visible, setVisible] = useState(false);

  // #region Tailwind utility consts
  const containerCls = "flex flex-wrap items-baseline gap-x-4 gap-y-1 justify-end";
  const legendItemCls = "text-xs text-gray-500";
  const categoryNameCls = "font-semibold text-gray-700";
  const toggleBtnCls = "text-xs text-gray-500 hover:text-gray-800 underline";
  // #endregion

  return (
    <div className={containerCls}>
      {visible &&
        categories.map((cat) => (
          <span key={cat.displayText} className={legendItemCls}>
            <span className={categoryNameCls}>{cat.displayText}</span>
            {" = "}
            {cat.legendText}
          </span>
        ))}
      <button
        onClick={() => setVisible((v) => !v)}
        className={toggleBtnCls}
      >
        {visible ? "Hide legend" : "Show legend"}
      </button>
    </div>
  );
}
