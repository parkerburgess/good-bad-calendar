export const dynamic = "force-dynamic";

import CalendarGrid from "@/components/CalendarGrid";
import WeekNavigation from "@/components/WeekNavigation";
import UserMenu from "@/components/UserMenu";
import CategoryLegend from "@/components/CategoryLegend";
import { dal } from "@/lib/dal";
import type { DayEntry } from "@/lib/dal";
import { getUserId, getUserName } from "@/lib/auth";

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

function startOfSunday(d: Date): Date {
  return addDays(d, -d.getDay());
}

function formatNavDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function weekHasData(userId: string, sunday: Date): Promise<boolean> {
  const checks = await Promise.all(
    Array.from({ length: 7 }, (_, i) => dal.getDayEntry(userId, toIso(addDays(sunday, i))))
  );
  return checks.some((e) => e !== null);
}

type Props = {
  searchParams: Promise<{ weekOffset?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const [userId, userName] = await Promise.all([getUserId(), getUserName()]);

  const params = await searchParams;
  const weekOffset = Math.min(0, parseInt(params.weekOffset ?? "0", 10));

  const categories = await dal.getCategories(userId);

  const today = new Date(new Date().toDateString()); // strip time
  const fiveDaysAgo = addDays(today, -5);

  const weekOfToday = startOfSunday(today);
  const weekOfFiveDaysAgo = startOfSunday(fiveDaysAgo);
  const baseStart =
    toIso(weekOfToday) === toIso(weekOfFiveDaysAgo)
      ? addDays(weekOfToday, -7)
      : weekOfFiveDaysAgo;
  const baseEnd = addDays(weekOfToday, 6);

  const startSunday = addDays(baseStart, weekOffset * 7);
  const endSaturday = addDays(baseEnd, weekOffset * 7);

  const dates: string[] = [];
  let cursor = new Date(startSunday);
  while (cursor <= endSaturday) {
    dates.push(toIso(cursor));
    cursor = addDays(cursor, 1);
  }

  const activeDates = new Set<string>();
  for (let i = 0; i <= 5; i++) {
    activeDates.add(toIso(addDays(today, -i)));
  }

  const [entryResults, canGoBack, canGoForward] = await Promise.all([
    Promise.all(dates.map((d) => dal.getDayEntry(userId, d))),
    weekHasData(userId, addDays(startSunday, -7)),
    weekHasData(userId, addDays(endSaturday, 1)),
  ]);
  const initialEntries: Record<string, DayEntry | null> = {};
  dates.forEach((d, i) => {
    initialEntries[d] = entryResults[i];
  });

  // #region Tailwind utility consts
  const pageCls = "min-h-screen bg-gray-50 p-4";
  const headerCls = "flex items-center mb-1";
  const titleCls = "text-xl font-bold text-gray-800";
  const userMenuWrapperCls = "ml-auto flex items-center gap-3";
  const legendRowCls = "flex justify-end mb-3";
  // #endregion

  return (
    <main className={pageCls}>
      <div className={headerCls}>
        <h1 className={titleCls}>Good/Bad Calendar</h1>
        <WeekNavigation
          weekOffset={weekOffset}
          startDate={formatNavDate(startSunday)}
          endDate={formatNavDate(endSaturday)}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
        <div className={userMenuWrapperCls}>
          <UserMenu userName={userName} />
        </div>
      </div>
      <div className={legendRowCls}>
        <CategoryLegend categories={categories} />
      </div>
      <CalendarGrid
        dates={dates}
        categories={categories}
        initialEntries={initialEntries}
        activeDates={activeDates}
      />
    </main>
  );
}
