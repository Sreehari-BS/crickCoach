import { apiSlice } from "./apiSlice";

const MESSAGE_URL = "https://crick-coach-azure-app.azurewebsites.net/api/message";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    getMessage: builder.mutation({
      query: (chatId) => ({
        url: `${MESSAGE_URL}/${chatId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAddMessageMutation, useGetMessageMutation } = messageApiSlice;
