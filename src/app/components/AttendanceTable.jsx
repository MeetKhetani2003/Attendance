"use client";
import React, { useEffect, useState } from "react";

export default function AttendanceTable({ members, date, onUpdate }) {
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) loadAttendance();
  }, [date, members]);

  async function loadAttendance() {
    const res = await fetch(`/api/attendance?date=${date}`);
    const data = await res.json();
    const map = {};
    (data || []).forEach((a) => (map[a.member_id] = a));
    setAttendanceMap(map);
  }

  async function updateStatus(memberId, status) {
    setLoading(true);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberId, date, status }),
    });
    if (res.ok) {
      await loadAttendance();
      onUpdate && onUpdate();
    } else {
      alert("Failed to update attendance");
    }
    setLoading(false);
  }

  async function addAdvance(memberId) {
    const amt = prompt("Enter advance amount (numeric)");
    if (!amt || isNaN(amt)) return;
    setLoading(true);
    const res = await fetch("/api/attendance/advance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberId, date, advance: Number(amt) }),
    });
    if (res.ok) await loadAttendance();
    else alert("Failed to add advance");
    setLoading(false);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Daily Salary</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Advance</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const a = attendanceMap[m.id] || {};
            return (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{m.name}</td>
                <td className="p-2">₹{m.daily_salary || 0}</td>
                <td className="p-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={a.status || ""}
                    onChange={(e) => updateStatus(m.id, e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    <option value="present">Present</option>
                    <option value="half">Half Day</option>
                    <option value="absent">Absent</option>
                  </select>
                </td>
                <td className="p-2">₹{a.advance || 0}</td>
                <td className="p-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => addAdvance(m.id)}
                    className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    disabled={loading}
                  >
                    Add Advance
                  </button>
                  {a.status && (
                    <button
                      onClick={() => updateStatus(m.id, "")}
                      className="px-3 py-1 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      disabled={loading}
                    >
                      Clear
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
