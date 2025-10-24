"use client";
import React, { useEffect, useState } from "react";

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (members.length) fetchAttendance();
  }, [members, date]);

  async function fetchMembers() {
    const res = await fetch("/api/members");
    setMembers(await res.json());
  }

  async function fetchAttendance() {
    const res = await fetch(`/api/attendance?date=${date}`);
    const list = await res.json();
    const map = {};
    list.forEach((a) => (map[a.memberId] = a));
    setAttendanceMap(map);
  }

  async function updateAttendance(id, status) {
    setLoading(true);
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberId: id, date, status }),
    });
    await fetchAttendance();
    setLoading(false);
  }

  async function addAdvance(id) {
    const amt = prompt("Enter advance amount");
    if (!amt || isNaN(amt)) return;
    setLoading(true);
    await fetch("/api/attendance/advance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberId: id, date, advance: Number(amt) }),
    });
    await fetchAttendance();
    setLoading(false);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md shadow-sm focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Daily Salary</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Advance</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const a = attendanceMap[m.id] || {};
              return (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <a
                      href={`/members/${m.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {m.name}
                    </a>
                  </td>
                  <td className="p-3 text-gray-700">
                    ₹{m.dailySalary || m.dailyPayroll || 0}
                  </td>
                  <td className="p-3">
                    <select
                      className="border rounded p-1"
                      value={a.status || ""}
                      onChange={(e) => updateAttendance(m.id, e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Select</option>
                      <option value="present">Present</option>
                      <option value="half">Half Day</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                  <td className="p-3 text-gray-700">₹{a.advance || 0}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => addAdvance(m.id)}
                      className="px-3 py-1 border rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      disabled={loading}
                    >
                      Add Advance
                    </button>
                    {a.status && (
                      <button
                        onClick={() => updateAttendance(m.id, "")}
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
    </div>
  );
}
