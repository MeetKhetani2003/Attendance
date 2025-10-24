import { NextResponse } from "next/server";
import { readDB, writeDB, genId } from "../../_helpers/db";

export async function POST(req) {
  const body = await req.json();
  const { memberId, date, advance } = body;

  if (!memberId || !date) {
    return NextResponse.json(
      { error: "memberId and date are required" },
      { status: 400 }
    );
  }

  const db = readDB();
  let record = db.attendance.find(
    (a) => a.memberId === memberId && a.date === date
  );

  if (!record) {
    record = {
      id: genId(),
      memberId,
      date,
      status: "",
      advance: Number(advance) || 0,
    };
    db.attendance.push(record);
  } else {
    record.advance = (record.advance || 0) + Number(advance);
  }

  writeDB(db);
  return NextResponse.json(record);
}
