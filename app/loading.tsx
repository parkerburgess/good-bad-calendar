"use client";

import { SlowRequestNotice, useSlowRequestNotice } from "@parkerburgess/wandering-parker-ui";

export default function Loading() {
  // A loading.tsx file only renders while its sibling page.tsx is still
  // resolving, so being mounted at all is equivalent to "pending" here.
  const slowMessage = useSlowRequestNotice(true);

  return (
    <div className="space-y-3">
      <p className="text-neutral-500">Loading…</p>
      <SlowRequestNotice message={slowMessage} />
    </div>
  );
}
