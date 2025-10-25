import { NextResponse } from "next/server";
import { getAttendanceByDate, markAttendance } from "../_helpers/db";
import { sql } from "@vercel/postgres";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    if (!date) return NextResponse.json([], { status: 200 });

    const { rows } = await sql`SELECT * FROM attendance WHERE date=${date}`;
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { memberId, date, status } = await req.json();
    if (!memberId || !date)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    // Check existing
    const existing = await sql`
      SELECT * FROM attendance WHERE member_id=${memberId} AND date=${date}
    `;

    if (existing.rowCount > 0) {
      await sql`
        UPDATE attendance
        SET status=${status}
        WHERE member_id=${memberId} AND date=${date}
      `;
    } else {
      await sql`
        INSERT INTO attendance (member_id, date, status)
        VALUES (${memberId}, ${date}, ${status})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
