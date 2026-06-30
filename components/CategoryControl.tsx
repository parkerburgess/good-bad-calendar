"use client";

import type { Category } from "@/lib/dal";

type Props = {
  category: Category;
  value: boolean | null;
  isActive: boolean;
  onRecord: (categoryKey: string, value: boolean) => void;
};

export default function CategoryControl({ category, value, isActive, onRecord }: Props) {
  const recorded = value !== null;

  const bg = recorded
    ? value
      ? "bg-green-500"
      : "bg-red-500"
    : "bg-gray-300";

  // #region Tailwind utility consts
  const containerCls = `flex items-center rounded px-2 py-1 ${bg}`;
  const actionBtnCls = "text-xs bg-gray-600 hover:bg-gray-700 rounded px-1.5 py-0.5 leading-none";
  const activeLabelCls = "flex-1 text-center text-xs font-medium text-gray-800";
  const recordedLabelCls = "flex-1 text-center text-xs font-medium text-white";
  // #endregion

  return (
    <div className={containerCls}>
      {isActive && !recorded ? (
        <>
          <button
            onClick={() => onRecord(category.displayText, false)}
            className={actionBtnCls}
            aria-label="No"
          >
            ▼
          </button>
          <span className={activeLabelCls}>
            {category.displayText}
          </span>
          <button
            onClick={() => onRecord(category.displayText, true)}
            className={actionBtnCls}
            aria-label="Yes"
          >
            ▲
          </button>
        </>
      ) : (
        <span className={recordedLabelCls}>
          {category.displayText}
        </span>
      )}
    </div>
  );
}
