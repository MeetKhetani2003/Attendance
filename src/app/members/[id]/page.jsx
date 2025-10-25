import React from "react";

export default async function MemberProfile({ params }) {
  const { id } = await params; // await params for dynamic routes

  // Build absolute URL
  const base =
    process.env.NEXT_PUBLIC_BASE_PATH ||
    process.env.NEXT_PUBLIC_URL ||
    "http://localhost:3000";

  // Fetch member info and attendance
  const [memberRes, attendanceRes] = await Promise.all([
    fetch(`${base}/api/members/${id}`, { cache: "no-store" }),
    fetch(`${base}/api/attendance/member/${id}`, { cache: "no-store" }),
  ]);

  // Parse responses
  const member = await memberRes.json();
  const attendance = await attendanceRes.json();

  // Handle missing member
  if (!member) {
    return <div className="p-6 text-red-500">Member not found</div>;
  }

  // Extract DB fields safely
  const dailySalary = Number(member.daily_salary || 0);
  const joinedAt = new Date(member.created_at);

  // Attendance calculations
  const presentDays = attendance.filter((a) => a.status === "present").length;
  const halfDays = attendance.filter((a) => a.status === "half").length;
  const absentDays = attendance.filter((a) => a.status === "absent").length;
  const totalAdvance = attendance.reduce((sum, a) => sum + (a.advance || 0), 0);

  const totalSalary =
    presentDays * dailySalary + halfDays * (dailySalary / 2) - totalAdvance;

  return (
    <div className="p-6 space-y-6">
      {/* Member Info */}
      <h1 className="text-2xl font-bold">{member.name}</h1>
      <p className="text-gray-500">
        Daily Salary: ₹{dailySalary} <br />
        Joined: {joinedAt.toLocaleDateString()}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-700">Present</p>
          <p className="text-lg font-bold text-blue-800">{presentDays}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-700">Half Days</p>
          <p className="text-lg font-bold text-yellow-800">{halfDays}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-700">Absent</p>
          <p className="text-lg font-bold text-red-800">{absentDays}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-700">Total Payable</p>
          <p className="text-lg font-bold text-gray-800">₹{totalSalary}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Attendance History</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Advance</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 && (
              <tr>
                <td className="p-2 text-gray-500" colSpan="3">
                  No attendance records yet.
                </td>
              </tr>
            )}
            {attendance.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{new Date(a.date).toLocaleDateString()}</td>
                <td className="p-2">
                  {a.status === "present"
                    ? "✅ Present"
                    : a.status === "half"
                    ? "🟡 Half Day"
                    : "❌ Absent"}
                </td>
                <td className="p-2">₹{a.advance || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
