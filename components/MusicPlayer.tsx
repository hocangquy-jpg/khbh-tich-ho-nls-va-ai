import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  ListMusic, Plus, Trash2, Shuffle, Repeat, Repeat1, Disc, X
} from 'lucide-react';

export interface Track {
  id: string;
  name: string;
  url: string;
  size?: number;
  duration?: number;
}

interface MusicPlayerProps {
  onPlayingChange?: (isPlaying: boolean) => void;
  isDucked?: boolean; // When voice assistant speaks
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayingChange, isDucked = false }) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'all' | 'one' | 'off'>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || null;

  // Handle uploading multiple audio files
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newTracks: Track[] = Array.from(files).map((file: File, idx: number) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name.replace(/\.[^/.]+$/, ""), // remove extension for cleaner title
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    setPlaylist(prev => {
      const updated = [...prev, ...newTracks];
      // If playlist was empty, start playing the first new track immediately
      if (prev.length === 0 && updated.length > 0) {
        setCurrentTrackIndex(0);
        setIsPlaying(true);
      }
      return updated;
    });

    // Reset input value to allow selecting same files again if desired
    e.target.value = '';
  };

  // Play next track (continuous playback)
  const handleNext = () => {
    if (playlist.length === 0) return;

    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      return;
    }

    if (isShuffle && playlist.length > 1) {
      let nextIdx = currentTrackIndex;
      while (nextIdx === currentTrackIndex) {
        nextIdx = Math.floor(Math.random() * playlist.length);
      }
      setCurrentTrackIndex(nextIdx);
    } else {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else if (repeatMode === 'all') {
        setCurrentTrackIndex(0); // loop back to start
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Play previous track
  const handlePrev = () => {
    if (playlist.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  // Remove a track from playlist
  const handleRemoveTrack = (idxToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaylist(prev => {
      const filtered = prev.filter((_, i) => i !== idxToRemove);
      if (idxToRemove === currentTrackIndex) {
        if (filtered.length === 0) {
          setIsPlaying(false);
          setCurrentTrackIndex(0);
        } else if (idxToRemove >= filtered.length) {
          setCurrentTrackIndex(0);
        }
      } else if (idxToRemove < currentTrackIndex) {
        setCurrentTrackIndex(prevIdx => prevIdx - 1);
      }
      return filtered;
    });
  };

  // Handle Track End (Continuous play)
  const handleTrackEnded = () => {
    handleNext();
  };

  // Audio element timeupdate
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Scrub progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Audio Play/Pause effect
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentTrack) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay / audio play blocked or failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
    onPlayingChange?.(isPlaying);
  }, [isPlaying, currentTrackIndex, playlist]);

  // Manage Volume & Ducking during speech
  useEffect(() => {
    if (!audioRef.current) return;
    const targetVolume = isMuted ? 0 : (isDucked ? Math.min(volume * 0.25, 0.2) : volume);
    audioRef.current.volume = targetVolume;
  }, [volume, isMuted, isDucked]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={currentTrack ? currentTrack.url : undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      {/* Hidden file input with 'multiple' attribute */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="audio/*"
        multiple
        onChange={handleFilesUpload}
      />

      {/* Music Header Control Button Group */}
      <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border-2 border-lime-600/70 backdrop-blur-md shadow-xs">
        {/* Upload / Add Music Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-lime-500 font-bold text-xs transition-all ${
            playlist.length > 0
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
              : 'bg-lime-800/80 hover:bg-lime-700 text-lime-100 hover:text-white'
          }`}
          title="Chọn nhiều bài hát từ máy tính để phát liên tục"
        >
          <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">
            {playlist.length > 0 ? `Nhạc (${playlist.length} bài)` : 'Chọn nhiều bài hát'}
          </span>
        </button>

        {/* Play/Pause & Mini Controls if playlist has tracks */}
        {playlist.length > 0 && (
          <>
            {/* Prev */}
            <button
              onClick={handlePrev}
              className="p-1.5 text-lime-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Bài trước"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95"
              title={isPlaying ? "Tạm dừng" : "Phát liên tục"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="p-1.5 text-lime-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Bài kế tiếp"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Playlist Drawer Toggle Button */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`flex items-center gap-1 p-1.5 rounded-lg border transition-all ${
                showPlaylist 
                  ? 'bg-lime-400 text-slate-950 border-lime-300 font-black' 
                  : 'text-lime-200 hover:text-white border-lime-700/60 hover:bg-white/10'
              }`}
              title="Danh sách phát nhạc liên tục"
            >
              <ListMusic className="w-4 h-4" />
              <span className="text-[11px] font-black">{currentTrackIndex + 1}/{playlist.length}</span>
            </button>
          </>
        )}
      </div>

      {/* Floating / Popover Playlist & Full Player Window */}
      {showPlaylist && (
        <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#1f2613] text-white rounded-2xl border-3 border-lime-600 shadow-[0_12px_32px_rgba(0,0,0,0.6)] p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-lime-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-lime-600 rounded-lg text-slate-950">
                <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-lime-300">
                  Phát nhạc liên tục ({playlist.length} bài)
                </h3>
                <p className="text-[10px] text-lime-400/80">Tự động chuyển bài khi hết nhạc</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[10px] font-bold bg-lime-700 hover:bg-lime-600 text-white px-2 py-1 rounded-lg transition-colors"
                title="Chọn thêm file MP3 từ máy tính"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm bài</span>
              </button>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Playing Track Info Banner */}
          {currentTrack ? (
            <div className="my-3 p-3 bg-lime-950/70 border border-lime-700/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Đang phát #{currentTrackIndex + 1}:
                </span>
                <span className="text-[10px] font-mono text-lime-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate" title={currentTrack.name}>
                {currentTrack.name}
              </p>

              {/* Progress seeker bar */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-lime-900 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />

              {/* Player control buttons */}
              <div className="flex items-center justify-between pt-1">
                {/* Mode Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRepeatMode(m => m === 'all' ? 'one' : m === 'one' ? 'off' : 'all')}
                    className={`p-1 rounded transition-colors ${
                      repeatMode !== 'off' ? 'text-lime-400 font-bold' : 'text-slate-500'
                    }`}
                    title={
                      repeatMode === 'all' 
                        ? 'Lặp lại toàn bộ danh sách' 
                        : repeatMode === 'one' 
                          ? 'Lặp lại 1 bài' 
                          : 'Tắt lặp'
                    }
                  >
                    {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-1 rounded transition-colors ${
                      isShuffle ? 'text-lime-400 font-bold' : 'text-slate-500'
                    }`}
                    title={isShuffle ? 'Đang phát ngẫu nhiên' : 'Phát theo thứ tự'}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Playback Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="text-lime-200 hover:text-white"
                    title="Bài trước"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black rounded-full shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button
                    onClick={handleNext}
                    className="text-lime-200 hover:text-white"
                    title="Bài tiếp theo"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-lime-300 hover:text-white"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-lime-900 rounded-lg appearance-none cursor-pointer accent-lime-400"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="my-3 p-4 text-center bg-lime-950/40 rounded-xl border border-dashed border-lime-800">
              <Music className="w-8 h-8 text-lime-500/60 mx-auto mb-2" />
              <p className="text-xs text-lime-300 font-bold">Chưa có bài hát nào</p>
              <p className="text-[10px] text-lime-400/70 mt-1">
                Nhấn nút "Thêm bài" để chọn cùng lúc nhiều bài hát từ máy tính
              </p>
            </div>
          )}

          {/* Playlist Track List */}
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-lime-700">
            {playlist.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-lime-800/90 text-white font-bold border border-lime-500 shadow-xs'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-mono text-[10px] text-lime-400 w-4 text-right">
                      {idx + 1}.
                    </span>
                    {isCurrent && isPlaying ? (
                      <span className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 h-3 bg-amber-400 animate-pulse" />
                        <span className="w-0.5 h-2 bg-amber-400 animate-bounce" />
                        <span className="w-0.5 h-3.5 bg-amber-400 animate-pulse" />
                      </span>
                    ) : (
                      <Music className="w-3.5 h-3.5 text-lime-400/60 flex-shrink-0" />
                    )}
                    <span className="truncate text-[11px]">{track.name}</span>
                  </div>

                  <button
                    onClick={(e) => handleRemoveTrack(idx, e)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                    title="Xóa khỏi danh sách"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Footer Actions */}
          {playlist.length > 0 && (
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-lime-800/60 text-[10px] text-lime-400">
              <span>Đang bật: <strong>{repeatMode === 'all' ? 'Lặp toàn bộ' : repeatMode === 'one' ? 'Lặp 1 bài' : 'Không lặp'}</strong></span>
              <button
                onClick={() => {
                  setPlaylist([]);
                  setIsPlaying(false);
                  setCurrentTrackIndex(0);
                }}
                className="text-red-400 hover:text-red-300 font-bold"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MusicPlayer;
