import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, XCircle, Image as ImageIcon, X } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import Nav from "./Nav";
import {
  useAdminApproveDocumentsMutation,
  useAdminRejectDocumentsMutation,
  useUserDocumentsQuery,
} from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { useAuth } from "@clerk/clerk-react";

interface UserDocuments {
  id: string;
  name: string;
  email: string;
  documents: string[];
  documentStatus: "notVerified" | "verified" | "rejected";
}

const DocumentsDetail: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [users, setUsers] = useState<UserDocuments[]>([]);
  const [loading, setLoading] = useState(true);

  const { data, refetch } = useUserDocumentsQuery({}, { skip: !isSignedIn });
  const [approveDocuments, { isLoading: isLoadingApprove }] = useAdminApproveDocumentsMutation();
  const [rejectDocuments, { isLoading: isLoadingReject }] = useAdminRejectDocumentsMutation();

  useEffect(() => {
    console.log(data);    
    if (data?.success) {
      const mappedUsers = data?.documents?.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        documentStatus: user.documentStatus,
        documents: Object.values(user.images || {}),
      }));
      setUsers(mappedUsers);
    }
    setLoading(false);
    
  }, [data]);
  console.log(users);
  
  

  const handleApproval = async (approve: boolean, userId: string) => {
    try {
      if (approve) {
        await approveDocuments(userId).unwrap();
      } else {
        await rejectDocuments(userId).unwrap();
      }
      await refetch();
    } catch (error) {
      console.error("Error updating document status", error);
      alert("Failed to update document status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={40} />
      </div>
    );
  }

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
          <h1 className="hidden sm:block text-2xl font-bold text-gray-800">
            All Users’ Uploaded Documents
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {users?.length === 0 ? (
            <p className="text-gray-600 text-center mt-10">No users found</p>
          ) : (
            users?.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-md rounded-xl p-5 mb-8 border border-gray-100"
              >
                {/* User Info */}
                <div className="mb-4">
                  <p className="text-gray-800 font-semibold text-lg">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>

                {/* Documents Section */}
                <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Uploaded Documents
                </h2>

                {user?.documents?.length === 0 ? (
                  <p className="text-gray-600 text-sm">No documents uploaded.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                    {user.documents.map((url, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                        onClick={() => setSelectedImage(url)}
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
                    onClick={() => handleApproval(true, user.id)}
                    disabled={user.documentStatus === "verified" || isLoadingApprove}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-70"
                  >
                    {isLoadingApprove ? <ClipLoader color="white" size={16} /> : <><Check size={16} /> Approve</>}
                  </button>

                  <button
                    onClick={() => handleApproval(false, user.id)}
                    disabled={user.documentStatus === "rejected" || user.documentStatus === 'notVerified' || isLoadingReject}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-70"
                  >
                    {isLoadingReject ? <ClipLoader color="white" size={16} /> : <><XCircle size={16} /> Reject</>}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full px-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} />
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsDetail;
