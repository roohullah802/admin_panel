// src/slices/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.citycarcenters.com/api/v1/secure/route/admin",
  }),
  endpoints: (builder) => ({
    signupAdmin:builder.mutation({
      query:(body)=>({
        url:'/signup',
        method:'POST',
        body
      })
    }),
    loginAdmin: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (body)=>({
        url:'/verify-email',
        method:'POST',
        body
      })
    }),

  }),
});

export const { useLoginAdminMutation, useSignupAdminMutation, useVerifyEmailMutation } = authSlice;
