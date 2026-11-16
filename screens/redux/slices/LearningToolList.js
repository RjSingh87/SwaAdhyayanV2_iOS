import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';

export const fetchLearningTool = createAsyncThunk('learningTool/learningToolApi',
  async (data) => {

    const response = await Services.post(apiRoot.getLearningToolsList, data);
    if (response.status == "success") {
      return response.data;
    } else {
      return [];
    }
  })
const LearningToolList = createSlice({
  name: "learingTool",
  initialState: {
    data: {},
    loading: true,
    isError: false
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLearningTool.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(fetchLearningTool.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(fetchLearningTool.rejected, (state, { payload }) => {
      state.loading = false;
      state.isError = true;
    });
  }
})
export default LearningToolList.reducer;