'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    MiniRecordPlayer: {
      init: (config: any, songs: any[]) => void;
      addSongs: (songs: any[]) => void;
      play: () => void;
      pause: () => void;
    }
  }
}

const songs = [
  {
    title: "示例歌曲 1",
    artist: "艺术家 1",
    cover: "/music/cover1.jpg",
    src: "/music/song1.mp3"
  },
  {
    title: "示例歌曲 2",
    artist: "艺术家 2",
    cover: "/music/cover2.jpg",
    src: "/music/song2.mp3"
  }
]

export default function MusicPlayer() {
  useEffect(() => {
    // 动态加载播放器脚本
    const script = document.createElement('script')
    script.textContent = `
      (function () {
        // 默认配置
        const defaultConfig = {
          position: 'bottom-left',
          autoPlay: false,
          defaultVolume: 0.8,
          debug: false
        };

        // 创建唱片机
        function createRecordPlayer(config, songs) {
          // ... 这里是完整的播放器代码 ...
          // 为了简洁，这里省略了具体实现
          // 实际使用时需要把完整的播放器代码放在这里
        }

        // 初始化播放器逻辑
        function initPlayer(config, songs) {
          // ... 这里是完整的初始化代码 ...
          // 为了简洁，这里省略了具体实现
          // 实际使用时需要把完整的初始化代码放在这里
        }

        // 公开API
        window.MiniRecordPlayer = {
          init: function (config = {}, songs = []) {
            createRecordPlayer(config, songs);
          },
          addSongs: function (newSongs) {
            // 实现添加歌曲逻辑
          },
          play: function () {
            // 实现播放方法
          },
          pause: function () {
            // 实现暂停方法
          }
        };
      })();
    `
    document.body.appendChild(script)

    // 初始化播放器
    if (window.MiniRecordPlayer) {
      window.MiniRecordPlayer.init({
        position: 'bottom-left',
        autoPlay: false,
        defaultVolume: 0.8,
        debug: false
      }, songs)
    }

    return () => {
      // 清理脚本
      document.body.removeChild(script)
    }
  }, [])

  return null
} 