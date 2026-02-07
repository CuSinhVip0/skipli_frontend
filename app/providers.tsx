"use client"

import { ReactNode } from "react"
import { ConfigProvider, App as AntdApp } from "antd"
import viVN from "antd/locale/vi_VN"
import { StyleProvider } from "@ant-design/cssinjs"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AntdApp>
            <StyleProvider hashPriority="high">
                <ConfigProvider
                    locale={viVN}
                    theme={{
                        token: {
                            colorPrimary: "#1890ff",
                            borderRadius: 6,
                            fontFamily: "var(--font-geist)",
                        },
                    }}
                >
                    {children}
                </ConfigProvider>
            </StyleProvider>
        </AntdApp>
    )
}
