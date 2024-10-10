import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';

export const fetModuleActivityList = createAsyncThunk('activityTool/activityToolApi', 
  async (data)=>{
    console.log(data, 'payload')
    const response = await Services.post(apiRoot.getModuleActivityData, data);
    if(response.status=="success"){
      return response.data;
    } else {
      return [];
    }
})  
const ModuleActivityList  = createSlice({
  name:"activityTool",
  initialState:{
    data:{},
    loading:true,
    isError:false,
  },
  extraReducers:(builder)=>{
        builder.addCase(fetModuleActivityList.pending, (state, {payload})=>{
          state.loading = true;
        });
        builder.addCase(fetModuleActivityList.fulfilled, (state, {payload})=>{
          state.data = payload;
          state.loading = false;
        });
        builder.addCase(fetModuleActivityList.rejected, (state, {payload})=>{
          state.loading = false;
          state.isError = true;
        });
      }
})
export default ModuleActivityList.reducer;