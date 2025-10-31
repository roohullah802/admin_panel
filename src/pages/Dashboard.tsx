import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Activity,
  User,
  RefreshCcw,
  Menu,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import type { RootState } from "@/redux-toolkit-store/store/store";
import { useEffect, useMemo, useState } from "react";
import { greetWithTime } from "@/lib/greetings";
import {
  useGetAllActiveLeasesQuery,
  useGetAllActivityQuery,
  useGetAllCarsQuery,
  useGetAllUsersQuery,
  useGetOneWeekCarsQuery,
} from "@/redux-toolkit-store/slices/rtk/apiSlices";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDate } from "@/lib/formatDate";
import Nav from "./Nav";
import { isTokenExpired } from "@/lib/isTokenExpired";

interface ActivityTypes {
  action: string;
  createdAt: Date;
  description: string;
  lease: string;
  user: string;
  _id: string;
}
interface CarTypes {
  available: boolean;
  createdAt: Date;
  modelName: string;
  _id: string;
  images: string;
}

const chartData = [
  { month: "Jan", total: 4000, today: 2400 },
  { month: "Feb", total: 3000, today: 1398 },
  { month: "Mar", total: 2000, today: 9800 },
  { month: "Apr", total: 2780, today: 3908 },
  { month: "May", total: 1890, today: 4800 },
  { month: "Jun", total: 2390, today: 3800 },
  { month: "Jul", total: 3490, today: 4300 },
];

export default function Dashboard() {


    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, [navigate]);





  const [search, setSearch] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const { isLoggedIn, userData } = useSelector(
    (state: RootState) => state.user
  );

  const { data: Users, isLoading: isLoadingUsers } = useGetAllUsersQuery(undefined);
  const { data: Cars, isLoading: isLoadingCars } = useGetAllCarsQuery(undefined);
  const { data: ActiveLeases, isLoading: isLoadingLeases } = useGetAllActiveLeasesQuery(undefined);
  const {
    data: UserActivity,
    isLoading: isLoadingActivity,
    error,
  } = useGetAllActivityQuery(undefined);
  const { data: OneWeekCars, isLoading: isLoadingOneWeekCars, error: errorOneWeekCars } =
    useGetOneWeekCarsQuery(undefined);


  const users = Users?.users;
  const cars = Cars?.cars;
  const leases = ActiveLeases?.leases;
  const activity = UserActivity?.activities;
  const oneweekcars = OneWeekCars?.cars;

  console.log(OneWeekCars);
  

  const filteredCars = useMemo(() => {
    return oneweekcars?.filter((itm: CarTypes) =>
      itm.modelName.includes(search)
    );
  }, [oneweekcars, search]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const stats = [
    {
      title: "Total Users",
      value: isLoadingUsers ? (
        <div className="flex justify-center w-full">
          <ClipLoader loading={isLoadingActivity} color="black" size={20} />
        </div>
      ) : (
        users || 0
      ),
      change: "+9% from last month",
      icon: <User className="bg-[#51AFF3] p-2 rounded-3xl size-10 text-white" />,
    },
    {
      title: "Total Cars",
      value: isLoadingCars ? (
        <div className="flex justify-center w-full">
          <ClipLoader loading={isLoadingActivity} color="black" size={20} />
        </div>
      ) : (
        cars || 0
      ),
      change: "+5% from yesterday",
      icon: <Car className="bg-[#326FF4] p-2 rounded-3xl size-10 text-white" />,
    },
    {
      title: "Active Leases",
      value: isLoadingLeases ? (
        <div className="flex justify-center w-full">
          <ClipLoader loading={isLoadingActivity} color="black" size={20} />
        </div>
      ) : (
        leases?.length || 0
      ),
      change: "+2% from yesterday",
      icon: (
        <Activity className="bg-[#FF9211] p-2 rounded-3xl size-10 text-white" />
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      {/* Sidebar for large screen */}
      <div className="hidden md:block">
        <Nav />
      </div>

      {/* Hamburger Button (mobile + tablet) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300">
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="font-bold text-lg">Menu</h1>
              <button onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <Nav />
          </div>
        </>
      )}

      {/* Main Content */}
      <main
        className="flex-1 p-6 bg-white flex flex-col overflow-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">
            {greetWithTime(userData?.name ? userData?.name : " ")}
          </h1>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(txt) => setSearch(txt.target.value)}
            className="border rounded-lg px-3 py-1 w-full sm:w-60"
          />
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4 flex-shrink-0">
          {stats.map((s, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="flex items-center justify-around p-2">
                {s.icon}
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <h3 className="text-2xl font-bold">{s.value}</h3>
                  <p className="text-xs text-green-600">{s.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lease Analytics */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold mb-2">Lease Analytics</h2>
          <div className="w-full h-[200px]">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="today" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recently Added Cars */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex-shrink-0 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Recently Added Cars</h2>
          <div className="space-y-3">
            {errorOneWeekCars && (
              <div>
                <h1 className="text-red-500">Something went wrong!</h1>
              </div>
            )}
            {isLoadingOneWeekCars ? (
              <ClipLoader loading={isLoadingOneWeekCars} size={20} color="black" />
            ) : (
              filteredCars?.map((item: CarTypes) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <div className="flex gap-2">
                    <div className="p-[5px] rounded-2xl overflow-hidden">
                      <img
                        className="w-18 h-10 rounded-[5px]"
                        src={item?.images[0]}
                        alt="Mercedes"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item?.modelName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-0.2 ${
                      item.available
                        ? "bg-blue-100 text-blue-700 border border-blue-700"
                        : "bg-red-100 text-red-700 border border-red-700"
                    } rounded-2xl`}
                  >
                    {item.available ? "Available" : "Leased"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Recent Activity */}
      <aside className="hidden lg:block w-60 bg-white shadow-lg p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {error && (
          <div className="w-full">
            <h1 className="text-red-500">Something went wrong!</h1>
          </div>
        )}
        {isLoadingActivity ? (
          <div className="flex justify-center w-full">
            <ClipLoader loading={isLoadingActivity} color="black" size={20} />
          </div>
        ) : (
          activity?.map((item: ActivityTypes) => (
            <div
              key={item._id}
              className="w-full h-16 flex justify-center items-center gap-2 mb-4 p-1"
            >
              <div className="h-full">
                <div
                  className={`p-1.5 ${
                    item.action === "Lease Created"
                      ? "bg-blue-100"
                      : "bg-[#FFF8EC]"
                  } rounded-full`}
                >
                  {item.action === "Lease Extended" ? (
                    <RefreshCcw className="text-[#FFDB3D]" size={18} />
                  ) : (
                    <Car className="text-blue-900" size={18} />
                  )}
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-[15px]">{item.action}</h1>
                <div className="text-[8px] font-semibold text-gray-600">
                  {item.description}
                </div>
              </div>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
