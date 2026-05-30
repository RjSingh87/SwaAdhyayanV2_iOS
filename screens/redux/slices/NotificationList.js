import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';

export const fetchNotificationList = createAsyncThunk('notification/functionlist',
  async (data) => {
    const response = await Services.post(apiRoot.notificationList, data);
    if (response.status == "success") {
      // console.log(JSON.stringify(response), 'check response')
      return response.notificationData.notification;
    } else {
      return [];
    }
  })
const NotificationList = createSlice({
  name: "notification",
  initialState: {
    data: {},
    loading: true,
    isError: false
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationList.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(fetchNotificationList.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(fetchNotificationList.rejected, (state, { payload }) => {
      state.loading = false;
      state.isError = true;
    });
  }
})
export default NotificationList.reducer;