import { NextResponse } from "next/server";
import { readDB, writeDB } from "../../../_helpers/db.js";

// GET attendance for a member
export async function GET(req, { params }) {
  const { memberId } = await params;
  const db = readDB();
  const list = db.attendance.filter((a) => a.memberId === memberId);
  return NextResponse.json(list);
}

// DELETE all attendance for a member
export async function DELETE(req, { params }) {
  const { memberId } = await params;
  const db = readDB();
  db.attendance = db.attendance.filter((a) => a.memberId !== memberId);
  writeDB(db);
  return NextResponse.json({
    message: `Deleted attendance for member ${memberId}`,
  });
}

// PUT -> update or create a record for a member
export async function PUT(req, { params }) {
  const { memberId } = await params;
  const db = readDB();
  const body = await req.json(); // { date, status, advance? }

  let record = db.attendance.find(
    (a) => a.memberId === memberId && a.date === body.date
  );

  if (!record) {
    record = {
      id: String(Date.now()),
      memberId,
      date: body.date,
      status: body.status,
      advance: body.advance || 0,
    };
    db.attendance.push(record);
  } else {
    if (body.status) record.status = body.status;
    if (body.advance !== undefined) record.advance = body.advance;
  }

  writeDB(db);
  return NextResponse.json(record);
}
