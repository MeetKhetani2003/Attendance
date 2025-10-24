import { NextResponse } from "next/server";
import { readDB } from "../../_helpers/db";

export async function GET() {
  const db = readDB();

  const result = db.members.map((member) => {
    const attendance = db.attendance.filter((a) => a.memberId === member.id);
    const presentDays = attendance.filter((a) => a.status === "present").length;
    const halfDays = attendance.filter((a) => a.status === "half").length;
    const absents = attendance.filter((a) => a.status === "absent").length;

    const totalSalary =
      presentDays * member.dailySalary + halfDays * (member.dailySalary / 2);
    const advances = attendance.reduce((sum, a) => sum + (a.advance || 0), 0);
    const payable = totalSalary - advances;

    return {
      memberId: member.id,
      name: member.name,
      presentDays,
      halfDays,
      absents,
      totalSalary,
      advances,
      payable,
    };
  });

  return NextResponse.json(result);
}
