import { NextResponse } from "next/server";
import { getMembers, addMember } from "../_helpers/db";

export async function GET() {
  const members = await getMembers();
  return NextResponse.json(members);
}

export async function POST(req) {
  const { name, dailyPayroll } = await req.json();
  await addMember(name, dailyPayroll);
  return NextResponse.json({ success: true });
}
