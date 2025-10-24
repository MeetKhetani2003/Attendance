"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMember() {
  const [name, setName] = useState("");
  const [dailyPayroll, setDailyPayroll] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    if (!name || !dailyPayroll) return alert("Name and daily salary required");
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, dailyPayroll: Number(dailyPayroll) }),
    });
    if (res.ok) {
      router.push("/members");
    } else alert("Failed to add");
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Add New Member</h1>
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Daily salary"
          value={dailyPayroll}
          onChange={(e) => setDailyPayroll(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
          </button>
          <a href="/members" className="px-4 py-2 border rounded">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
