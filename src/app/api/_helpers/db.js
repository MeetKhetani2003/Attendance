import { sql } from "@vercel/postgres";

// --- Members ---
export async function getMembers() {
  const { rows } = await sql`SELECT * FROM members ORDER BY created_at DESC`;
  return rows;
}

export async function getMemberById(id) {
  const { rows } = await sql`SELECT * FROM members WHERE id = ${id}`;
  return rows[0] || null;
}

export async function addMember(name, daily_salary) {
  await sql`INSERT INTO members (name, daily_salary) VALUES (${name}, ${daily_salary})`;
}

// --- Update Member ---
export async function updateMember(id, name, daily_salary) {
  await sql`UPDATE members SET name=${name}, daily_salary=${daily_salary} WHERE id=${id}`;
}

export async function deleteMember(id) {
  await sql`DELETE FROM members WHERE id=${id}`;
}

// --- Attendance ---
export async function getAttendanceByDate(date) {
  const { rows } = await sql`SELECT * FROM attendance WHERE date=${date}`;
  return rows;
}

export async function markAttendance(member_id, date, status) {
  const existing = await sql`
    SELECT * FROM attendance WHERE member_id=${member_id} AND date=${date}
  `;
  if (existing.rows.length > 0) {
    await sql`UPDATE attendance SET status=${status} WHERE member_id=${member_id} AND date=${date}`;
  } else {
    await sql`INSERT INTO attendance (member_id, date, status) VALUES (${member_id}, ${date}, ${status})`;
  }
}

export async function addAdvance(member_id, date, advance) {
  const existing = await sql`
    SELECT * FROM attendance WHERE member_id=${member_id} AND date=${date}
  `;
  if (existing.rows.length > 0) {
    await sql`UPDATE attendance SET advance=${advance} WHERE member_id=${member_id} AND date=${date}`;
  } else {
    await sql`INSERT INTO attendance (member_id, date, status, advance) VALUES (${member_id}, ${date}, 'present', ${advance})`;
  }
}

export async function getMemberAttendance(member_id) {
  const { rows } = await sql`
    SELECT * FROM attendance WHERE member_id=${member_id} ORDER BY date DESC
  `;
  return rows;
}

export async function deleteMemberAttendance(member_id) {
  await sql`DELETE FROM attendance WHERE member_id=${member_id}`;
}
