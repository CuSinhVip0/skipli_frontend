"use client"

import { Layout, Menu, Button, Avatar, Dropdown } from "antd"
import {
    LogoutOutlined,
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    MessageOutlined,
} from "@ant-design/icons"
import { useRouter, usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const { Header, Sider, Content } = Layout

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, status } = useSession()

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" })
    }

    const instructorMenuItems = [
        {
            key: "/instructor/manage-students",
            icon: <TeamOutlined />,
            label: "Students",
            onClick: () => router.push("/instructor/manage-students"),
        },
        {
            key: "/instructor/manage-lessons",
            icon: <BookOutlined />,
            label: "Lessons",
            onClick: () => router.push("/instructor/manage-lessons"),
        },
        {
            key: "/instructor/chat",
            icon: <MessageOutlined />,
            label: "Messages",
            onClick: () => router.push("/instructor/chat"),
        },
    ]

    const studentMenuItems = [
        {
            key: "/student/my-lessons",
            icon: <BookOutlined />,
            label: "My Lessons",
            onClick: () => router.push("/student/my-lessons"),
        },
        {
            key: "/student/edit-profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => router.push("/student/edit-profile"),
        },
        {
            key: "/student/chat",
            icon: <MessageOutlined />,
            label: "Messages",
            onClick: () => router.push("/student/chat"),
        },
    ]

    const menuItems = session?.user.role === "instructor" ? instructorMenuItems : studentMenuItems

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
        if (pathname.startsWith("/instructor/chat")) {
            return "/instructor/chat"
        } else if (pathname.startsWith("/instructor/manage-students")) {
            return "/instructor/manage-students"
        } else if (pathname.startsWith("/instructor/manage-lessons")) {
            return "/instructor/manage-lessons"
        } else if (pathname.startsWith("/student/edit-profile")) {
            return "/student/edit-profile"
        } else if (pathname.startsWith("/student/my-lessons")) {
            return "/student/my-lessons"
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
                        {session?.user.role === "instructor"
                            ? "Instructor Dashboard"
                            : "Student Dashboard"}
                    </span>
                </div>

                <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                        <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">
                                {session?.user.name || "User"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {session?.user.email || session?.user.phone}
                            </span>
                        </div>
                    </div>
                </Dropdown>
            </Header>

            <Layout className="h-full">
                <Sider width={220} className="bg-white border-r border-r-gray-200">
                    {status === "authenticated" && (
                        <Menu
                            mode="inline"
                            selectedKeys={[getSelectedKey()]}
                            items={menuItems}
                            className="border-r-0 pt-4"
                        />
                    )}
                </Sider>
                <Content className="bg-gray-50">{children}</Content>
            </Layout>
        </Layout>
    )
}
