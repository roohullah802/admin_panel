import React from "react";

const WaitingApproval: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-yellow-100 rounded-full">
          <svg
            className="w-10 h-10 text-yellow-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Awaiting Admin Approval
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Your account has been successfully registered and is currently pending
          approval by the admin. You will receive access to the admin dashboard
          once your account is approved.
        </p>
     
      </div>

      {/* Footer */}
      <p className="mt-6 text-gray-400 text-sm text-center">
        Thank you for your patience.
      </p>
    </div>
  );
};

export default WaitingApproval;
