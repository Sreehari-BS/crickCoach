import { apiSlice } from "./apiSlice";

const ADMIN_URL = "https://crickcoach.onrender.com/api/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    getUserList: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/userList`,
        method: "GET",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    getCoachList: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/coachList`,
        method: "GET",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    getUnapprovedCoachList: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/unapprovedCoachList`,
        method: "GET",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/userList/${id}`,
        method: "PATCH",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    unblockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/userList/unblock/${id}`,
        method: "PATCH",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    blockCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/coachList/${id}`,
        method: "PATCH",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    unblockCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/coachList/unblock/${id}`,
        method: "PATCH",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    approveCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/unapprovedCoachList/approve/${id}`,
        method: "PATCH",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    rejectCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/unapprovedCoachList/reject/${id}`,
        method: "DELETE",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    coachAppointments: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/coachAppointments`,
        method: "GET",
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    appointmentReport: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/appointmentReport`,
        method: "POST",
        body: data,
        headers: {
          AdminAccessToken: localStorage.getItem("adminAccessToken"),
          AdminRefreshToken: localStorage.getItem("adminRefreshToken"),
        },
      }),
    }),
    logoutAdmin: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useGetUserListMutation,
  useGetCoachListMutation,
  useGetUnapprovedCoachListMutation,
  useBlockUserMutation,
  useBlockCoachMutation,
  useUnblockUserMutation,
  useUnblockCoachMutation,
  useApproveCoachMutation,
  useRejectCoachMutation,
  useCoachAppointmentsMutation,
  useAppointmentReportMutation,
  useLogoutAdminMutation,
} = adminApiSlice;
