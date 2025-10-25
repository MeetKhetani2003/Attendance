import { NextResponse } from "next/server";
import { getMemberById, updateMember, deleteMember } from "../../_helpers/db";

export async function GET(req, context) {
  const { id } = await context.params;
  const member = await getMemberById(id);

  // ✅ Ensure it's plain JSON
  return NextResponse.json(JSON.parse(JSON.stringify(member)));
}

export async function PUT(req, context) {
  const { id } = await context.params;
  const { name, dailyPayroll } = await req.json();
  await updateMember(id, name, dailyPayroll);
  return NextResponse.json({ success: true });
}

export async function DELETE(req, context) {
  const { id } = await context.params;
  await deleteMember(id);
  return NextResponse.json({ success: true });
}
