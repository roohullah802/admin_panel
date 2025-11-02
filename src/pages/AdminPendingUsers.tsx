// src/pages/AdminPendingUsers.tsx
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Menu, X } from "lucide-react";
import Nav from "./Nav";

interface PendingUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

// Mock data
const MOCK_USERS: PendingUser[] = [
  { _id: "1", name: "Roohullah Khan", email: "roohullah.khan@example.com", role: "admin", status: "pending" },
  { _id: "2", name: "Muhammad Danyal", email: "danyal@example.com", role: "user", status: "pending" },
  { _id: "3", name: "Sarah Ali", email: "sarah.ali@example.com", role: "admin", status: "pending" },
  { _id: "4", name: "Ali Raza", email: "ali.raza@example.com", role: "user", status: "approved" },
  { _id: "5", name: "Fatima Noor", email: "fatima.noor@example.com", role: "admin", status: "pending" },
  { _id: "6", name: "Ahmed Shah", email: "ahmed.shah@example.com", role: "user", status: "pending" },
  { _id: "7", name: "Hassan Javed", email: "hassan.javed@example.com", role: "admin", status: "approved" },
  { _id: "8", name: "Ayesha Khan", email: "ayesha.khan@example.com", role: "admin", status: "pending" },
  { _id: "9", name: "Bilal Ahmed", email: "bilal.ahmed@example.com", role: "user", status: "pending" },
];

const AdminPendingUsers: React.FC = () => {
  const [users, setUsers] = useState<PendingUser[]>(MOCK_USERS);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Simulate API call to approve user
  const approveUser = (userId: string) => {
    setApprovingId(userId);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status: "approved" } : u
        )
      );
      setApprovingId(null);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Nav />
      </div>

      {/* Hamburger menu for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="font-bold text-lg">Menu</h1>
              <button onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <Nav />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Pending Admin Users
        </h1>

        {/* Table container with scroll */}
        <div className="overflow-x-auto w-full bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="max-h-[80vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4 capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          user.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {user.status === "pending" ? (
                        <button
                          className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-150 ${
                            approvingId === user._id ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          onClick={() => approveUser(user._id)}
                          disabled={approvingId === user._id}
                        >
                          {approvingId === user._id ? (
                            <ClipLoader color="white" size={16} />
                          ) : (
                            "Approve"
                          )}
                        </button>
                      ) : (
                        <span className="text-green-700 font-medium">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingUsers;
