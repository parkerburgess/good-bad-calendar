"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Registration failed");
    }
    setLoading(false);
  }

  const inputClass =
    "border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
