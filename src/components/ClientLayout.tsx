"use client";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return isAdmin ? <>{children}</> : <Layout>{children}</Layout>;
} 