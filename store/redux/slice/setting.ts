import { createSlice } from "@reduxjs/toolkit"

const settingSlice = createSlice({
    name: "setting",
    initialState: {
        theme: "light",
        grid: "list",
    },
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload
        },
    },
})

export default settingSlice.reducer
