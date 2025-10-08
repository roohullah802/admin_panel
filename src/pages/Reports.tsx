import React, { useState, useEffect } from "react";
import { User, Mail, FileText, Calendar } from "lucide-react";

interface Report {
  id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
}

const getRandomReports = (): Report[] => {
  const names = ["John Doe", "Jane Smith", "Ali Khan", "Sofia Ahmed", "Michael Lee"];
  const emails = [
    "john@example.com",
    "jane@example.com",
    "ali.khan@example.com",
    "sofia.ahmed@example.com",
    "michael.lee@example.com",
  ];
  const descriptions = [
    "I faced an issue while submitting my form.",
    "Payment failed but amount was deducted.",
    "The app crashed when uploading files.",
    "Profile picture is not updating.",
    "Unable to reset password.",
  ];

  return Array.from({ length: 8 }, (_, i) => ({
    id: (i + 1).toString(),
    name: names[Math.floor(Math.random() * names.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Generate random data on mount
    setReports(getRandomReports());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          📋 User Reports
        </h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-800">{report.name}</span>
              </div>

              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-600 text-sm">{report.email}</span>
              </div>

              <div className="flex items-start mb-3">
                <FileText className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <p className="text-gray-700 text-sm leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                <p className="text-xs text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
