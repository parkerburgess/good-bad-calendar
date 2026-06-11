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

  function navigate(delta: number) {
    const next = weekOffset + delta;
    router.push(next === 0 ? "/" : `/?weekOffset=${next}`);
  }

  return (
    <div className="flex items-center gap-2 ml-4">
      <button
        onClick={() => navigate(-1)}
        disabled={!canGoBack}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ←
      </button>
      <span className="text-sm text-gray-600 font-medium min-w-[140px] text-center">
        {startDate} – {endDate}
      </span>
      <button
        onClick={() => navigate(1)}
        disabled={!canGoForward}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
}
