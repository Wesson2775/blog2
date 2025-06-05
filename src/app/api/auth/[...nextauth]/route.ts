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
const allowedUsers = process.env.GITHUB_ALLOWED_USERS?.split(',') || [];
console.log('允许的 GitHub 用户:', allowedUsers);
console.log('GITHUB_ALLOWED_USERS 环境变量值:', process.env.GITHUB_ALLOWED_USERS);

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'github') {
        return false
      }

      // 获取 GitHub 用户名
      const githubUsername = account?.providerAccountId || user.name || user.email
      if (!githubUsername) {
        return false
      }

      if (allowedUsers.length === 0) {
        return true
      }

      return allowedUsers.includes(githubUsername)
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
  pages: {
    signIn: '/login',
  },
  debug: false,
});

export { handler as GET, handler as POST }; 