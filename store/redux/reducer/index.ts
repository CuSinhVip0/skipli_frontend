import { combineReducers } from "@reduxjs/toolkit"
import settingSlice from "../slice/setting"
import userSlice from "../slice/user"
const reducer = combineReducers({
    setting: settingSlice,
    user: userSlice,
})

export default reducer
