"use client";
import Link from "next/link";
import React from "react";

export default function Sidebar({ compact }) {
  return (
    <div className={compact ? "flex items-center justify-between" : ""}>
      <div className={compact ? "text-lg font-semibold" : ""}>
        <h2 className="text-2xl font-semibold mb-4">Attendance</h2>
      </div>

      <nav>
        <ul className={compact ? "flex gap-3" : "space-y-2"}>
          <li>
            <Link
              href="/"
              className="block px-3 py-2 rounded hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/attendance"
              className="block px-3 py-2 rounded hover:bg-gray-100"
            >
              Attendance
            </Link>
          </li>
          <li>
            <Link
              href="/members"
              className="block px-3 py-2 rounded hover:bg-gray-100"
            >
              Members
            </Link>
          </li>
          <li>
            <Link
              href="/members/new"
              className="block px-3 py-2 rounded bg-blue-600 text-white"
            >
              Add New Member
            </Link>
          </li>
        </ul>
      </nav>

      {!compact && (
        <div className="mt-6 text-sm text-gray-500">
          Click a member in the list to view full history.
        </div>
      )}
    </div>
  );
}
