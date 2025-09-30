import type { RootState } from '@/redux-toolkit-store/store/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
    baseUrl: "https://api.citycarcenters.com/api/v1/secure/route/admin",
    credentials:'include',
    prepareHeaders: (headers, {getState})=>{
      const t = getState() as RootState;
      const token = t.user.userData?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (builder)=>({
    getAllUsers: builder.query({
        query: ()=> '/totalUsers'
    }),
    getAllCars: builder.query({
      query: ()=> '/totalCars'
    }),
    getAllActiveLeases: builder.query({
      query: ()=> '/activeLeases'
    }),
    getAllActivity: builder.query({
      query:()=> '/recent-activity'
    }),
    getOneWeekCars: builder.query({
      query: ()=> '/recent-cars'
    })



  })

})

export const {useGetAllUsersQuery, useGetAllCarsQuery, useGetAllActiveLeasesQuery, useGetAllActivityQuery, useGetOneWeekCarsQuery} = apiSlice;