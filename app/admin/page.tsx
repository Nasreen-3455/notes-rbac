"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { _id: string; name: string; email: string; role: "user" | "admin" };

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Forbidden");
        router.push("/dashboard");
        return;
      }
      setUsers(data.users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const promote = async (userId: string) => {
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    alert(data.message || "Done");
    loadUsers();
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Admin Panel</h2>
            <p className="text-zinc-500 mt-1">Manage users and roles.</p>
          </div>
          <a
            href="/dashboard"
            className="rounded-xl px-4 py-2 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95"
          >
            Back to Dashboard
          </a>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="rounded-3xl bg-white shadow-lg border border-zinc-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-bold text-zinc-900">{u.name}</p>
                  <p className="text-zinc-500">{u.email}</p>
                </div>

                <span
                  className={
                    "text-xs font-bold px-3 py-1 rounded-full " +
                    (u.role === "admin"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-sky-100 text-sky-700")
                  }
                >
                  {u.role.toUpperCase()}
                </span>
              </div>

              {u.role !== "admin" && (
                <button
                  onClick={() => promote(u._id)}
                  className="mt-4 w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:opacity-95"
                >
                  Make Admin
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}