import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken, JWT } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
export default withAuth(
    async function middleware(req: NextRequest) {
        const token: JWT | null = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        // Check if token is expired (sử dụng exp field của NextAuth)
        if (token && token.data.validity.refresh_until) {
            if (Date.now() >= (token.data.validity.refresh_until as number) * 1000) {
                // Token expired, redirect to signin
                const response = NextResponse.redirect(new URL("/login", req.url))
                // Clear the session cookies
                response.cookies.set("next-auth.session-token", "", { maxAge: 0 })
                response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 })
                return response
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return true
            },
        },
        pages: {
            signIn: "/login",
        },
    },
)
export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
