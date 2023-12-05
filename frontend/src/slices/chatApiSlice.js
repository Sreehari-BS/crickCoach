import { apiSlice } from "./apiSlice";

const CHAT_URL = "https://crickcoach.onrender.com/api/chat";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: `${CHAT_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    findUser: builder.mutation({
      query: (memberId) => ({
        url: `${CHAT_URL}/${memberId}`,
        method: "GET",
      }),
    }),
    findChat: builder.mutation({
      query: ({userId, coachId}) => ({
        url: `${CHAT_URL}/find/${userId}/${coachId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useFindUserMutation,
  useFindChatMutation,
} = chatApiSlice;
