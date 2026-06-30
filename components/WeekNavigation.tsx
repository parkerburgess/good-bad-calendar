"use client";

import { useRouter } from "next/navigation";

type Props = {
  weekOffset: number;
  startDate: string;
  endDate: string;
  canGoBack: boolean;
  canGoForward: boolean;
};

export default function WeekNavigation({ weekOffset, startDate, endDate, canGoBack, canGoForward }: Props) {
  const router = useRouter();

  // #region Tailwind utility consts
  const containerCls = "flex items-center gap-2 ml-4";
  const navBtnCls = "px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed";
  const dateRangeCls = "text-sm text-gray-600 font-medium min-w-[140px] text-center";
  // #endregion

  function navigate(delta: number) {
    const next = weekOffset + delta;
    router.push(next === 0 ? "/" : `/?weekOffset=${next}`);
  }

  return (
    <div className={containerCls}>
      <button
        onClick={() => navigate(-1)}
        disabled={!canGoBack}
        className={navBtnCls}
      >
        ←
      </button>
      <span className={dateRangeCls}>
        {startDate} – {endDate}
      </span>
      <button
        onClick={() => navigate(1)}
        disabled={!canGoForward}
        className={navBtnCls}
      >
        →
      </button>
    </div>
  );
}
