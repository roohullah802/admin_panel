import {
  Bell,
  Trash2,
  Key,
  Car,
  Menu,
  X,
  CircleCheck,
  User,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import Nav from "./Nav";
import ClipLoader from "react-spinners/ClipLoader";
import { formatDate } from "@/lib/formatDate";
import {
  useDeleteCarListingMutation,
  useLazyGetCarDetailsQuery,
  useTotalCarssQuery,
} from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { toast } from "react-toastify";

const socket = io("https://api.citycarcenters.com", {
  transports: ["websocket"],
});

function IconCard({
  title,
  value,
  sub,
  Icon,
  col,
}: {
  title: string;
  value: string | number | React.ReactNode;
  sub?: string;
  Icon?: LucideIcon;
  col: string;
}) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-start items-center gap-3">
        {Icon && (
          <Icon className={`${col} text-white rounded-3xl p-2 size-10`} />
        )}
        <div>
          <div className="text-sm text-black">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {sub && <div className="text-xs text-green-600">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export default function CarPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: TotalCars,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useTotalCarssQuery(undefined);

  const [getDetails, { data: CarDetails, isLoading: detailLoading }] =
    useLazyGetCarDetailsQuery();

  const [deleteCar] = useDeleteCarListingMutation();

  const cardetails = CarDetails?.carDetails;

  useEffect(() => {
    socket.on("carDeleted", ({ carId }) => {
      toast.info("Car deleted (real-time update)", { position: "top-center" });
      refetch();
      if (selectedCarId === carId) {
        setSelectedCarId(null);
      }
    });
    return () => {
      socket.off("carDeleted");
    };
  }, [refetch, selectedCarId]);

  const filteredCars = useMemo(() => {
    return TotalCars?.cars?.filter((c: any) =>
      c?.modelName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [TotalCars, search]);

  const handleClick = useCallback(
    (id: string) => {
      getDetails(id);
      setSelectedCarId(id);
    },
    [getDetails]
  );

  const handleDeleteCar = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const response = await deleteCar(id).unwrap();
        if (response.success) {
          toast.success(response.message, { position: "top-center" });
          await refetch();
          if (selectedCarId === id) setSelectedCarId(null);
        } else {
          toast.error(response.message || "Failed to delete car", {
            position: "top-center",
          });
        }
      } catch (error: any) {
        toast.error(error?.message || "Error deleting car", {
          position: "top-center",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [deleteCar, refetch, selectedCarId]
  );

  return (
    <div className="relative bg-gray-200 flex flex-col sm:flex-row min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed sm:static top-0 left-0 h-full sm:h-auto bg-gray-200 z-40 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="sm:hidden flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>
            <X size={28} className="text-gray-800" />
          </button>
        </div>
        <Nav />
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row w-full overflow-hidden">
        <main className="w-full bg-white p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                className="sm:hidden text-gray-800"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={28} />
              </button>
              <h2 className="text-2xl font-bold">Car Management</h2>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <IconCard
              title="Total Cars"
              value={
                isLoading ? (
                  <ClipLoader size={18} color="black" />
                ) : (
                  TotalCars?.cars?.length || 0
                )
              }
              sub="+8% than last month"
              Icon={Car}
              col="bg-[#51AFF3]"
            />
            <IconCard
              title="At Leases"
              value={
                isLoading ? (
                  <ClipLoader size={18} color="black" />
                ) : (
                  TotalCars?.carsLeased?.length || 0
                )
              }
              sub="+5% from yesterday"
              Icon={Key}
              col="bg-[#4CAF50]"
            />
            <IconCard
              title="Available for Lease"
              value={
                isLoading ? (
                  <ClipLoader size={18} color="black" />
                ) : (
                  TotalCars?.availableCars?.length || 0
                )
              }
              sub="+2% from yesterday"
              Icon={CircleCheck}
              col="bg-[#019CD0]"
            />
          </div>

          {/* Cars Table */}
          <div
            className="overflow-x-auto overflow-y-auto h-[300px] rounded-2xl p-4 shadow-sm border border-slate-100 bg-white"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading || isFetching ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader color="black" size={40} />
              </div>
            ) : error ? (
              <div className="text-red-600 text-sm font-medium">
                Failed to load cars. Please try again.
              </div>
            ) : !filteredCars?.length ? (
              <div className="text-center text-gray-500 font-medium">
                No Cars Found
              </div>
            ) : (
              <table className="min-w-full table-auto border-collapse text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="text-slate-800 text-left">
                    <th className="py-3 px-2">Cars</th>
                    <th className="py-3 px-2 text-center">Total Lease</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((u: any) => (
                    <tr
                      key={u._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(u._id);
                      }}
                      className="border-t border-slate-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={u?.images?.[0]}
                            alt={u?.modelName}
                            className="w-20 h-10 rounded-[10px] object-cover"
                          />
                          <div>
                            <div className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                              {u?.modelName.charAt(0).toUpperCase() +
                                u?.modelName.slice(1)}
                            </div>
                            <div className="text-xs text-slate-800">
                              {formatDate(u.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-slate-800 text-center">
                        {u.totalLeases ?? 0}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {u?.available ? "Available" : "Leased"}
                      </td>
                      <td className="py-4 px-2 text-center">
                        {deletingId === u._id ? (
                          <ClipLoader size={18} color="red" />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCar(u._id);
                            }}
                            className="p-2 rounded-md hover:bg-slate-100 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Car Detail Panel */}
        <aside className="bg-white w-full sm:w-[350px] md:w-[400px] p-4 overflow-y-auto mt-4 sm:mt-0">
          {!selectedCarId ? (
            <div className="flex justify-center items-center h-full text-gray-500 text-sm">
              No car selected
            </div>
          ) : detailLoading ? (
            <div className="flex justify-center items-center h-full">
              <ClipLoader color="black" size={40} />
            </div>
          ) : CarDetails ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <img
                  src={cardetails?.images?.[0]}
                  alt={cardetails.modelName}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <div className="font-semibold text-lg">
                  {cardetails?.modelName.charAt(0).toUpperCase() +
                    cardetails?.modelName.slice(1)}
                </div>
                <div className="text-sm text-gray-600">
                  Brand: {cardetails.brand}
                </div>
                <div className="text-sm text-gray-600">
                  Price: ${cardetails.pricePerDay}
                </div>
                <div className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={
                      cardetails.available ? "text-green-600" : "text-red-600"
                    }
                  >
                    {cardetails.available ? "Available" : "Leased"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Created: {formatDate(cardetails.createdAt)}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border flex gap-2 border-slate-100">
                <div className="p-2 w-[50%] bg-blue-50 rounded-lg flex-1 flex flex-col  items-center">
                  <div className="text-sm text-slate-800">
                    {CarDetails?.totalLeases || 0}
                  </div>
                  <div className="text-xs text-blue-800">Total Lease</div>
                </div>
                <div className="p-2 w-[50%] bg-green-50 rounded-lg flex-1 flex flex-col items-center">
                  <div className="text-sm text-slate-800">
                    {CarDetails?.totalRevenue || 0}
                  </div>
                  <div className="text-xs text-green-600">Total Paid</div>
                </div>
              </div>

              {/* Current Lease Section */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="text-[15px] font-semibold mb-2">
                  Current Lease
                </div>

                {!CarDetails?.activeLease ||
                CarDetails.activeLease.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center mt-3">
                    No active lease for this car
                  </div>
                ) : (
                  CarDetails.activeLease.map((lease: any, idx: number) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-3 mb-3 bg-gray-50"
                    >
                      <div className="mt-1 flex gap-1 items-center">
                        <Car color="#456FF3" size={18} />
                        <b>
                          {cardetails?.modelName.charAt(0).toUpperCase() +
                            cardetails?.modelName.slice(1)}
                        </b>
                      </div>

                      <div className="mt-2 text-sm text-gray-800">
                        <div className="flex justify-between">
                          <span>Start:</span>
                          <b>{formatDate(lease.startDate)}</b>
                        </div>
                        <div className="flex justify-between">
                          <span>End:</span>
                          <b>{formatDate(lease.endDate)}</b>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Paid:</span>
                          <b className="text-green-700">
                            ${lease.totalAmount ?? 0}
                          </b>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <b
                            className={
                              lease.status === "active"
                                ? "text-blue-600"
                                : "text-emerald-600"
                            }
                          >
                            {lease.status}
                          </b>
                        </div>
                      </div>

                      {/* User Info */}
                      {lease.user && (
                        <div className="mt-3 border-t pt-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <User size={14} color="#456FF3" />
                            <b>{lease.user.name || "N/A"}</b>
                          </div>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <Mail size={12} color="#456FF3" />
                            <span>{lease.user.email || "N/A"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center">No details found</div>
          )}
        </aside>
      </div>
    </div>
  );
}
