'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') { // 简单密码，后续可改为环境变量
      localStorage.setItem('admin', '1')
      router.push('/admin/dashboard')
    } else {
      setError('密码错误')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181f2a]">
      <form onSubmit={handleLogin} className="bg-[#232b3b] p-8 rounded shadow-lg w-80 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-white mb-4">后台登录</h1>
        <input
          type="password"
          placeholder="请输入后台密码"
          className="p-2 rounded bg-[#181f2a] text-white border border-[#2a3441] focus:outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded py-2 font-bold">登录</button>
      </form>
    </div>
  )
} 