import React, { useState, useRef, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import SnowEffect from './components/SnowEffect';
import { DEFAULT_LESSON_PLAN, DIGITAL_COMPETENCIES, AI_COMPETENCIES } from './constants';
import { ProcessingStatus, LessonPlanResponse, MediaInput } from './types';
import { generateEnhancedLessonPlan } from './services/geminiService';
import { playHueGreetingVoice } from './services/voiceAssistant';
import { LayoutGrid, AlertCircle, Sparkles, Music, Snowflake, Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>("");
  const [mediaInputs, setMediaInputs] = useState<MediaInput[]>([]);
  const [sessionDetails, setSessionDetails] = useState<string>("");
  const [selectedCompetencyIds, setSelectedCompetencyIds] = useState<string[]>(DIGITAL_COMPETENCIES.map(c => c.id));
  const [selectedAICompetencyIds, setSelectedAICompetencyIds] = useState<string[]>([]);
  const [focusArea, setFocusArea] = useState<string>("");
  const [outputData, setOutputData] = useState<LessonPlanResponse | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New features state
  const [showSnow, setShowSnow] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicInputRef = useRef<HTMLInputElement | null>(null);
  const greetingCancelRef = useRef<(() => void) | null>(null);

  const startIntegration = async () => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = 1.0;
    }
    setStatus(ProcessingStatus.ANALYZING);
    try {
      const result = await generateEnhancedLessonPlan(
        { text: inputContent, media: mediaInputs, sessionDetails }, 
        selectedCompetencyIds, 
        selectedAICompetencyIds,
        focusArea
      );
      setOutputData(result);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (error: any) {
      console.error(error);
      setStatus(ProcessingStatus.ERROR);
      setErrorMessage(error?.message || "Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra cấu hình hoặc thử lại sau.");
    }
  };

  const handleAnalyze = async () => {
    if (selectedCompetencyIds.length === 0 && selectedAICompetencyIds.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất một năng lực số hoặc năng lực AI để tích hợp.");
      return;
    }
    setErrorMessage(null);

    // Dim background music if playing so voice is crystal clear
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = 0.2;
    }

    // Set greeting status
    setStatus(ProcessingStatus.GREETING);

    // Play Hue assistant gentle voice greeting
    greetingCancelRef.current = playHueGreetingVoice(
      () => {
        // Voice greeting started
      },
      () => {
        // Voice greeting ended -> seamlessly trigger AI integration
        greetingCancelRef.current = null;
        startIntegration();
      }
    );
  };

  const handleSkipGreeting = () => {
    if (greetingCancelRef.current) {
      greetingCancelRef.current();
      greetingCancelRef.current = null;
    }
  };

  const handleClearOutput = () => {
    if (greetingCancelRef.current) {
      greetingCancelRef.current();
      greetingCancelRef.current = null;
    }
    setOutputData(null);
    setStatus(ProcessingStatus.IDLE);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMusicUrl(url);
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying, musicUrl]);

  useEffect(() => {
    return () => {
      if (greetingCancelRef.current) {
        greetingCancelRef.current();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#1a230f] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#4b5320] via-[#2d3319] to-[#1a1e0b] relative">
      {showSnow && <SnowEffect />}
      
      {/* Hidden Music Player */}
      {musicUrl && (
        <audio 
          ref={audioRef} 
          src={musicUrl} 
          loop 
          autoPlay 
        />
      )}
      <input 
        type="file" 
        ref={musicInputRef} 
        className="hidden" 
        accept="audio/*" 
        onChange={handleMusicUpload} 
      />

      {/* Header with 3D feel */}
      <header className="bg-white/10 backdrop-blur-md border-b-4 border-lime-800 sticky top-0 z-50 shadow-[0_4px_0_0_rgba(75,83,32,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 bg-lime-900 rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(26,35,15,1)] border-2 border-lime-600 text-white">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight drop-shadow-[2px_2px_0_rgba(26,35,15,0.5)]">
                DigiPlan Integrator
              </h1>
              <p className="text-[9px] text-lime-200 font-black uppercase tracking-[0.2em]">Tích hợp Năng Lực Số 3.0</p>
            </div>
          </div>

          {/* Centered Teacher Info with increased font size */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <div className="bg-white/10 px-6 py-2 border-2 border-amber-600 rounded-xl shadow-[6px_6px_0_0_rgba(217,119,6,0.3)] backdrop-blur-sm">
              <span className="text-xl font-black italic tracking-[0.1em] text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                THẦY HỒ CANG - THPT CHU VĂN AN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 z-10">
            {/* Music Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => musicInputRef.current?.click()}
                className={`p-2 rounded-lg border-2 border-lime-600 transition-all ${musicUrl ? 'bg-amber-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title="Tải âm nhạc từ máy tính"
              >
                <Music className="w-5 h-5" />
              </button>
              {musicUrl && (
                <button 
                  onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                  className="p-2 bg-white/10 text-white rounded-lg border-2 border-lime-600 hover:bg-white/20 transition-all"
                >
                  {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Snow Control */}
            <button 
              onClick={() => setShowSnow(!showSnow)}
              className={`p-2 rounded-lg border-2 border-lime-600 transition-all ${showSnow ? 'bg-white text-lime-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="Bật/Tắt tuyết rơi"
            >
              <Snowflake className={`w-5 h-5 ${showSnow ? 'animate-spin-slow' : ''}`} />
            </button>

            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse hidden sm:block" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {errorMessage && (
          <div className="mb-8 bg-red-500 border-4 border-red-900 rounded-xl p-4 flex items-center gap-3 text-white shadow-[8px_8px_0_0_rgba(127,29,29,1)] animate-bounce">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-base font-black uppercase italic">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[700px]">
          <div className="h-full">
            <InputSection 
              value={inputContent} 
              onChange={setInputContent} 
              mediaInputs={mediaInputs}
              onMediaChange={setMediaInputs}
              sessionDetails={sessionDetails}
              onSessionDetailsChange={setSessionDetails}
              onAnalyze={handleAnalyze}
              onSkipGreeting={handleSkipGreeting}
              status={status}
              selectedCompetencyIds={selectedCompetencyIds}
              onCompetencyChange={setSelectedCompetencyIds}
              selectedAICompetencyIds={selectedAICompetencyIds}
              onAICompetencyChange={setSelectedAICompetencyIds}
              focusArea={focusArea}
              onFocusAreaChange={setFocusArea}
            />
          </div>

          <div className="h-full">
            <OutputSection 
              data={outputData} 
              onClear={handleClearOutput}
            />
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-lime-200/50 text-xs font-bold tracking-widest uppercase">
        &copy; 2024 DigiPlan Integrator - Powered by Gemini AI
      </footer>
    </div>
  );
};

export default App;