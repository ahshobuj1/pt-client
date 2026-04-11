import { apiSlice } from "./apiSlice";

export const assessmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query({
      query: () => "/assessment/employer/exams",
      providesTags: ["exam"],
    }),
    createExam: builder.mutation({
      query: (data) => ({
        url: "/assessment/employer/exams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["exam"],
    }),
    createQuestion: builder.mutation({
      query: (data) => ({
        url: "/assessment/employer/questions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["exam"],
    }),
    getCandidateExams: builder.query({
      query: () => "/assessment/candidate/exams",
      providesTags: ["exam"],
    }),
    getExamQuestions: builder.query({
      query: (id) => `/assessment/candidate/exams/${id}/questions`,
      providesTags: ["exam"],
    }),
    submitAttempt: builder.mutation({
      query: (data) => ({
        url: "/assessment/candidate/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["exam"],
    }),
  }),
});

export const { 
  useGetExamsQuery, 
  useCreateExamMutation, 
  useCreateQuestionMutation, 
  useGetCandidateExamsQuery,
  useGetExamQuestionsQuery,
  useSubmitAttemptMutation
} = assessmentApi;
