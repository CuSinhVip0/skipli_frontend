"use client"

import { Layout, Menu, Button, Avatar, Dropdown } from "antd"
import { LogoutOutlined, UserOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth"

const { Header, Sider, Content } = Layout

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const instructorMenuItems = [
        {
            key: "/instructor",
            icon: <TeamOutlined />,
            label: "Students",
            onClick: () => router.push("/instructor"),
        },
    ]

    const studentMenuItems = [
        {
            key: "/student",
            icon: <BookOutlined />,
            label: "My Lessons",
            onClick: () => router.push("/student"),
        },
        {
            key: "/student/profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => router.push("/student/profile"),
        },
    ]

    const menuItems = user?.userType === "instructor" ? instructorMenuItems : studentMenuItems

    const dropdownItems = [
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
        },
    ]

    // Determine selected menu key based on pathname
    const getSelectedKey = () => {
        if (pathname === "/instructor" || pathname.startsWith("/instructor/students")) {
            return "/instructor"
        }
        if (pathname.startsWith("/student/profile")) {
            return "/student/profile"
        }
        if (pathname.startsWith("/student")) {
            return "/student"
        }
        return pathname
    }

    return (
        <Layout className="h-screen">
            <Header className="flex justify-between items-center bg-white border-b border-b-gray-200 px-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-blue-600 m-0">
                        Classroom Management Platform
                    </h1>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">
                        {user?.userType === "instructor"
                            ? "Instructor Dashboard"
                            : "Student Dashboard"}
                    </span>
                </div>

                <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                        <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">
                                {user?.name || "User"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {user?.email || user?.phone}
                            </span>
                        </div>
                    </div>
                </Dropdown>
            </Header>

            <Layout className="h-full">
                <Sider width={220} className="bg-white border-r border-r-gray-200">
                    <Menu
                        mode="inline"
                        selectedKeys={[getSelectedKey()]}
                        items={menuItems}
                        className="border-r-0 pt-4"
                    />
                </Sider>
                <Content className="bg-gray-50">{children}</Content>
            </Layout>
        </Layout>
    )
}
