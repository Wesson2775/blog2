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
          scope: 'read:user user:email',
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
      try {
        if (account?.provider === "github") {
          const githubUsername = (profile as any)?.login;
          
          // 如果白名单为空，允许所有用户登录
          if (allowedUsers.length === 0) {
            return true;
          }
          
          // 检查用户是否在白名单中
          const isAllowed = githubUsername && allowedUsers.includes(githubUsername);
          
          if (!isAllowed) {
            return false;
          }
          
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (account && user) {
          token.accessToken = account.access_token;
          token.id = user.id;
        }
        return token;
      } catch (error) {
        return token;
      }
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.accessToken = token.accessToken as string;
        }
        return session;
      } catch (error) {
        return session;
      }
    }
  },
  debug: false,
  logger: {
    error(code, metadata) {
      console.error('NextAuth 错误:', code);
    },
    warn(code) {
      console.warn('NextAuth 警告:', code);
    },
    debug(code, metadata) {
      // 不输出调试信息
    }
  }
});

export { handler as GET, handler as POST }; 