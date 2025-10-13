import React, { useState, useCallback } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  CreditCard,
  DollarSign,
} from "lucide-react";
import Nav from "./Nav";
import { useGetTransactionsQuery } from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { formatDate } from "@/lib/formatDate";


const TransactionsPage: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const {data} = useGetTransactionsQuery(undefined);
  


  const toggleNav = useCallback(() => {
    setIsNavOpen((prev) => !prev);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-30 transition-transform duration-300 ${
          isNavOpen ? "translate-x-0 h-full" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Nav />
      </div>

      {/* Overlay */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-20"
          onClick={toggleNav}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Transactions
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:flex items-center bg-white border rounded-full px-3 py-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transaction"
                className="text-sm outline-none px-2 w-40 md:w-56"
              />
            </div>

            <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>

            <button
              className="md:hidden p-2 rounded-md bg-white shadow hover:bg-gray-100 transition"
              onClick={toggleNav}
            >
              {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-6">
          <div className="bg-white rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Transactions</span>
              <CreditCard className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">{data?.totalTransactions || 0}</h2>
            <p className="text-xs text-green-500">+8% than last month</p>
          </div>

          <div className="bg-white rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold">${data?.totalRevenue || 0}</h2>
            <p className="text-xs text-red-500">-5% from last month</p>
          </div>
        </div>

        {/* Table */}
       <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Latest Transactions</h2>
          <p className="text-xs text-gray-500">
            {data?.totalTransactions.length} transactions found
          </p>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-700 text-xs uppercase bg-gray-50 border-b">
              <th className="py-3 px-3">User</th>
              <th className="px-3">Car Model</th>
              <th className="px-3 w-28">Lease Duration</th>
              <th className="px-3 w-28">Amount</th>
              <th className="px-3 w-28">Date</th>
              <th className="px-3 w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.leases.map((l) => (
              <tr
                key={l._id}
                className="border-b hover:bg-gray-50 transition-all duration-150"
              >
                {/* USER INFO */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <img
                      src={l.user.profile}
                      alt={l.user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate max-w-[120px]">
                        {l.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]">
                        {l.user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* CAR MODEL */}
                <td className="text-gray-700 px-3 max-w-[150px] truncate">
                  {l.car.modelName}
                </td>

                {/* LEASE DURATION */}
                <td className="text-gray-700 px-3 whitespace-nowrap">
                  {l?.startDate && l?.endDate ? `${Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime())/ (1000 * 60 * 60 * 24))} days` : '-'}
                </td>

                {/* PAYMENT AMOUNT */}
                <td className="text-gray-700 px-3 whitespace-nowrap">
                  ${l.totalAmount}
                </td>


                {/* PAYMENT DATE */}
                <td className="text-gray-700 px-3 whitespace-nowrap">
                  {formatDate(l.startDate)}
                </td>

                {/* status */}
                 <td className={`${l.status === 'active' ? "text-green-700" : "text-red-500"} px-3 whitespace-nowrap`}>
                  {l.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
