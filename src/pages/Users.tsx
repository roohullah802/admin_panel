import { Bell, Trash2, UserCheck2, Users, UsersRoundIcon, ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { useState } from "react";
import Nav from "./Nav";
import { useGetAllUserssQuery } from "@/redux-toolkit-store/slices/rtk/apiSlices";

type Lease = {
  id: string;
  car: string;
  start: string;
  end: string;
  monthly?: string;
  totalPaid: string;
  status: "active" | "completed";
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalLeases: number;
  avatar?: string;
  leases: Lease[];
};

const sampleUsers: User[] = [
  {
    id: "u1",
    name: "Maren Curtis",
    email: "john.doe@gmail.com",
    phone: "+1 231 222 9012",
    memberSince: "Jun 2023",
    totalLeases: 3,
    avatar: "/avatar-1.jpg",
    leases: [
      {
        id: "l1",
        car: "Tesla Model 3",
        start: "15/01/2024",
        end: "15/01/2025",
        monthly: "$599",
        totalPaid: "$7,188",
        status: "active",
      },
      {
        id: "l1",
        car: "Tesla Model 3",
        start: "15/01/2024",
        end: "15/01/2025",
        monthly: "$599",
        totalPaid: "$7,188",
        status: "active",
      },
      {
        id: "l2",
        car: "BMW i4",
        start: "01/02/2023",
        end: "01/02/2024",
        monthly: "$550",
        totalPaid: "$6,600",
        status: "completed",
      },
      {
        id: "l2",
        car: "BMW i4",
        start: "01/02/2023",
        end: "01/02/2024",
        monthly: "$550",
        totalPaid: "$6,600",
        status: "completed",
      },
    ],
  },
];

function IconCard({
  title,
  value,
  sub,
  Icon,
  col,
}: {
  title: string;
  value: string;
  sub?: string;
  Icon?: LucideIcon;
  col: string;
}) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-center items-center gap-2">
        <div>{Icon && <Icon className={`${col} text-white rounded-3xl p-2 size-10`} />}</div>
        <div>
          <div className={`text-sm text-black`}>{title}</div>
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

  const {data: Userss, error} = useGetAllUserssQuery(undefined);

  console.log(error);
  

  const user = sampleUsers[0]; 
  
  const activeLeases = user.leases.filter((l) => l.status === "active");
  const completedLeases = user.leases.filter((l) => l.status === "completed");

  return (
    <div className="max-w-[1400px] h-screen overflow-hidden bg-gray-200 flex flex-row">
      <Nav />
      <div className="flex flex-row overflow-scroll w-full" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {/* Main content */}
        <main className="w-full bg-white p-4 flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-2xl font-bold">User management</h2>
              <div className="text-sm text-slate-800 mt-1">Manage users, leases, payments and activity</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input type="text" placeholder="Search..." className="border rounded-lg px-3 py-1 w-full sm:w-60" />
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* top cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 shrink-0">
            <IconCard title="Total Users" value="2412K" sub="+8% than last month" Icon={Users} col={"bg-[#51AFF3]"} />
            <IconCard title="New Users" value="100" sub="+5% from yesterday" Icon={UsersRoundIcon} col={"bg-[#019CD0]"} />
            <IconCard title="Active Users" value="901" sub="+2% from yesterday" Icon={UserCheck2} col={"bg-green-800"} />
          </div>

          {/* table card */}
          <div
            className="h-full overflow-scroll dark:bg-slate-800  rounded-2xl p-4 shadow-sm border border-slate-100"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <table className="w-full text-left table-auto">
              <thead className=" bg-gray-200 dark:bg-slate-800">
                <tr className="text-sm text-slate-800">
                  <th className="py-3 text-slate-800">User</th>
                  <th className="py-3 text-slate-800">Contact</th>
                  <th className="py-3 text-slate-800">Total lease</th>
                  <th className="py-3 text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleUsers.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || "/avatar-placeholder.png"} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-slate-800">Member since {u.memberSince}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-500">
                      <div className="text-slate-800">{u.email}</div>
                    </td>
                    <td className="py-4 text-slate-800">
                      {u.totalLeases} lease{u.totalLeases > 1 ? "s" : ""}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2 items-center">
                        <button title="Edit" className="p-2 rounded-md hover:bg-slate-100"></button>
                        <button title="Delete" className="p-2 rounded-md hover:bg-slate-100 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Right panel */}
        <aside className=" bg-white  overflow-scroll p-4 " style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="sticky top-4 space-y-4 w-full">
            {/* Profile summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-slate-800">{user.email}</div>
                  <div className="text-xs text-slate-800">Member since {user.memberSince}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-2 w-[300px] overflow-hidden">
                <div className="p-2 bg-blue-50 rounded-lg flex justify-center flex-col items-center">
                  <div className="text-[12px] text-slate-800">{user.totalLeases}</div>
                  <div className="text-[10px] text-blue-800">Total Lease</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg flex justify-center flex-col items-center">
                  <div className="text-sm text-slate-800">$44</div>
                  <div className="text-xs text-green-600">Total Paid</div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg flex justify-center flex-col items-center">
                  <div className="text-sm text-slate-800">0</div>
                  <div className="text-xs text-red-800">Unpaid</div>
                </div>
              </div>
            </div>

            {/* Active Leases dropdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100">
              <button
                onClick={() => setShowActive(!showActive)}
                className="flex justify-between items-center w-full text-sm text-black mb-2"
              >
                Active leases ({activeLeases.length})
                {showActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {showActive && (
                <div className="space-y-3">
                  {activeLeases.map((lease) => (
                    <div key={lease.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium flex">
                        <span>{lease.car}</span>
                        <span className="text-xs inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-blue-600 text-white">Active</span>
                      </div>
                      <div className="text-xs text-slate-800 mt-2">Start date: {lease.start}</div>
                      <div className="text-xs text-slate-800">End date: {lease.end}</div>
                      <div className="text-sm">Total paid: <strong>{lease.totalPaid}</strong></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Leases dropdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex justify-between items-center w-full text-sm text-black mb-2"
              >
                Completed leases ({completedLeases.length})
                {showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {showCompleted && (
                <div className="space-y-3">
                  {completedLeases.map((lease) => (
                    <div key={lease.id} className="p-3 bg-emerald-50 rounded-lg">
                      <div className="text-sm font-medium">
                        {lease.car}{" "}
                        <span className="text-xs inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          Completed
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 mt-2">Start date: {lease.start}</div>
                      <div className="text-xs text-slate-800">End date: {lease.end}</div>
                      {lease.monthly && (
                        <div className="text-sm mt-3">Monthly payment: <strong>{lease.monthly}</strong></div>
                      )}
                      <div className="text-sm">Total paid: <strong>{lease.totalPaid}</strong></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
