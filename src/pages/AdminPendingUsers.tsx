// src/pages/AdminPendingUsers.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface PendingUser {
  _id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
}

const AdminPendingUsers: React.FC = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("clerkToken");
      const { data } = await axios.get(
        "https://api.citycarcenters.com/api/v1/secure/route/admin/pending-admin-users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const approveUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("clerkToken");
      await axios.patch(
        `https://api.citycarcenters.com/api/v1/secure/route/admin/approve-user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingUsers(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Pending Admin Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.name || "N/A"}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2 capitalize">{user.status}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                      onClick={() => approveUser(user._id)}
                    >
                      Approve
                    </button>
                    {/* Optionally add Reject button */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPendingUsers;
