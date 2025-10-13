import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  User,
  Mail,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Nav from "./Nav";
import { useGetAllComplainsQuery } from "@/redux-toolkit-store/slices/rtk/apiSlices";

interface Complain {
  _id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
}

const ReportsPage: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [lineCounts, setLineCounts] = useState<Record<string, number>>({});
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { data, error, isLoading, isError } =
    useGetAllComplainsQuery(undefined);
  const complains: Complain[] = useMemo(
    () => data?.complains || [],
    [data?.complains]
  );

  const descriptionRefs = useRef<Record<string, HTMLParagraphElement | null>>(
    {}
  );

  useEffect(() => {
    const newLineCounts: Record<string, number> = {};
    Object.entries(descriptionRefs.current).forEach(([id, el]) => {
      if (el) {
        const style = window.getComputedStyle(el);
        const lineHeight = parseFloat(style.lineHeight);
        const lines = Math.round(el.scrollHeight / lineHeight);
        newLineCounts[id] = lines;
      }
    });
    setLineCounts(newLineCounts);
  }, [complains]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-30 transition-transform duration-300 ${
          isNavOpen
            ? "translate-x-0 h-full"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Nav />
      </div>

      {/* Overlay for mobile */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-20"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <div className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            📋 User Complaints
          </h1>

          <button
            className="md:hidden p-2 rounded-md bg-white shadow hover:bg-gray-100 transition"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading complaints...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col justify-center items-center py-20 text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <p className="font-semibold">Failed to load complaints</p>
            <p className="text-sm text-gray-500">
              {error instanceof Error
                ? error.message
                : "Please try again later."}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && complains.length === 0 && (
          <div className="flex flex-col justify-center items-center py-20 text-gray-500">
            <FileText className="w-10 h-10 mb-2 text-gray-400" />
            <p>No complaints found.</p>
          </div>
        )}

        {/* Complaints Grid */}
        {!isLoading && !isError && complains.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complains.map((complain: any) => {
              const isExpanded = expanded[complain._id];
              const lines = lineCounts[complain._id] || 1;

              return (
                <div
                  key={complain._id}
                  className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-800">
                      {complain?.userId?.name || "Unknown"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center mb-2">
                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-600 text-sm break-all">
                      {complain.email || "No email provided"}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col mb-3">
                    <div
                      className="flex items-start mb-1 cursor-pointer select-none"
                      onClick={() => toggleExpand(complain._id)}
                    >
                      <FileText
                        className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <p
                        ref={(el) =>{
                          descriptionRefs.current[complain._id] = el
                        }}
                        className={`text-gray-700 text-sm leading-relaxed transition-all duration-200 ${
                          isExpanded ? "line-clamp-none" : "truncate"
                        }`}
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: isExpanded ? "unset" : 1,
                        }}
                      >
                        {complain.description || "No description available."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {lines > 1 ? `${lines} lines` : "1 line"}
                      </span>
                      <button
                        onClick={() => toggleExpand(complain._id)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            Show less <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            Show more <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="flex items-center justify-end">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">
                      {complain.createdAt
                        ? new Date(complain.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
