import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAdminLogoutMutation } from "@/redux-toolkit-store/slices/rtk/AuthSlices";
import { clearUserData } from "@/redux-toolkit-store/slices/userSlice/userSlice";
import { X, LogOut } from "lucide-react";

interface LogoutProps {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const Logout: React.FC<LogoutProps> = ({ open, onClose, isAdmin = false }) => {
  const [logout, { isLoading }] = useAdminLogoutMutation();
  const dispatch = useDispatch();

  if (!open) return null;

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(clearUserData());
      toast.success("✅ Logged out successfully");

      onClose();

      setTimeout(() => {
        window.location.href = isAdmin ? "/login" : "/login";
      }, 500);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message || "❌ Logout failed. Please try again.")
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut size={28} className="text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Logout
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to log out of your account?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`px-5 py-2 rounded-lg text-white ${
              isLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
