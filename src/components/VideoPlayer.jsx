import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Video, Sparkles, CheckCircle2 } from 'lucide-react';
import { collegeInfo } from '../data/collegeData';

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(64);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const seekTo = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const chapters = [
    { title: "Faculty Introduction", time: 2 },
    { title: "Principal's Office", time: 14 },
    { title: "Sunrise Crest & Heritage", time: 22 },
    { title: "Classroom & Study Sessions", time: 35 },
    { title: "Boys & Girls Hostels", time: 45 },
    { title: "Campus Elevation & Contacts", time: 55 }
  ];

  return (
    <section id="video-tour" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-500/30">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Campus Broadcast</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Watch Sunrise Junior College Campus Tour
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Experience our vibrant academic facilities, faculty interaction, well-maintained study halls, and hostel premises in high definition.
          </p>
        </div>

        {/* Video Player & Chapters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Video Screen Container */}
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-700/80 group">
              <video
                ref={videoRef}
                src="./assets/college_video.mp4"
                poster="./assets/frame_55s.jpg"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="w-full aspect-video object-contain bg-black cursor-pointer"
                onClick={togglePlay}
                playsInline
              />

              {/* Big Centered Play Button when paused */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center cursor-pointer transition"
                >
                  <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl transform hover:scale-110 transition duration-300">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Custom Bottom Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1.5 bg-slate-700 rounded-full cursor-pointer overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    seekTo(pos * duration);
                  }}
                >
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="p-1 hover:text-amber-400 transition">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button onClick={toggleMute} className="p-1 hover:text-amber-400 transition">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-slate-400">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-amber-400 text-[11px] font-bold">
                      Sunrise College HD Tour
                    </span>
                    <button onClick={handleFullscreen} className="p-1 hover:text-amber-400 transition">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Video Highlights & Chapter Links */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Video Chapter Markers</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">64 Secs</span>
              </div>

              <div className="space-y-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekTo(ch.time)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-500/20 border border-slate-700/50 hover:border-amber-500/50 transition flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-slate-200 group-hover:text-amber-300">{ch.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{formatTime(ch.time)}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-700/60">
                <p className="text-xs text-slate-300">
                  <strong className="text-amber-400">Campus Address:</strong> Day & Night Junction, Opp. Sindhoora Hospital, Srikakulam.
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  <strong className="text-amber-400">Helpline:</strong> 8143217785 / 7989285425
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
