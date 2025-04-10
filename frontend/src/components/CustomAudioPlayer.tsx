import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const CustomAudioPlayer = ({ src }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setProgress((audio!.currentTime / audio!.duration) * 100);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const value = e.target.value;
    audio!.currentTime = (value / 100) * audio!.duration;
    setProgress(value);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (audio) {
        audio.removeEventListener("loadedmetadata", () => {
          setAudioDuration(audio.duration);
        });
        audio.removeEventListener("ended", () => {
          setIsPlaying(false);
        });
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio!.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio!.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  return (
    <div className="mt-2 flex items-center gap-2 max-w-[400px] w-[100%]">
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} />
      <div className="border-0 text-xl cursor-pointer" onClick={togglePlay}>
        {isPlaying ? <FaPause color="grey" /> : <FaPlay color="grey" />}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="w-full h-1 bg-gray-300 rounded-md outline-none"
      />
    </div>
  );
};

export default CustomAudioPlayer;
