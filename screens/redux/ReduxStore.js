import { configureStore } from "@reduxjs/toolkit";
import LearningtoolReducer from './slices/LearningToolList'
import ActivityListReducer from './slices/ModuleActivityList'
import FunBagActListReducer from './slices/FunBagActivityList'

const ReduxStore = configureStore({
    reducer:{
        LearningToolList:LearningtoolReducer,
        ActivityToolList:ActivityListReducer,
        FunBagActToolList:FunBagActListReducer
    }
})
export default ReduxStore