import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.citycarcenters.com/api/v1/secure/route/admin",
  credentials: "include",

  prepareHeaders: async (headers) => {
    try {
     
      const token = await window.Clerk?.session?.getToken();
      console.log(token);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      } else {
        console.warn("⚠️ No Clerk token found — user may not be signed in");
      }
    } catch (err) {
      console.error("❌ Error fetching Clerk token:", err);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    // ==== USERS ====
    getAllUsers: builder.query({ query: () => "/totalUsers" }),
    getAllCars: builder.query({ query: () => "/totalCars" }),
    getAllActiveLeases: builder.query({ query: () => "/activeLeases" }),
    getAllActivity: builder.query({ query: () => "/recent-activity" }),
    getOneWeekCars: builder.query({ query: () => "/recent-cars" }),

    getNewAllUsers: builder.query({ query: () => "/new-users" }),
    getAllActiveUsers: builder.query({ query: () => "/active/users" }),
    getAllUserss: builder.query({ query: () => "/all/users" }),
    getUserDetails: builder.query({ query: (id) => `/user/details/${id}` }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete/user/${id}`,
        method: "DELETE",
      }),
    }),

    // ==== CARS ====
    totalCarss: builder.query({ query: () => "/total-cars-for-car-management" }),
    getCarDetails: builder.query({ query: (id) => `/car-details/${id}` }),

    deleteCarListing: builder.mutation({
      query: (id) => ({
        url: `/delete/car-listing/${id}`,
        method: "DELETE",
      }),
    }),

    addNewCar: builder.mutation({
      query: (body) => ({
        url: "/car-listing",
        method: "POST",
        body,
      }),
    }),

    updateCar: builder.mutation({
      query: ({ carId, ...body }) => ({
        url: `/update-car/${carId}`,
        method: "PATCH",
        body,
      }),
    }),

    // ==== SETTINGS ====
    setFaqs: builder.mutation({
      query: (body) => ({
        url: "/set-faqs",
        method: "POST",
        body,
      }),
    }),

    setPolicy: builder.mutation({
      query: (body) => ({
        url: "/set-policy",
        method: "POST",
        body,
      }),
    }),

    // ==== STATS ====
    getOneWeekUsers: builder.query({ query: () => "/new-users" }),
    getActiveUsers: builder.query({ query: () => "/active/users" }),
    getTotalUsers: builder.query({ query: () => "/all/users" }),
    getAllComplains: builder.query({ query: () => "/user-complains" }),
    getTransactions: builder.query({ query: () => "/transactions" }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllCarsQuery,
  useGetAllActiveLeasesQuery,
  useGetAllActivityQuery,
  useGetOneWeekCarsQuery,
  useGetNewAllUsersQuery,
  useGetAllUserssQuery,
  useGetAllActiveUsersQuery,
  useDeleteUserMutation,
  useLazyGetUserDetailsQuery,
  useTotalCarssQuery,
  useLazyGetCarDetailsQuery,
  useDeleteCarListingMutation,
  useAddNewCarMutation,
  useSetFaqsMutation,
  useSetPolicyMutation,
  useGetOneWeekUsersQuery,
  useGetActiveUsersQuery,
  useGetTotalUsersQuery,
  useGetAllComplainsQuery,
  useGetTransactionsQuery,
  useUpdateCarMutation,
} = apiSlice;
