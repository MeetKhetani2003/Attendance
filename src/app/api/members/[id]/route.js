import { NextResponse } from "next/server";
import { readDB, writeDB } from "../../_helpers/db.js";

// GET single member (optional)
export async function GET(req, { params }) {
  const { id } = await params;
  const db = readDB();
  const member = db.members.find((m) => m.id === id);
  if (!member)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  return NextResponse.json(member);
}

// PUT /api/members/:id -> Update member
export async function PUT(req, { params }) {
  const { id } = await params;
  const db = readDB();
  const body = await req.json();
  const member = db.members.find((m) => m.id === id);
  if (!member)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });

  // update fields
  if (body.name) member.name = body.name;
  if (body.dailyPayroll !== undefined) member.dailyPayroll = body.dailyPayroll;

  writeDB(db);
  return NextResponse.json(member);
}

// DELETE /api/members/:id -> Delete member
export async function DELETE(req, { params }) {
  const { id } = await params;
  const db = readDB();

  // remove member
  const filteredMembers = db.members.filter((m) => m.id !== id);
  if (filteredMembers.length === db.members.length) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  db.members = filteredMembers;

  // also remove attendance records
  db.attendance = db.attendance.filter((a) => a.memberId !== id);

  writeDB(db);
  return NextResponse.json({ message: `Member ${id} deleted successfully` });
}
