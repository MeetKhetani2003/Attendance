import { NextResponse } from "next/server";
import {
  getMemberAttendance,
  deleteMemberAttendance,
} from "../../../_helpers/db";

// ✅ GET: fetch all attendance records for a member
export async function GET(req, context) {
  const { memberId } = await context.params;
  const list = await getMemberAttendance(memberId);
  return NextResponse.json(list);
}

// ✅ DELETE: delete all attendance for a member
export async function DELETE(req, context) {
  const { memberId } = await context.params;
  const result = await deleteMemberAttendance(memberId);
  return NextResponse.json({
    message: `Deleted attendance for member ${memberId}`,
    result,
  });
}
