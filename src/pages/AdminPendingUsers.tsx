// src/pages/AdminPendingUsers.tsx
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Nav from "./Nav";

interface PendingUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

const MOCK_USERS: PendingUser[] = [
  {
    _id: "1",
    name: "Roohullah Khan",
    email: "roohullah.khan@example.com",
    role: "admin",
    status: "pending",
  },
  {
    _id: "2",
    name: "Muhammad Danyal",
    email: "danyal@example.com",
    role: "user",
    status: "pending",
  },
  {
    _id: "3",
    name: "Sarah Ali",
    email: "sarah.ali@example.com",
    role: "admin",
    status: "pending",
  },
  {
    _id: "4",
    name: "Ali Raza",
    email: "ali.raza@example.com",
    role: "user",
    status: "approved",
  },
  {
    _id: "5",
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    role: "admin",
    status: "pending",
  },
  {
    _id: "6",
    name: "Ahmed Shah",
    email: "ahmed.shah@example.com",
    role: "user",
    status: "pending",
  },
  {
    _id: "7",
    name: "Hassan Javed",
    email: "hassan.javed@example.com",
    role: "admin",
    status: "approved",
  },
];

const AdminPendingUsers: React.FC = () => {
  const [users, setUsers] = useState<PendingUser[]>(MOCK_USERS);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const approveUser = (userId: string) => {
    setApprovingId(userId);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status: "approved" } : u
        )
      );
      setApprovingId(null);
    }, 1000); // simulate API delay
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <Nav/>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        Pending Admin Users
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition-colors duration-150"
              >
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
                        approvingId === user._id
                          ? "opacity-70 cursor-not-allowed"
                          : ""
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
  );
};

export default AdminPendingUsers;
