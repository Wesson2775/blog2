import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log('Middleware - Path:', req.nextUrl.pathname);
    console.log('Middleware - Auth:', (req as any).auth);

    // 如果用户已认证且尝试访问登录页面，则重定向到仪表盘
    if (req.nextUrl.pathname === "/admin/login" && (req as any).auth) {
      console.log('Middleware - Redirecting to dashboard');
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Middleware - Authorized Check:', {
          path: req.nextUrl.pathname,
          hasToken: !!token,
          token: token
        });

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