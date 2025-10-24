"use client";
import React, { useState } from "react";

export default function MemberForm({ onAdd }) {
  const [name, setName] = useState("");
  const [dailyPayroll, setDailyPayroll] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!name || !dailyPayroll) return alert("Name and daily salary required");
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, dailyPayroll: Number(dailyPayroll) }),
    });
    if (res.ok) {
      setName("");
      setDailyPayroll("");
      onAdd && onAdd();
    } else alert("Failed to add");
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="border p-2 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 rounded w-32"
        placeholder="Daily salary"
        value={dailyPayroll}
        onChange={(e) => setDailyPayroll(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
    </form>
  );
}
