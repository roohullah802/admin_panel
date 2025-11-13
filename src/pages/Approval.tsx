import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import AdminPendingUsers from "./AdminPendingUsers";
import DocumentsDetail from "./DocumentDetails";

const Approval: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"admin" | "documents">("admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (option: "admin" | "documents") => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Dropdown Section */}
      <div
        className="
          fixed top-4 right-4 z-50
          w-[200px] sm:w-[250px] md:w-[300px]
        "
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex justify-between items-center bg-white shadow-md rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-700 hover:bg-gray-50 transition"
        >
          <span className="font-medium text-xs sm:text-sm md:text-base">
            {selectedOption === "admin"
              ? "Admin Approval"
              : "Documents Verification"}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {dropdownOpen && (
          <div
            className="
              absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50
            "
          >
            <button
              onClick={() => handleSelect("admin")}
              className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-blue-50 rounded-t-lg ${
                selectedOption === "admin" ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              Admin Approval
            </button>
            <button
              onClick={() => handleSelect("documents")}
              className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-blue-50 rounded-b-lg ${
                selectedOption === "documents" ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              Documents Verification
            </button>
          </div>
        )}
      </div>

      {/* Render Components Conditionally */}
      <div className="w-full bg-white rounded-xl shadow-lg">
        {selectedOption === "admin" ? (
          <AdminPendingUsers />
        ) : (
          <DocumentsDetail />
        )}
      </div>
    </div>
  );
};

export default Approval;
