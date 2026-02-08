"use client"

import { ReactNode } from "react"
import { ConfigProvider, App as AntdApp } from "antd"
import viVN from "antd/locale/vi_VN"
import { StyleProvider } from "@ant-design/cssinjs"
import { antdTheme } from "@/styles"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AntdApp>
            <StyleProvider hashPriority="high">
                <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
            </StyleProvider>
        </AntdApp>
    )
}
