"use client";
import React, { useEffect, useState } from "react";

export default function PayrollSummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    compute();
  }, []);

  async function compute() {
    const res = await fetch("/api/payroll/summary");
    const data = await res.json();
    setSummary(data || []);
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Payroll Summary</h3>
      <div className="space-y-2 max-h-96 overflow-auto">
        {summary.map((s) => (
          <div key={s.memberId} className="p-2 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-500">
                  Present: {s.daysPresent} days this month
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{s.totalEarned}</div>
                <div className="text-xs text-gray-500">
                  Advance: {s.totalAdvance}
                </div>
                <div className="text-sm">Due: {s.balance}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        onClick={compute}
      >
        Refresh
      </button>
    </div>
  );
}
