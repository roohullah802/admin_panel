import {
  Bell,
  Trash2,
  UserCheck2,
  Users,
  UsersRoundIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Nav from "./Nav";
import {
  useDeleteUserMutation,
  useGetAllActiveUsersQuery,
  useGetAllUsersQuery,
  useGetAllUserssQuery,
  useGetNewAllUsersQuery,
  useLazyGetUserDetailsQuery,
} from "@/redux-toolkit-store/slices/rtk/apiSlices";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDate } from "@/lib/formatDate";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("https://api.citycarcenters.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function IconCard({
  title,
  value,
  sub,
  Icon,
  col,
}: {
  title: string;
  value: string | number;
  sub?: string;
  Icon?: LucideIcon;
  col: string;
}) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-center items-center gap-2">
        {Icon && <Icon className={`${col} text-white rounded-3xl p-2 size-10`} />}
        <div>
          <div className="text-sm text-black">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {sub && <div className="text-xs text-green-600">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export default function User() {
  const [showActive, setShowActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState<string>("");

  const { data: Userss, isLoading: isLoadingUserss } = useGetAllUserssQuery(undefined);
  const { data: TotalUsers } = useGetAllUsersQuery(undefined);
  const { data: NewUsers, isLoading: isLoadingNewUsers } = useGetNewAllUsersQuery(undefined);
  const { data: ActiveUsers, isLoading: isLoadingActiveUsers } = useGetAllActiveUsersQuery(undefined);

  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();
  const [triggerGetUserDetails, { data: UserDetails, isLoading: isLoadingUserDetails }] =
    useLazyGetUserDetailsQuery();

  useEffect(() => {
    setAllUsers(Userss?.users || []);
  }, [Userss]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  }, [allUsers, search]);

  // Socket listeners
  useEffect(() => {
    socket.on("userDeleted", (id) => {
      setAllUsers((prev) => prev?.filter((u: any) => u?._id !== id?.id));
    });

    socket.on("userAdded", (user) => {
      setAllUsers((prev) => [user, ...prev]);
    });

    return () => {
      socket.off("userDeleted");
      socket.off("userAdded");
    };
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully", {
          position: "top-center",
        });
      } catch (error: any) {
        toast.error(error?.message || "Error deleting user", {
          position: "top-center",
        });
      }
    },
    [deleteUser]
  );

  const handleClick = useCallback(
    (id: string) => {
      setSelectedUserId(id);
      triggerGetUserDetails(id);
    },
    [triggerGetUserDetails]
  );

  return (
    <div className="relative bg-gray-200 flex flex-col sm:flex-row min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed sm:static top-0 left-0 h-full sm:h-auto bg-gray-200 z-40 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        {/* Close button for mobile */}
        <div className="sm:hidden flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>
            <X size={28} className="text-gray-800" />
          </button>
        </div>
        <Nav />
      </div>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row w-full overflow-scroll">
        <main className="w-full bg-white p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <button className="sm:hidden text-gray-800" onClick={() => setMenuOpen(true)}>
                <Menu size={28} />
              </button>

              <div>
                <h2 className="text-2xl font-bold">User management</h2>
                <div className="text-sm text-slate-800 mt-1">
                  Manage users, leases, payments and activity
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg px-3 py-1 w-full sm:w-60 md:w-72"
                />
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <IconCard
              title="Total Users"
              value={
                isLoadingUserss ? (
                  <ClipLoader size={18} color="black" loading={isLoadingUserss} />
                ) : (
                  TotalUsers?.users || 0
                )
              }
              sub="+8% than last month"
              Icon={Users}
              col={"bg-[#51AFF3]"}
            />
            <IconCard
              title="New Users"
              value={
                isLoadingNewUsers ? (
                  <ClipLoader size={18} color="black" loading={isLoadingNewUsers} />
                ) : (
                  NewUsers?.users?.length || 0
                )
              }
              sub="+5% from yesterday"
              Icon={UsersRoundIcon}
              col={"bg-[#019CD0]"}
            />
            <IconCard
              title="Active Users"
              value={
                isLoadingActiveUsers ? (
                  <ClipLoader size={18} color="black" loading={isLoadingActiveUsers} />
                ) : (
                  ActiveUsers?.users?.length || 0
                )
              }
              sub="+2% from yesterday"
              Icon={UserCheck2}
              col={"bg-green-800"}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-auto h-[300px] dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100">
            <table className="w-full text-left table-auto text-sm">
              <thead className="bg-gray-200 dark:bg-slate-800">
                <tr className="text-slate-800">
                  <th className="py-3 px-2">User</th>
                  <th className="py-3 px-2">Contact</th>
                  <th className="py-3 px-2 text-center">Total lease</th>
                  <th className="py-3 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUserss ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <ClipLoader loading={true} color="black" size={40} />
                    </td>
                  </tr>
                ) : !allUsers || allUsers?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <span className="text-red-600 font-medium">No Users</span>
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((u: any) => (
                    <tr
                      key={u._id}
                      onClick={() => handleClick(u?._id)}
                      className="border-t border-slate-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={u?.profile}
                            alt={u?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex flex-col overflow-hidden">
                            <div className="font-medium truncate max-w-[140px]">
                              {u?.name}
                            </div>
                            <div className="text-xs text-slate-800 truncate max-w-[160px]">
                              Member since {u?.createdAt ? formatDate(u.createdAt) : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-slate-800 truncate">{u?.email}</td>
                      <td className="py-4 px-2 text-center">{u?.totalLeases ?? 0}</td>
                      <td className="py-4 px-2 text-center">
                        <button
                          title="Delete"
                          className="p-2 rounded-md hover:bg-slate-100 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u._id);
                          }}
                        >
                          {isLoadingDelete ? (
                            <ClipLoader size={18} color="black" loading={isLoadingDelete} />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="bg-white w-full sm:w-[350px] md:w-[400px] p-4 overflow-y-auto mt-4 sm:mt-0">
          {isLoadingUserDetails && (
            <div className="flex justify-center items-center h-full">
              <ClipLoader loading={true} size={40} color="black" />
            </div>
          )}

          {!selectedUserId && !isLoadingUserDetails && (
            <div className="flex justify-center items-center h-full text-gray-500 text-sm">
              No user selected
            </div>
          )}

          {selectedUserId && !isLoadingUserDetails && UserDetails?.userDetailss && (
            <div className="space-y-4 w-full">
              {/* User Info */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={UserDetails?.userDetailss?.profile}
                    alt={UserDetails?.userDetailss?.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="overflow-hidden">
                    <div className="font-semibold truncate">{UserDetails?.userDetailss?.name}</div>
                    <div className="text-xs text-slate-800 truncate">
                      {UserDetails?.userDetailss?.email}
                    </div>
                    <div className="text-xs text-slate-800">
                      Member since {formatDate(UserDetails?.userDetailss?.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="p-2 bg-blue-50 rounded-lg flex-1 text-center">
                    <div className="text-sm text-slate-800">
                      {UserDetails?.LeasesLength || 0}
                    </div>
                    <div className="text-xs text-blue-800">Total Lease</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg flex-1 text-center">
                    <div className="text-sm text-slate-800">
                      {UserDetails?.totalPaid || 0}
                    </div>
                    <div className="text-xs text-green-600">Total Paid</div>
                  </div>
                </div>
              </div>

              {/* Active leases */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <button
                  onClick={() => setShowActive(!showActive)}
                  className="flex justify-between items-center w-full text-sm text-black mb-2"
                >
                  Active leases ({UserDetails?.activeLeases?.length})
                  {showActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {showActive && (
                  <div className="space-y-3">
                    {UserDetails?.activeLeases?.map((lease) => (
                      <div className="p-3 bg-blue-50 rounded-lg" key={lease._id}>
                        <div className="text-sm font-medium flex items-center">
                          <span>
                            {lease?.car?.modelName.charAt(0).toUpperCase() +
                              lease?.car?.modelName.slice(1)}
                          </span>
                          <span className="text-xs inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-blue-600 text-white">
                            {lease?.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-800 mt-2">
                          Start date: {formatDate(lease?.startDate)}
                        </div>
                        <div className="text-xs text-slate-800">
                          End date: {formatDate(lease?.endDate)}
                        </div>
                        <div className="text-sm">
                          Total paid: <strong>${lease?.totalAmount}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed leases */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex justify-between items-center w-full text-sm text-black mb-2"
                >
                  Completed leases ({UserDetails?.completedLeases?.length})
                  {showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {showCompleted && (
                  <div className="space-y-3">
                    {UserDetails?.completedLeases?.map((lease) => (
                      <div className="p-3 bg-emerald-50 rounded-lg" key={lease._id}>
                        <div className="text-sm font-medium">
                          {lease?.car?.modelName.charAt(0).toUpperCase() +
                            lease?.car?.modelName.slice(1)}{" "}
                          <span className="text-xs inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {lease?.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-800 mt-2">
                          Start date: {formatDate(lease?.startDate)}
                        </div>
                        <div className="text-xs text-slate-800">
                          End date: {formatDate(lease?.endDate)}
                        </div>
                        <div className="text-sm">
                          Total paid: <strong>${lease?.totalAmount}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
