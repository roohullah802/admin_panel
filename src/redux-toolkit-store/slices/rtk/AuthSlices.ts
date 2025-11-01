// src/slices/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Clerk } from "@clerk/clerk-js";

const clerk = new Clerk('pk_test_Ym9sZC1kdWNrbGluZy03MC5jbGVyay5hY2NvdW50cy5kZXYk');
await clerk.load();

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.citycarcenters.com/api/v1/secure/route/admin",
   async prepareHeaders(headers) {
      const token = await clerk.session?.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`); 
      }
      return headers
    },

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
    adminLogout: builder.mutation({
      query:()=>({
        url:'/logout',
        method:'POST'
      })
    }),




  }),
});

export const { useLoginAdminMutation, useSignupAdminMutation, useVerifyEmailMutation, useAdminLogoutMutation } = authSlice;
