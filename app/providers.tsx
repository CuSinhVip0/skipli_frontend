"use client"

import { createContext, ReactNode, useReducer } from "react"
import { ConfigProvider, App as AntdApp, theme } from "antd"
import viVN from "antd/locale/vi_VN"
import { StyleProvider } from "@ant-design/cssinjs"
import { antdTheme } from "@/styles"
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import store from "@/store/redux"
type SettingState = {
    theme: "light" | "dark"
    name: string
}

type SettingAction =
    | { type: "SET_THEME"; payload: "light" | "dark" }
    | { type: "SET_NAME"; payload: string }

export type SettingContextType = {
    state: SettingState
    dispatch: React.Dispatch<SettingAction>
}

const initStateSetting: SettingState = {
    theme: "light",
    name: "Unknow User",
}

const settingReducer = (state: SettingState, action: SettingAction) => {
    switch (action.type) {
        case "SET_THEME":
            return { ...state, theme: action.payload }
        case "SET_NAME":
            return { ...state, name: action.payload }
        default:
            return state
    }
}

export const SettingContext = createContext<SettingContextType>({} as SettingContextType)

export function Providers({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(settingReducer, initStateSetting)
    return (
        <SessionProvider>
            <Provider store={store}>
                <SettingContext.Provider value={{ state, dispatch }}>
                    <AntdApp>
                        <StyleProvider hashPriority="high">
                            <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
                        </StyleProvider>
                    </AntdApp>
                </SettingContext.Provider>
            </Provider>
        </SessionProvider>
    )
}
