import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Menu, X, Check, XCircle } from "lucide-react";
import Nav from "./Nav";
import {
  useAdminApprovalMutation,
  useAdminDisApprovalMutation,
  useGetAllAdminPendingApprovalQuery,
} from "@/redux-toolkit-store/slices/rtk/apiSlices";

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const AdminPendingUsers: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [disapprovingId, setDisapprovingId] = useState<string | null>(null);
  const [localUsers, setLocalUsers] = useState<PendingUser[]>([]);

  const { data, isLoading, isError, refetch } = useGetAllAdminPendingApprovalQuery({});

  const [AdminApproval,{isLoading: isLoadingApproval}] = useAdminApprovalMutation();
  const [AdminDisApproval, {isLoading: isLoadingDisApproval}] = useAdminDisApprovalMutation();


  React.useEffect(() => {
    if (data?.users) setLocalUsers(data.users);
  }, [data]);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await AdminApproval(id).unwrap();

    
      setLocalUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: "approved" } : u
        )
      );
    } catch (err) {
      console.error("Approval error:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleDisapprove = async (id: string) => {
    setDisapprovingId(id);
    try {
      await AdminDisApproval(id).unwrap();
      await refetch(); 
    } catch (err) {
      console.error("Disapproval error:", err);
    } finally {
      setDisapprovingId(null);
    }
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

        {/* Loading and error states */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={40} />
          </div>
        ) : isError ? (
          <div className="text-red-500 font-medium">Failed to load data.</div>
        ) : !localUsers || localUsers.length === 0 ? (
          <div className="text-gray-700 font-medium">No pending admins.</div>
        ) : (
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
                  {localUsers.map((user: PendingUser) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
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
                        {user.status === "pending" && (
                          <>
                            {/* Approve Button */}
                            <button
                              className={`flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-150 ${
                                approvingId === user._id
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => handleApprove(user._id)}
                              disabled={
                                approvingId === user._id ||
                                disapprovingId === user._id
                              }
                            >
                              {approvingId === user._id ? (
                                <ClipLoader loading={isLoadingApproval} color="white" size={16} />
                              ) : (
                                <>
                                  <Check size={16} /> Approve
                                </>
                              )}
                            </button>

                            {/* Disapprove Button */}
                            <button
                              className={`flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-150 ${
                                disapprovingId === user._id
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => handleDisapprove(user._id)}
                              disabled={
                                approvingId === user._id ||
                                disapprovingId === user._id
                              }
                            >
                              {disapprovingId === user._id ? (
                                <ClipLoader loading={isLoadingDisApproval} color="white" size={16} />
                              ) : (
                                <>
                                  <XCircle size={16} /> Remove
                                </>
                              )}
                            </button>
                          </>
                        )}
                        {user.status === "approved" && (
                          <span className="text-green-700 font-medium flex items-center gap-1">
                            <Check size={16} /> Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPendingUsers;
