import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { memberId, date, advance } = await req.json();
    if (!memberId || !date || isNaN(advance)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if attendance record exists
    const existing = await sql`
      SELECT * FROM attendance WHERE member_id=${memberId} AND date=${date}
    `;

    if (existing.rowCount > 0) {
      // Update advance
      await sql`
        UPDATE attendance
        SET advance = advance + ${advance}
        WHERE member_id=${memberId} AND date=${date}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO attendance (member_id, date, advance)
        VALUES (${memberId}, ${date}, ${advance})
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
