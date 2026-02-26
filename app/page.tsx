"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return alert((data as any).message || "Failed");
    alert((data as any).message || "Success");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-fuchsia-600 to-sky-500 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Left promo */}
        <div className="hidden md:flex flex-col justify-between rounded-3xl p-10 bg-white/10 backdrop-blur border border-white/20 text-white">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/80">Notes + RBAC</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">
              Manage notes.<br />Control access.
            </h1>
            <p className="mt-4 text-white/80 leading-relaxed">
              Secure login, User/Admin roles, and an Admin panel — all in one app.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="font-semibold">JWT</p>
              <p className="text-white/70 mt-1">Auth</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="font-semibold">RBAC</p>
              <p className="text-white/70 mt-1">Admin/User</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <p className="font-semibold">MongoDB</p>
              <p className="text-white/70 mt-1">Atlas</p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="rounded-3xl bg-white shadow-2xl p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 text-violet-700">
              {isLogin ? "LOGIN" : "REGISTER"}
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            {isLogin ? "Login to continue." : "Register to start using Notes."}
          </p>

          <div className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-zinc-700">Email</label>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={submit}
              className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 active:opacity-90"
            >
              {isLogin ? "Login" : "Create account"}
            </button>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full rounded-xl py-3 font-semibold border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
            >
              Switch to {isLogin ? "Register" : "Login"}
            </button>
          </div>

          <p className="mt-6 text-xs text-zinc-400">
            Tip: Admin can view all users in <span className="font-semibold">/admin</span>.
          </p>
        </div>
      </div>
    </div>
  );
}