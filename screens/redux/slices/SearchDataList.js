import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';

export const fetchSearchDataList = createAsyncThunk(
  'searchData/searchDataList',
  async (data) => {
    const response = await Services.post(apiRoot.searchSwaadhyayan, data);

    if (response.status == 'success') {
      const final = [];
      if (response.data.tools != undefined) {
        final.push(...response.data.tools);
      }
      if (response.data.cbse != undefined) {
        final.push(...response.data.cbse);
      }
      return final;
    } else {
      return [];
    }
  }
);
const initialState = {
  data: {},
  loading: true,
  isError: false,
};
const SearchDataList = createSlice({
  name: 'searchData',
  initialState,
  reducers: {
    resetSearchDataList: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchDataList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSearchDataList.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
      })
      .addCase(fetchSearchDataList.rejected, (state) => {
        state.loading = false;
        state.isError = true;
      });
  },
});

// ✅ Step 3: Export reset action and reducer
export const { resetSearchDataList } = SearchDataList.actions;
export default SearchDataList.reducer;
