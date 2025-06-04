import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// 扩展 Session 类型
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// 从环境变量获取允许的 GitHub 用户列表
const allowedUsers = process.env.GITHUB_ALLOWED_USERS?.split(',').map(user => user.trim()) || [];
console.log('允许的 GitHub 用户:', allowedUsers);
console.log('GITHUB_ALLOWED_USERS 环境变量值:', process.env.GITHUB_ALLOWED_USERS);

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/github'
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const githubUsername = (profile as any)?.login;
        console.log('登录尝试详情:', {
          githubUsername,
          allowedUsers,
          profile,
          user,
          account
        });
        
        // 如果白名单为空，允许所有用户登录
        if (allowedUsers.length === 0) {
          console.log('白名单为空，允许所有用户登录');
          return true;
        }
        
        // 检查用户是否在白名单中
        const isAllowed = githubUsername && allowedUsers.includes(githubUsername);
        console.log('白名单验证结果:', {
          githubUsername,
          isAllowed,
          allowedUsers
        });
        
        if (!isAllowed) {
          console.log(`用户 ${githubUsername} 不在白名单中，拒绝访问`);
        }
        
        return isAllowed;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth 错误:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth 警告:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth 调试:', code, metadata);
    }
  }
});

export { handler as GET, handler as POST }; 