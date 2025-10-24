import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function ensureDB() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbPath))
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ members: [], attendance: [] }, null, 2)
    );
}

export function readDB() {
  ensureDB();
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
}

export function writeDB(obj) {
  ensureDB();
  fs.writeFileSync(dbPath, JSON.stringify(obj, null, 2));
}

export function genId() {
  return Math.random().toString(36).slice(2, 9);
}
