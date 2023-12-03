import { apiSlice } from "./apiSlice";

const USER_URL = "https://crick-coach-azure-app.azurewebsites.net/api/user";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/resendOTP`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/googleLogin`,
        method: "POST",
        body: data,
      }),
    }),
    otpVerify: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verifyOtp`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    listCoach: builder.mutation({
      query: () => ({
        url: `${USER_URL}/home`,
        method: "GET",
      }),
    }),
    listCoachService: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/services/${id}`,
        method: "GET",
      }),
    }),
    listAllServices: builder.mutation({
      query: () => ({
        url: `${USER_URL}/allServices`,
        method: "GET",
      }),
    }),
    listCoachByService: builder.mutation({
      query: (serviceName) => ({
        url: `${USER_URL}/listCoachByService?serviceName=${serviceName}`,
        method: "GET",
      }),
    }),
    listAppointmentByUser: builder.mutation({
      query: () => ({
        url: `${USER_URL}/listAppointments`,
        method: "GET",
      }),
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/cancelAppointment/${id}`,
        method: "PATCH",
      }),
    }),
    walletBalance: builder.mutation({
      query: () => ({
        url: `${USER_URL}/walletBalance`,
        method: "GET",
      }),
    }),
    walletPayment: builder.mutation({
      query: ({
        serviceId,
        serviceName,
        duration,
        amount,
        date,
        time,
        coachId,
      }) => ({
        url: `${USER_URL}/walletPayment?serviceId=${serviceId}&serviceName=${serviceName}&duration=${duration}&amount=${amount}&date=${date}&time=${time}&coachId=${coachId}`,
        method: "POST",
      }),
    }),
    addReview: builder.mutation({
      query: ({ rating, comment, appointmentId }) => ({
        url: `${USER_URL}/review?rating=${rating}&comment=${comment}&appointmentId=${appointmentId}`,
        method: "POST",
      }),
    }),
    reviewList: builder.mutation({
      query: (coachId) => ({
        url: `${USER_URL}/review/${coachId}`,
        method: "GET",
      }),
    }),
    userWalletHistory: builder.mutation({
      query: () => ({
        url: `${USER_URL}/wallet`,
        method: "GET",
      }),
    }),
    verifyAppointment: builder.mutation({
      query: (coachId) => ({
        url: `${USER_URL}/verifyCompletedAppointment/${coachId}`,
        method: "GET",
      }),
    }),
    searchCoach: builder.mutation({
      query: (search) => ({
        url: `${USER_URL}/search/${search}`,
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useAddReviewMutation,
  useListCoachMutation,
  useOtpVerifyMutation,
  useResendOtpMutation,
  useReviewListMutation,
  useGoogleAuthMutation,
  useUpdateUserMutation,
  useSearchCoachMutation,
  useWalletPaymentMutation,
  useWalletBalanceMutation,
  useListAllServicesMutation,
  useListCoachServiceMutation,
  useCancelAppointmentMutation,
  useVerifyAppointmentMutation,
  useUserWalletHistoryMutation,
  useListCoachByServiceMutation,
  useListAppointmentByUserMutation,
} = userApiSlice;
