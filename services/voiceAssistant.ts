// Service to manage the gentle Hue assistant voice greeting:
// "Xin kính chào quý thầy, quý cô, em là Thiên sứ tình yêu, là trợ lý của thầy Hồ Cang, trường trung học phổ thông Chu Văn An. Em xin sẵn sàng phục vụ yêu cầu tích hợp ngay ạ"

export const GREETING_TEXT = "Xin kính chào quý thầy, quý cô, em là Thiên sứ tình yêu, là trợ lý của thầy Hồ Cang, trường trung học phổ thông Chu Văn An. Em xin sẵn sàng phục vụ yêu cầu tích hợp ngay ạ.";

export const playHueGreetingVoice = (
  onStart?: () => void,
  onEnd?: () => void
): (() => void) => {
  let finished = false;
  let audio: HTMLAudioElement | null = null;
  let timeoutId: any = null;

  const finishOnce = () => {
    if (!finished) {
      finished = true;
      if (timeoutId) clearTimeout(timeoutId);
      onEnd?.();
    }
  };

  const speakWithSynthesisFallback = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(GREETING_TEXT);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        utterance.pitch = 1.1; // gentle, sweet Hue tone
        utterance.onstart = () => onStart?.();
        utterance.onend = () => finishOnce();
        utterance.onerror = () => finishOnce();
        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        finishOnce();
      }
    } else {
      finishOnce();
    }
  };

  try {
    audio = new Audio('/hue_assistant_voice.mp3');
    audio.preload = 'auto';

    audio.onplay = () => {
      onStart?.();
    };

    audio.onended = () => {
      finishOnce();
    };

    audio.onerror = (e) => {
      console.warn('Audio element error, using Web Speech fallback:', e);
      speakWithSynthesisFallback();
    };

    // Safety timeout (max 18 seconds) in case audio fails or hangs
    timeoutId = setTimeout(() => {
      if (!finished) {
        if (audio) audio.pause();
        finishOnce();
      }
    }, 18000);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play() rejected, trying Web Speech fallback:', err);
        speakWithSynthesisFallback();
      });
    }
  } catch (err) {
    console.warn('Failed to initialize Audio, using Web Speech fallback:', err);
    speakWithSynthesisFallback();
  }

  // Return cancel/skip function so user can immediately proceed if they want
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    finishOnce();
  };
};
