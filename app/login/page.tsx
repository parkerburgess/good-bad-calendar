"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isUserMode = !!process.env.NEXT_PUBLIC_USER_AUTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = isUserMode ? { username, password } : { password };
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Login failed");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Good/Bad Calendar</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isUserMode && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus={!isUserMode}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {isUserMode && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            No account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">Create one</Link>
          </p>
        )}
      </div>
    </main>
  );
}
