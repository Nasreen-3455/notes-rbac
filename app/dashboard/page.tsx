"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = { _id: string; title: string; content: string };

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const load = async () => {
    const res = await fetch("/api/notes");
    if (!res.ok) return router.push("/");
    const data = await res.json();
    setNotes(data.notes || []);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!title.trim() || !content.trim())
      return alert("Title + Content required");

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");

    setTitle("");
    setContent("");
    load();
  };

  const del = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Dashboard</h2>
            <p className="text-zinc-500 mt-1">Create and manage your notes.</p>
          </div>

          {/* ✅ Buttons */}
          <div className="flex gap-2">
            <a
              href="/admin"
              className="rounded-xl px-4 py-2 font-semibold text-white bg-gradient-to-r from-sky-600 to-violet-600 hover:opacity-95"
            >
              Admin Panel
            </a>

            <button
              onClick={logout}
              className="rounded-xl px-4 py-2 font-semibold border border-zinc-200 bg-white hover:bg-zinc-50"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Create note */}
          <div className="rounded-3xl bg-white shadow-lg p-6 border border-zinc-100">
            <h3 className="text-lg font-bold">New Note</h3>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={add}
                className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:opacity-95"
              >
                Add Note
              </button>
            </div>
          </div>

          {/* Notes list */}
          <div className="rounded-3xl bg-white shadow-lg p-6 border border-zinc-100">
            <h3 className="text-lg font-bold">Your Notes</h3>

            <div className="mt-4 space-y-3 max-h-[420px] overflow-auto pr-1">
              {notes.length === 0 && (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-zinc-500">
                  No notes yet. Create your first one ✨
                </div>
              )}

              {notes.map((n) => (
                <div
                  key={n._id}
                  className="rounded-2xl border border-zinc-200 p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-zinc-900">{n.title}</p>
                      <p className="text-zinc-600 mt-1 whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>

                    <button
                      onClick={() => del(n._id)}
                      className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={load}
              className="mt-4 w-full rounded-xl py-3 font-semibold border border-zinc-200 hover:bg-zinc-50"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}