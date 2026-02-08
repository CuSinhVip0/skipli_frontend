import NextAuth, {
    AuthValidity,
    BackendAccessJWT,
    BackendJWT,
    DecodedJWT,
    NextAuthOptions,
    User,
    UserObject,
} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authService } from "@/services/auth"
import { jwtDecode } from "jwt-decode"
import { JWT } from "next-auth/jwt"
async function refreshAccessToken(nextAuthJWT: JWT): Promise<JWT> {
    try {
        const res = await authService.refresh(nextAuthJWT.data.tokens.refresh)
        if (res.success === true) {
            const accessToken: BackendAccessJWT = res.access as BackendAccessJWT
            const { exp }: DecodedJWT = jwtDecode(accessToken.access)

            nextAuthJWT.data.validity.valid_until = exp
            nextAuthJWT.data.tokens.access = accessToken.access
            return { ...nextAuthJWT }
        } else {
            return {
                ...nextAuthJWT,
                error: "RefreshAccessTokenError",
            }
        }
    } catch (error) {
        return {
            ...nextAuthJWT,
            error: "RefreshAccessTokenError",
        }
    }
}
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                otp: { label: "OTP", type: "text" },
                method: { label: "Method", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.otp || !credentials?.method) {
                    return null
                }

                try {
                    let response
                    if (credentials?.method === "sms") {
                        response = await authService.validateSmsCode(
                            credentials?.email || "",
                            credentials?.otp || "",
                        )
                    } else if (credentials?.method === "email") {
                        response = await authService.validateEmailCode(
                            credentials?.email || "",
                            credentials?.otp || "",
                        )
                    }

                    if (response?.success == true) {
                        const tokens: BackendJWT = {
                            access: response.access,
                            refresh: response.refresh,
                        } as BackendJWT

                        const access: DecodedJWT = jwtDecode(tokens.access)
                        const refresh: DecodedJWT = jwtDecode(tokens.refresh)
                        const user: UserObject = {
                            name: access.name,
                            email: access.email,
                            id: access.id,
                            role: access.role,
                            phone: access.phone,
                        }
                        const validity: AuthValidity = {
                            valid_until: access.exp,
                            refresh_until: refresh.exp,
                        }
                        return {
                            id: refresh.jti, // User object is forced to have a string id so use refresh token id
                            tokens: tokens,
                            user: user,
                            validity: validity,
                        } as User
                    }
                    return null
                } catch (error) {
                    console.debug(error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl)
        },
        async jwt({ token, user, account }: any) {
            // Khi user đăng nhập lần đầu, lưu thông tin vào JWT token
            if (user && account) {
                return { ...token, data: user }
            }
            // The current access token is still valid
            if (Date.now() < token.data.validity.valid_until * 1000) {
                return token
            }
            // The current access token has expired, but the refresh token is still valid
            if (Date.now() < token.data.validity.refresh_until * 1000) {
                return await refreshAccessToken(token)
            }

            // The current access token and refresh token have both expired
            // This should not really happen unless you get really unlucky with
            // the timing of the token expiration because the middleware should
            // have caught this case before the callback is called
            return { ...token, error: "RefreshTokenExpired" } as JWT
        },

        async session({ session, token }: any) {
            // Truyền access token và user info vào session
            session.user = token.data.user
            session.validity = token.data.validity
            session.error = token.error
            // Expose accessToken và refreshToken cho client-side
            session.accessToken = token.data.tokens.access
            session.refreshToken = token.data.tokens.refresh
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, handler as auth }
