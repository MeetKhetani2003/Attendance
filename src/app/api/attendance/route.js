import { NextResponse } from "next/server";
import { readDB, writeDB, genId } from "../_helpers/db.js";

// GET all attendance or by date
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const db = readDB();
  const list = date
    ? db.attendance.filter((a) => a.date === date)
    : db.attendance;
  return NextResponse.json(list);
}

// POST -> add attendance for a member
export async function POST(req) {
  const body = await req.json(); // { memberId, date, status, advance? }
  const db = readDB();
  const { memberId, date, status } = body;

  if (!["present", "half", "absent"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid attendance status" },
      { status: 400 }
    );
  }

  let record = db.attendance.find(
    (a) => a.memberId === memberId && a.date === date
  );

  if (!record) {
    record = {
      id: genId(),
      memberId,
      date,
      status,
      advance: body.advance || 0,
    };
    db.attendance.push(record);
  } else {
    record.status = status;
    if (body.advance !== undefined) record.advance = body.advance;
  }

  writeDB(db);
  return NextResponse.json(record);
}
