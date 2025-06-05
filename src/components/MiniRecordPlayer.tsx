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

  const audioRef = useRef<HTMLAudioElement>(null);
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
      const loadAudio = async () => {
        try {
          setIsLoading(true);
          audioRef.current!.src = songs[currentSongIndex].src;
          await audioRef.current!.load();
          if (config.debug) {
            console.log('当前播放歌曲:', songs[currentSongIndex]);
          }
        } catch (err) {
          console.error('加载音频失败:', err);
          setError('加载音频失败，请检查文件路径');
        } finally {
          setIsLoading(false);
        }
      };
      loadAudio();
    }
  }, [currentSongIndex, songs]);

  const handlePlay = async () => {
    if (audioRef.current && !isLoading) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
          recordRef.current?.classList.remove('playing');
          tonearmRef.current?.classList.remove('playing');
        } else {
          if (!audioRef.current.src) {
            audioRef.current.src = songs[currentSongIndex].src;
            await audioRef.current.load();
          }
          await audioRef.current.play();
          recordRef.current?.classList.add('playing');
          tonearmRef.current?.classList.add('playing');
        }
        setIsPlaying(!isPlaying);
        setError(null);
      } catch (err) {
        console.error('播放失败:', err);
        setError('播放失败，请检查音频文件');
        setIsPlaying(false);
      }
    }
  };

  const handlePrevious = async () => {
    if (isLoading) return;
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    if (audioRef.current) {
      try {
        setIsLoading(true);
        audioRef.current.src = songs[newIndex].src;
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
  };

  const handleNext = async () => {
    if (isLoading) return;
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    if (audioRef.current) {
      try {
        setIsLoading(true);
        audioRef.current.src = songs[newIndex].src;
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
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };

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
              onClick={handlePrevious} 
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
        onEnded={handleNext}
        onError={(e) => {
          console.error('音频加载错误:', e);
          setError('音频加载失败，请检查文件路径');
          setIsLoading(false);
        }}
        onTimeUpdate={() => {
          if (audioRef.current && progressFillRef.current) {
            const progress = audioRef.current.currentTime / audioRef.current.duration;
            const arcLength = Math.PI * 22;
            const offset = arcLength * (1 - progress);
            progressFillRef.current.style.strokeDashoffset = offset.toString();
          }
        }}
      />
    </div>
  );
} 