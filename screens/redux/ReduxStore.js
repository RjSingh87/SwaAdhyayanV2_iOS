import { configureStore } from "@reduxjs/toolkit";
import LearningtoolReducer from './slices/LearningToolList'
import ActivityListReducer from './slices/ModuleActivityList'
import FunBagActListReducer from './slices/FunBagActivityList'
import NotificationListReducer from './slices/NotificationList'
import ProfileDataReducer from './slices/ProfileData'
import SearchReducer from './slices/SearchDataList'



const ReduxStore = configureStore({
    reducer: {
        LearningToolList: LearningtoolReducer,
        ActivityToolList: ActivityListReducer,
        FunBagActToolList: FunBagActListReducer,
        NotisList: NotificationListReducer,
        ProfileData: ProfileDataReducer,
        Search: SearchReducer


    }
})
export default ReduxStore