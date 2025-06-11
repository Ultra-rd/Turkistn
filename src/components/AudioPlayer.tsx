
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, AlertCircle, Headphones } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState<string | null>(null);
  const [canAutoPlay, setCanAutoPlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Проверка формата и доступности аудиофайла
  useEffect(() => {
    const checkAudioUrl = async () => {
      if (!audioUrl) {
        setError("URL аудиофайла не указан");
        return;
      }

      try {
        const response = await fetch(audioUrl, { method: 'HEAD' });
        if (!response.ok) {
          setError(`Не удалось загрузить аудиофайл. Статус: ${response.status}`);
          console.error("Audio file not accessible:", response.statusText);
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Error checking audio URL:", err);
        setError("Не удалось проверить доступность аудиофайла. Проверьте URL и сетевое подключение.");
      }
    };

    checkAudioUrl();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset error state when audioUrl changes
    setError(null);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (autoPlay && canAutoPlay) {
        playAudio();
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      const errorMessage = "Ошибка воспроизведения аудио. Проверьте формат и URL файла.";
      setError(errorMessage);
      console.error("Audio error event:", e);
      toast({
        title: "Ошибка воспроизведения",
        description: errorMessage,
        variant: "destructive",
      });
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [audioUrl, autoPlay, toast, canAutoPlay]);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    
    audio.play().then(() => {
      setIsPlaying(true);
      setError(null);
      setCanAutoPlay(true);
    }).catch(error => {
      console.error("Failed to play audio:", error);
      setCanAutoPlay(false);
      
      // Более точное сообщение об ошибке в зависимости от проблемы
      let errorMessage = "Не удалось воспроизвести аудио.";
      
      if (error.name === "NotAllowedError") {
        errorMessage = "Браузер блокирует автовоспроизведение. Пожалуйста, нажмите кнопку воспроизведения.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Формат аудио не поддерживается браузером. Используйте MP3 или другой поддерживаемый формат.";
      }
      
      setError(errorMessage);
      toast({
        title: "Ошибка воспроизведения",
        description: errorMessage,
        variant: "destructive",
      });
    });
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mb-6">
      <audio ref={audioRef} preload="metadata">
        {/* Добавляем разные форматы источников для лучшей поддержки */}
        <source src={audioUrl} type="audio/mpeg" />
        <source src={audioUrl} type="audio/mp3" />
        <source src={audioUrl} type="audio/wav" />
        <source src={audioUrl} type="audio/ogg" />
        <p>Ваш браузер не поддерживает HTML5 аудио.</p>
      </audio>
      
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Проблема с аудио</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={togglePlay} 
          className="h-10 w-10 rounded-full bg-turkestan-gold/10 hover:bg-turkestan-gold/20 text-turkestan-gold"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : '--:--'}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-32">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute} 
            className="h-8 w-8 rounded-full"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
      
      {!error && !isPlaying && (
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
          <Headphones className="h-3 w-3 mr-1" />
          <span>Нажмите кнопку воспроизведения для прослушивания аудиогида</span>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
