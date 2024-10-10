import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';

export const fetchFunBagActivityList = createAsyncThunk('funActTool/funActToolApi', 
  async (data)=>{
    const response = await Services.post(apiRoot.getFilePathAccToLearningType, data);
    if(response.status=="success"){
      return response.data;
    } else {
      return [];
    }
})  
const FunBagActivityList = createSlice({
  name:"funActTool",
  initialState:{
    data:{},
    loading:true,
    isError:false
  },
  extraReducers:(builder)=>{
        builder.addCase(fetchFunBagActivityList.pending, (state, {payload})=>{
          state.loading = true;
        });
        builder.addCase(fetchFunBagActivityList.fulfilled, (state, {payload})=>{
          state.data = payload;
          state.loading = false;
        });
        builder.addCase(fetchFunBagActivityList.rejected, (state, {payload})=>{
          state.loading = false;
          state.isError = true;
        });
      }
})
export default FunBagActivityList.reducer;