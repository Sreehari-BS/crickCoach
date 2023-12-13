import { apiSlice } from "./apiSlice";

const COACH_URL = "https://crickcoach.onrender.com/api/coach";

export const coachApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginCoach: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    registerCoach: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    coachOtpVerify: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/verifyOtp`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateCoach: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/profile`,
        method: "PUT",
        body: data,
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    addService: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/addService`,
        method: "POST",
        body: data,
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    getServices: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/getServices`,
        method: "GET",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `${COACH_URL}/delete/${id}`,
        method: "POST",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    addTimeSlot: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/addTimeSlot`,
        method: "POST",
        body: data,
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    listBookings: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/bookings`,
        method: "GET",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    changeStatus: builder.mutation({
      query: ({ bookingId, status }) => ({
        url: `${COACH_URL}/changeStatus?bookingId=${bookingId}&status=${status}`,
        method: "PATCH",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    listReviews: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/reviews`,
        method: "GET",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    coachWalletHistory: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/wallet`,
        method: "GET",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    uploadVideo: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/video`,
        method: "POST",
        body: data,
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    removeTimeSlot: builder.mutation({
      query: ({timeSlotId,index}) => ({
        url: `${COACH_URL}/removeTimeSlot/${timeSlotId}/${index}`,
        method: "PATCH",
        headers: {
          CoachAccessToken: localStorage.getItem("coachAccessToken"),
          CoachRefreshToken: localStorage.getItem("coachRefreshToken"),
        },
      }),
    }),
    logoutCoach: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginCoachMutation,
  useRegisterCoachMutation,
  useUpdateCoachMutation,
  useAddServiceMutation,
  useGetServicesMutation,
  useDeleteServiceMutation,
  useAddTimeSlotMutation,
  useLogoutCoachMutation,
  useListBookingsMutation,
  useChangeStatusMutation,
  useListReviewsMutation,
  useCoachWalletHistoryMutation,
  useCoachOtpVerifyMutation,
  useUploadVideoMutation,
  useRemoveTimeSlotMutation,
} = coachApiSlice;
