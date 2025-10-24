"use client";
import React, { useEffect, useState } from "react";
import MemberForm from "./MemberForm.jsx";
import AttendanceTable from "./AttendanceTable.jsx";
import PayrollSummary from "./PayrollSummary.jsx";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data || []);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <label className="mr-2 text-sm">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Take Attendance</h2>
            <MemberForm onAdd={fetchMembers} />
          </div>
          <AttendanceTable
            members={members}
            date={selectedDate}
            onUpdate={fetchMembers}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <PayrollSummary members={members} />
        </div>
      </div>
    </div>
  );
}
