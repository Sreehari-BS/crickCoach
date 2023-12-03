import { apiSlice } from "./apiSlice";

const ADMIN_URL = "https://crick-coach-azure-app.azurewebsites.net/api/admin";

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
      }),
    }),
    getCoachList: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/coachList`,
        method: "GET",
      }),
    }),
    getUnapprovedCoachList: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/unapprovedCoachList`,
        method: "GET",
      }),
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/userList/${id}`,
        method: "PATCH",
      }),
    }),
    unblockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/userList/unblock/${id}`,
        method: "PATCH",
      }),
    }),
    blockCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/coachList/${id}`,
        method: "PATCH",
      }),
    }),
    unblockCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/coachList/unblock/${id}`,
        method: "PATCH",
      }),
    }),
    approveCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/unapprovedCoachList/approve/${id}`,
        method: "PATCH",
      }),
    }),
    rejectCoach: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/unapprovedCoachList/reject/${id}`,
        method: "DELETE",
      }),
    }),
    coachAppointments: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/coachAppointments`,
        method: "GET",
      }),
    }),
    appointmentReport: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/appointmentReport`,
        method: "POST",
        body: data,
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
