'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setError('登录失败，请重试');
      console.error('Login error:', error);
    }
  }, [searchParams]);

  const handleLogin = async (forcePrompt = false) => {
    try {
      setError(null);
      await signIn('github', { 
        callbackUrl: '/admin/dashboard',
        redirect: true,
        prompt: forcePrompt ? 'consent' : undefined
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('登录过程中发生错误，请重试');
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#181f2a]">
        <div className="text-neutral-200">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181f2a]">
      <div className="bg-[#232b3b] p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-6 text-center text-neutral-200">后台登录</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <button
            onClick={() => handleLogin(false)}
            className="w-full bg-[#24292e] text-white py-2 px-4 rounded flex items-center justify-center hover:bg-[#2c3238] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            使用 GitHub 登录
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            回到主页
          </button>
        </div>
      </div>
    </div>
  );
} 