import {
  Car,
  FileTextIcon,
  LayoutDashboard,
  User,
  Wallet,
  ChevronDown,
  ChevronRight,
  Settings,
  Plus,
  HelpCircle,
  Lock,
  CheckCircle,
} from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";
import AddNewCarModal from "./AddNewCarModel";
import FaqModal from "./FaqsModal";
import PrivacyModal from "./PrivacyModal";
import { UserButton } from "@clerk/clerk-react";

function Nav() {
  const [openOptions, setOpenOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <aside className="w-full h-full md:w-40 bg-gray-200 p-4 flex-shrink-0 relative">
      {/* App Title */}
      <h2 className="text-xl font-bold mb-6">
        <i>
          Car<span className="text-blue-900">Lease</span>
        </i>
      </h2>

      <nav className="space-y-2 text-gray-500">
        {/* Add New Car */}
        <NavLink to={"/"} onClick={() => setShowModal(true)}>
          <div className="flex justify-start bg-blue-900 items-center rounded-[6px] hover:bg-blue-800 p-3 mb-2 text-left gap-8">
            <span className="text-[10px] text-white">Add New Car</span>
            <Plus size={12} color="white" />
          </div>
        </NavLink>

        {/* Dashboard */}
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `${isActive ? "bg-blue-800 text-black" : "hover:text-black"}`
          }
        >
          <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
            <LayoutDashboard size={17} />
            <span className="text-[13px]">Dashboard</span>
          </div>
        </NavLink>

        {/* User Management */}
        <NavLink
          to={"/users"}
          className={({ isActive }) =>
            `${isActive ? "text-black" : "hover:text-black"}`
          }
        >
          <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
            <User size={20} />
            <span className="text-[13px]">User Management</span>
          </div>
        </NavLink>

        {/* Cars */}
        <NavLink
          to={"/cars"}
          className={({ isActive }) =>
            `${isActive ? "text-black" : "hover:text-black"}`
          }
        >
          <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
            <Car size={20} />
            <span className="text-[13px]">Cars Management</span>
          </div>
        </NavLink>

        {/* Transactions */}
        <NavLink
          to={"/transaction"}
          className={({ isActive }) =>
            `${isActive ? "text-black" : "hover:text-black"}`
          }
        >
          <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
            <Wallet size={17} />
            <span className="text-[13px]">Transactions</span>
          </div>
        </NavLink>

        {/* Reports */}
        <NavLink
          to={"/reports"}
          className={({ isActive }) =>
            `${isActive ? "text-black" : "hover:text-black"}`
          }
        >
          <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
            <FileTextIcon size={17} />
            <span className="text-[13px]">Reports</span>
          </div>
        </NavLink>

        {/* Options Dropdown */}
        <div>
          <button
            onClick={() => setOpenOptions(!openOptions)}
            className="w-full flex justify-between items-center hover:text-black text-[12px] rounded-lg p-2 text-left gap-2"
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <span className="text-[13px]">Options</span>
            </div>
            {openOptions ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
          </button>

          {/* Nested Options */}
          {openOptions && (
            <div className="ml-6 mt-1 space-y-1 flex flex-col">
              {/* Privacy Settings */}
              <NavLink
                to="/"
                onClick={() => setPrivacyOpen(true)}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-black text-[12px]"
                      : "hover:text-black text-[12px]"
                  } flex items-center gap-2`
                }
              >
                <Lock size={14} />
                <span>Privacy Settings</span>
              </NavLink>

              {/* FAQs */}
              <NavLink
                to={"/"}
                onClick={() => setFaqOpen(true)}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-black text-[12px]"
                      : "hover:text-black text-[12px]"
                  } flex items-center gap-2`
                }
              >
                <HelpCircle size={14} />
                <span>FAQs</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Admin Approval */}
        <NavLink
          to={"/admin-approval-users"}
          className={({ isActive }) =>
            `${isActive ? "text-black" : "hover:text-black"}`
          }
        >
          <div className="flex justify-start items-center rounded-lg p-2 text-left gap-2">
            <CheckCircle size={17} />
            <span className="text-[13px]">Approval</span>
          </div>
        </NavLink>

        {/* Clerk User Button */}
        <div className="flex absolute bottom-2 left-4 items-center gap-2">
          <UserButton />
        </div>
      </nav>

      {/* Modals */}
      <AddNewCarModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <FaqModal open={faqOpen} onClose={() => setFaqOpen(false)} isAdmin={true} />
      <PrivacyModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        isAdmin={true}
      />
    </aside>
  );
}

export default Nav;
