"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userName: string | null;
};

export default function UserMenu({ userName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #region Tailwind utility consts
  const signInLinkCls = "text-xs text-gray-500 hover:text-gray-800 underline";
  const containerCls = "relative";
  const usernameCls = "text-xs text-gray-500 cursor-default select-none";
  const dropdownCls = "absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-md z-10 min-w-max";
  const signOutBtnCls = "block w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-100";
  // #endregion

  if (!userName) {
    return (
      <a href="/login" className={signInLinkCls}>
        Sign in
      </a>
    );
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function handleMouseEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className={containerCls} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className={usernameCls}>{userName}</span>
      {open && (
        <div className={dropdownCls}>
          <button
            onClick={handleSignOut}
            className={signOutBtnCls}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
