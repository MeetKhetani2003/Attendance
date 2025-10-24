"use client";
import React, { useEffect, useState } from "react";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: "", dailyPayroll: 0 });

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data || []);
  }

  function openEdit(member) {
    setEditingMember(member);
    setFormData({ name: member.name, dailyPayroll: member.dailyPayroll });
  }

  function closeEdit() {
    setEditingMember(null);
    setFormData({ name: "", dailyPayroll: 0 });
  }

  async function saveEdit() {
    if (!formData.name || formData.dailyPayroll < 0) return;
    const res = await fetch(`/api/members/${editingMember.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      fetchMembers();
      closeEdit();
    } else {
      alert("Failed to update member");
    }
  }

  async function deleteMember(id) {
    if (!confirm("Are you sure you want to delete this member?")) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (res.ok) fetchMembers();
    else alert("Failed to delete member");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Members</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Daily Payroll</th>
              <th className="p-2 text-left">Joined</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{m.name}</td>
                <td className="p-2">₹{m.dailyPayroll}</td>
                <td className="p-2">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => openEdit(m)}
                    className="px-3 py-1 border rounded bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="px-3 py-1 border rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Member</h2>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Daily Payroll</label>
                <input
                  type="number"
                  value={formData.dailyPayroll}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyPayroll: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
