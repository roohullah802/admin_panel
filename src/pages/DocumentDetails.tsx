import React, { useState } from "react";
import { ArrowLeft, Check, XCircle, Image as ImageIcon } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import Nav from "./Nav";

interface UserDocuments {
  _id: string;
  name: string;
  email: string;
  documents: string[];
}

const DocumentsDetail: React.FC = () => {
  const [approveLoading, setApproveLoading] = useState(false);

  // ✅ Hardcoded demo users
  const users: UserDocuments[] = [
    {
      _id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      documents: [
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=600",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
        "https://images.unsplash.com/photo-1581091215367-59ab6c647229?w=600",
      ],
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      documents: [
        "https://images.unsplash.com/photo-1603415526960-f7e0328dfe48?w=600",
        "https://images.unsplash.com/photo-1590080875831-bbee4db0e4d8?w=600",
      ],
    },
    {
      _id: "3",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      documents: [
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
      ],
    },
    {
      _id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      documents: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600",
      ],
    },
  ];

  const handleApproval = (approve: boolean, name: string) => {
    setApproveLoading(true);
    setTimeout(() => {
      alert(
        approve
          ? `✅ Documents for ${name} have been approved successfully!`
          : `❌ Documents for ${name} have been rejected!`
      );
      setApproveLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header (Fixed) */}
        <div className="flex items-center gap-4 p-6 border-b bg-white shadow-sm sticky top-0 z-10">
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            <ArrowLeft size={20} />
          </button>

          {/* ✅ Title visible only on md+ screens */}
          <h1 className="hidden sm:block text-2xl font-bold text-gray-800">
            All Users’ Uploaded Documents
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-xl p-5 mb-8 border border-gray-100"
            >
              {/* User Info */}
              <div className="mb-4">
                <p className="text-gray-800 font-semibold text-lg">
                  {user.name}
                </p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              {/* Documents Section */}
              <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon size={18} />
                Uploaded Documents
              </h2>

              {user.documents.length === 0 ? (
                <p className="text-gray-600 text-sm">No documents uploaded.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  {user.documents.map((url, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={url}
                        alt={`document-${index}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Approve/Reject Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleApproval(true, user.name)}
                  disabled={approveLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-70"
                >
                  {approveLoading ? (
                    <ClipLoader color="white" size={16} />
                  ) : (
                    <>
                      <Check size={16} /> Approve
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleApproval(false, user.name)}
                  disabled={approveLoading}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-70"
                >
                  {approveLoading ? (
                    <ClipLoader color="white" size={16} />
                  ) : (
                    <>
                      <XCircle size={16} /> Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsDetail;
