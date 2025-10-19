import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Loader,
} from "lucide-react";

const Player = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [videoUrl, setVideoUrl] = useState("");
  const hlsRef = useRef(null);

  // Your S3 URL
  const defaultVideoUrl =
    "https://video-transcodind-output.s3.ap-south-1.amazonaws.com/mpru/master.m3u8";

  useEffect(() => {
    const loadHls = async () => {
      if (!videoRef.current) return;

      if (window.Hls) {
        initializeHls();
      } else {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js";
        script.onload = () => initializeHls();
        document.head.appendChild(script);
      }
    };

    loadHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoUrl]);

  const initializeHls = () => {
    const video = videoRef.current;
    const url = videoUrl || defaultVideoUrl;

    if (window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        console.log(
          "HLS manifest loaded, qualities:",
          hls.levels.map((l) => `${l.height}p`)
        );
      });

      hls.on(window.Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
      });
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const changeQuality = (quality) => {
    if (!hlsRef.current) return;

    if (quality === "auto") {
      hlsRef.current.currentLevel = -1;
    } else {
      const levelIndex = hlsRef.current.levels.findIndex(
        (level) => level.height === parseInt(quality)
      );
      if (levelIndex !== -1) {
        hlsRef.current.currentLevel = levelIndex;
      }
    }
    setSelectedQuality(quality);
    setShowQualityMenu(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const qualities = hlsRef.current?.levels?.map((level) => level.height) || [
    360, 720, 1080,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          HLS Video Streaming Platform
        </h1>

        <div className="mb-6">
          <label className="block text-white mb-2 font-medium">
            Enter your master.m3u8 S3 URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://your-bucket.s3.amazonaws.com/videos/master.m3u8"
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={() => {
                setIsLoading(true);
                if (hlsRef.current) {
                  hlsRef.current.destroy();
                  hlsRef.current = null;
                }
                setTimeout(() => {
                  const loadHls = async () => {
                    if (window.Hls) {
                      initializeHls();
                    }
                  };
                  loadHls();
                }, 100);
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative bg-black rounded-xl overflow-hidden shadow-2xl"
        >
          <video
            ref={videoRef}
            className="w-full aspect-video"
            onClick={togglePlay}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Loader className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full mb-4 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                  (currentTime / duration) * 100
                }%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="text-white hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm">
                      {selectedQuality === "auto"
                        ? "Auto"
                        : `${selectedQuality}p`}
                    </span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                      <button
                        onClick={() => changeQuality("auto")}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${
                          selectedQuality === "auto"
                            ? "bg-purple-600 text-white"
                            : "text-gray-300"
                        }`}
                      >
                        Auto
                      </button>
                      {qualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => changeQuality(q.toString())}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${
                            selectedQuality === q.toString()
                              ? "bg-purple-600 text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {q}p
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
