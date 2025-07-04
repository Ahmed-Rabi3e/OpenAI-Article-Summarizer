import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

// const options = {
//   method: "GET",
//   url: "https://article-extractor-and-summarizer.p.rapidapi.com/summarize",
//   params: {
//     url: "https://time.com/6266679/musk-ai-open-letter/",
//     lang: "en",
//     engine: "2",
//   },
//   headers: {
//     "x-rapidapi-key": "5e9af7a955mshb380f426df4954dp1fe563jsn8444f0b9daf7",
//     "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
//   },
// };

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        "5e9af7a955mshb380f426df4954dp1fe563jsn8444f0b9daf7"
      );
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      // encodeURIComponent() function encodes special characters that may be present in the parameter values
      // If we do not properly encode these characters, they can be misinterpreted by the server and cause errors or unexpected behavior. Thus that RTK bug
      query: (params) =>
        `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
