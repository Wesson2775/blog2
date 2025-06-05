import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest) {
    const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPath = req.nextUrl.pathname === '/login'
    const isApiPath = req.nextUrl.pathname.startsWith('/api/admin')

    if (isAdminPath || isApiPath) {
      const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    if (isLoginPath && (req as any).auth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 如果是登录页面，允许访问
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // 对于所有其他 /admin/* 路径，需要有效的 token
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
}; 