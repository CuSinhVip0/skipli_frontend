import type { ThemeConfig } from "antd"

export const antdTheme: ThemeConfig = {
    token: {
        colorPrimary: "#1677ff",
        colorSuccess: "#52c41a",
        colorWarning: "#faad14",
        colorError: "#ff4d4f",
        colorInfo: "#1677ff",
        borderRadius: 6,
        fontSize: 14,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
        Table: {
            headerBg: "#fafafa",
            headerColor: "#262626",
        },
        Card: {
            headerBg: "#ffffff",
            colorBorderSecondary: "#f0f0f0",
        },
        Button: {
            primaryShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
        },
        Layout: {
            headerBg: "#ffffff",
            bodyBg: "#f5f5f5",
            siderBg: "#ffffff",
        },
    },
}
