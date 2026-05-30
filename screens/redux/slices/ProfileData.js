import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';

export const fetchProfileData = createAsyncThunk('prifileData/profileDataCheck',
  async (data) => {
    console.log(data, 'payload')
    const response = await Services.post(apiRoot.getProfileData, data);

    console.log(JSON.stringify(response))
    if (response.status == "success") {
      return response.data;
    } else {
      return [];
    }
  })
const ProfileData = createSlice({
  name: "prifileData",
  initialState: {
    data: {},
    loading: true,
    isError: false
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfileData.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(fetchProfileData.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(fetchProfileData.rejected, (state, { payload }) => {
      state.loading = false;
      state.isError = true;
    });
  }
})
export default ProfileData.reducer;