"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-72 bg-white border-r p-6 hidden md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden p-4 bg-white border-b">
        <Sidebar compact />
      </div>

      <main className="flex-1 p-6">
        <Dashboard />
      </main>
    </div>
  );
}
