"use client";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";
import { useEffect, useState } from 'react';
import MiniRecordPlayer from './MiniRecordPlayer';

interface Song {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/music?published=true');
        if (!response.ok) throw new Error('Failed to fetch songs');
        const data = await response.json();
        const formattedSongs = data.map((song: any) => ({
          title: song.title,
          artist: song.artist,
          cover: song.cover || '/default-cover.jpg',
          src: song.src
        }));
        setSongs(formattedSongs);
      } catch (error) {
        console.error('获取音乐列表失败:', error);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAdmin) {
      fetchSongs();
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Layout>{children}</Layout>
      {!isLoading && songs.length > 0 && (
        <MiniRecordPlayer
          config={{
            position: 'bottom-left',
            autoPlay: false,
            defaultVolume: 0.8,
            debug: false
          }}
          songs={songs}
        />
      )}
    </>
  );
} 