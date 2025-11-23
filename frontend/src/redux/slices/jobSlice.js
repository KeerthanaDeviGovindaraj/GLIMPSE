import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchJobs = createAsyncThunk("jobs/fetch", async () => {
  const res = await api.get("/jobs");
  return res.data;
});

export const createJob = createAsyncThunk("jobs/create", async (jobData) => {
  const res = await api.post("/create/job", jobData);
  return res.data;
});

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(createJob.fulfilled, (state) => {
      });
  },
});

export default jobSlice.reducer;
