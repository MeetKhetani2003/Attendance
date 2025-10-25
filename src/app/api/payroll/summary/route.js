import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows: members } = await sql`SELECT * FROM members`;
  const { rows: attendance } = await sql`SELECT * FROM attendance`;

  const result = members.map((member) => {
    const records = attendance.filter((a) => a.member_id === member.id);
    const presentDays = records.filter((r) => r.status === "present").length;
    const halfDays = records.filter((r) => r.status === "half").length;
    const absents = records.filter((r) => r.status === "absent").length;

    const totalSalary =
      presentDays * Number(member.daily_salary) +
      halfDays * (Number(member.daily_salary) / 2);

    const advances = records.reduce(
      (sum, r) => sum + (Number(r.advance) || 0),
      0
    );

    const payable = totalSalary - advances;

    return {
      memberId: member.id,
      name: member.name,
      daysPresent: presentDays,
      daysHalf: halfDays,
      daysAbsent: absents,
      totalEarned: totalSalary,
      totalAdvance: advances,
      balance: payable,
    };
  });

  return NextResponse.json(result);
}
