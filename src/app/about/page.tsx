import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#181f2a]">
      <div className="space-y-4 text-center text-white text-base">
        <div>Hi，我是 Kevin。</div>
        <div>欢迎来到 <span className="text-red-400 font-bold">只抄</span> 博客！</div>
        <div>这里记录我的技术、生活与思考。</div>
        <img src="https://s2.loli.net/2025/06/03/G1hctQ5LjUDXsua.png" alt="Profile Image" />
        <div>联系邮箱：your.email@example.com</div>
        <div>GitHub：github.com/yourusername</div>
      </div>
    </div>
  )
} 