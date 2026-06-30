"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  // #region Tailwind utility consts
  const logoutBtnCls = "text-xs text-gray-500 hover:text-gray-800 underline";
  // #endregion

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className={logoutBtnCls}
    >
      Sign out
    </button>
  );
}
