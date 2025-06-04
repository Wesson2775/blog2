'use client';

import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#181f2a]">
        <div className="text-neutral-200">加载中...</div>
      </div>
    );
  }

  // 如果不是 loading 状态且没有 session，说明未认证，此时中间件会处理重定向，这里不渲染任何内容
  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">仪表盘</h1>
      <div className="bg-[#232b3b] p-6 rounded-lg shadow-md">
        <div className="text-neutral-200">
          <p className="mb-4">欢迎回来，{session?.user?.name}！</p>
          <p>这里是您的管理后台。</p>
        </div>
      </div>
    </div>
  );
} 