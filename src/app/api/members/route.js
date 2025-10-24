import { NextResponse } from "next/server";
import { readDB, writeDB, genId } from "../_helpers/db";

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.members);
}

export async function POST(req) {
  const body = await req.json();
  const db = readDB();
  const newMember = {
    id: genId(),
    name: body.name,
    dailyPayroll: body.dailyPayroll || 0,
    createdAt: new Date().toISOString(),
  };
  db.members.push(newMember);
  writeDB(db);
  return NextResponse.json(newMember);
}
