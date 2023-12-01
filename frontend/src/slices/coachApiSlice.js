import { apiSlice } from "./apiSlice";

const COACH_URL = "api/coach";

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
      }),
    }),
    addService: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/addService`,
        method: "POST",
        body: data,
      }),
    }),
    getServices: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/getServices`,
        method: "GET",
      }),
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `${COACH_URL}/delete/${id}`,
        method: "POST",
      }),
    }),
    addTimeSlot: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/addTimeSlot`,
        method: "POST",
        body: data,
      }),
    }),
    listBookings: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/bookings`,
        method: "GET",
      }),
    }),
    changeStatus: builder.mutation({
      query: ({ bookingId, status }) => ({
        url: `${COACH_URL}/changeStatus?bookingId=${bookingId}&status=${status}`,
        method: "PATCH",
      }),
    }),
    listReviews: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/reviews`,
        method: "GET",
      }),
    }),
    coachWalletHistory: builder.mutation({
      query: () => ({
        url: `${COACH_URL}/wallet`,
        method: "GET",
      }),
    }),
    uploadVideo: builder.mutation({
      query: (data) => ({
        url: `${COACH_URL}/video`,
        method: "POST",
        body: data,
      }),
    }),
    removeTimeSlot: builder.mutation({
      query: ({timeSlotId,index}) => ({
        url: `${COACH_URL}/removeTimeSlot/${timeSlotId}/${index}`,
        method: "PATCH",
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
