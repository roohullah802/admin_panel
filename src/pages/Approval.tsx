import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import AdminPendingUsers from "./AdminPendingUsers";
import DocumentsVerification from "./DocumentsVerification";

const Approval: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"admin" | "documents">("admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (option: "admin" | "documents") => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      {/* Dropdown Section */}
      <div className="relative w-full max-w-sm mb-6">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex justify-between items-center bg-white shadow-md rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
        >
          <span className="font-medium text-sm md:text-base">
            {selectedOption === "admin"
              ? "Admin Approval"
              : "Documents Verification"}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute w-full bg-white mt-2 rounded-lg shadow-lg border border-gray-100 z-20">
            <button
              onClick={() => handleSelect("admin")}
              className={`w-full text-left px-4 py-2 text-sm md:text-base hover:bg-blue-50 rounded-t-lg ${
                selectedOption === "admin" ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              Admin Approval
            </button>
            <button
              onClick={() => handleSelect("documents")}
              className={`w-full text-left px-4 py-2 text-sm md:text-base hover:bg-blue-50 rounded-b-lg ${
                selectedOption === "documents" ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              Documents Verification
            </button>
          </div>
        )}
      </div>

      {/* Render Components Conditionally */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-4 md:p-6">
        {selectedOption === "admin" ? (
          <AdminPendingUsers />
        ) : (
          <DocumentsVerification />
        )}
      </div>
    </div>
  );
};

export default Approval;
