import { useEffect, useRef, useState } from 'react';

interface Song {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

interface PlayerConfig {
  position?: 'bottom-left' | 'bottom-right';
  autoPlay?: boolean;
  defaultVolume?: number;
  debug?: boolean;
}

interface MiniRecordPlayerProps {
  config?: PlayerConfig;
  songs: Song[];
}

export default function MiniRecordPlayer({ config = {}, songs = [] }: MiniRecordPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(config.defaultVolume || 0.8);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(typeof window !== 'undefined' ? new Audio(songs[0]?.src) : null);
  const recordRef = useRef<HTMLDivElement>(null);
  const tonearmRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<SVGPathElement>(null);

  const defaultConfig: PlayerConfig = {
    position: 'bottom-left',
    autoPlay: false,
    defaultVolume: 0.8,
    debug: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (finalConfig.autoPlay && songs.length > 0) {
      handlePlay();
    }
  }, []);

  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].src
      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.addEventListener('error', (err) => {
        setError('加载音频失败')
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current.pause()
      }
    }
  }, [songs, currentSongIndex])

  const handlePlay = () => {
    if (!audioRef.current) return
    audioRef.current.play().catch(() => {
      setError('播放失败')
    })
    setIsPlaying(true)
  }

  const handlePause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
    } else {
      setCurrentSongIndex(0)
    }
  }

  const handleNext = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
    } else {
      setCurrentSongIndex(0)
    }
  }

  const handlePrev = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1)
    } else {
      setCurrentSongIndex(songs.length - 1)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    setVolume(volume)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleError = () => {
    setError('音频加载错误')
  }

  const togglePlaylist = () => {
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isPlaylistOpen) {
      setIsPlaylistOpen(false);
    }
  };

  return (
    <div className={`fixed ${finalConfig.position === 'bottom-left' ? 'left-5' : 'right-5'} bottom-[70px] z-50`}>
      <div className={`record-player ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="recorderbackground">
          <svg className="progress-bar" width="44" height="44">
            <path className="progress-background" d="M 22 44 A 22 22 0 0 1 22 0" />
            <path 
              ref={progressFillRef}
              className="progress-fill" 
              d="M 22 44 A 22 22 0 0 1 22 0" 
            />
          </svg>
          <div 
            ref={recordRef}
            className="record" 
            onClick={toggleCollapse}
          >
            <img 
              className="record-cover" 
              src={songs[currentSongIndex]?.cover || 'https://via.placeholder.com/30'} 
              alt="Cover" 
            />
            <div className="record-grooves" />
          </div>
          <div 
            ref={tonearmRef}
            className="tonearm"
          >
            <div className="tonearm-needle" />
          </div>
        </div>
        <div className={`control-panel ${isPlaylistOpen ? 'playlist-mode' : ''}`}>
          <div className="song-info">
            <span className="song-text">
              {songs[currentSongIndex]?.title || '加载中...'} - {songs[currentSongIndex]?.artist || ''}
            </span>
          </div>
          <div className="controls">
            <button 
              className="control-btn" 
              onClick={handlePrev} 
              title="上一曲"
              disabled={isLoading}
            >
              ⏮
            </button>
            <button 
              className="control-btn play-btn" 
              onClick={handlePlay} 
              title="播放/暂停"
              disabled={isLoading}
            >
              {isLoading ? '⌛' : isPlaying ? '⏸' : '⏵'}
            </button>
            <button 
              className="control-btn" 
              onClick={handleNext} 
              title="下一曲"
              disabled={isLoading}
            >
              ⏭
            </button>
            <div className="volume-container">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
                disabled={isLoading}
              />
            </div>
            <button 
              className="control-btn playlist-btn" 
              onClick={togglePlaylist} 
              title="播放列表"
              disabled={isLoading}
            >
              ≡
            </button>
          </div>
          <div className={`playlist ${isPlaylistOpen ? 'open' : ''}`}>
            {songs.map((song, index) => (
              <div
                key={index}
                className="playlist-item"
                onClick={async () => {
                  if (isLoading) return;
                  setCurrentSongIndex(index);
                  if (audioRef.current) {
                    try {
                      setIsLoading(true);
                      audioRef.current.src = song.src;
                      await audioRef.current.load();
                      await audioRef.current.play();
                      setIsPlaying(true);
                      setError(null);
                    } catch (err) {
                      console.error('播放失败:', err);
                      setError('播放失败，请检查音频文件');
                    } finally {
                      setIsLoading(false);
                    }
                  }
                  setIsPlaylistOpen(false);
                }}
              >
                <span className="song-text">{song.title} - {song.artist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-xs mt-2">
          {error}
        </div>
      )}
      <audio
        ref={audioRef}
        src={songs[currentSongIndex]?.src}
        onEnded={handleEnded}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
} 