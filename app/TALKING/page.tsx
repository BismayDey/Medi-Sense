"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Loader2, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [status, setStatus] = useState("Disconnected");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const responseContainerRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    createParticles();

    const handleResize = () => {
      createParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      closeWebSocket();
    };
  }, []);

  const createParticles = () => {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    const count = Math.floor(window.innerWidth / 15);
    particlesContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full opacity-30 animate-float";

      const size = Math.random() * 6 + 1;
      const posX = Math.random() * window.innerWidth;
      const duration = Math.random() * 40 + 20;
      const delay = Math.random() * 15;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}px`;
      particle.style.bottom = `-10px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.backgroundColor =
        i % 3 === 0 ? "#8a2be2" : i % 3 === 1 ? "#ff00ff" : "#00ffff";
      particle.style.boxShadow = `0 0 ${size * 2}px ${
        particle.style.backgroundColor
      }`;

      particlesContainer.appendChild(particle);
    }
  };

  const connectWebSocket = () => {
    setConnectionStatus("connecting");
    setStatus("Connecting...");

    const socket = new WebSocket(
      "wss://embarrassing-viviana-yugamax-b8b4e309.koyeb.app/groqspeaks"
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setStatus("Ready");
      setConnectionStatus("connected");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setStatus("Reconnecting...");
      setConnectionStatus("connecting");
      setTimeout(connectWebSocket, 1000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("Connection error");
      setConnectionStatus("error");
    };

    socket.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const audioBlob = new Blob([event.data], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        setSpeaking(true);
        setRecording(false);
        setProcessing(false);
        setStatus("Groq AI Speaking");

        await audio.play();

        audio.onended = () => {
          setSpeaking(false);
          setStatus("Ready");
        };
      } else {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "text_stream") {
            handleStreamingText(data);
          } else if (data.type === "audio_processing") {
            setStatus(data.message);
          } else if (data.type === "full_text") {
            setResponse(data.text);
            setShowResponse(true);
          }
        } catch (e) {
          setResponse(event.data);
          setShowResponse(true);
        }
      }
    };
  };

  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const handleButtonClick = () => {
    if (speaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setSpeaking(false);
      setStatus("Ready");
      return;
    }

    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/m4a",
        });

        setRecording(false);
        setProcessing(true);
        setStatus("Processing");

        const arrayBuffer = await audioBlob.arrayBuffer();
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(arrayBuffer);
        } else {
          setResponse(
            "I'm sorry, but I couldn't connect to the server. Please check your connection and try again."
          );
          setShowResponse(true);
          setProcessing(false);
        }
      };

      mediaRecorder.start(100);
      setRecording(true);
      setStatus("Listening");
    } catch (error) {
      console.error("Error starting recording:", error);
      setStatus(`Error: ${error.message}`);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleStreamingText = (data) => {
    if (!showResponse) {
      setShowResponse(true);
    }

    if (data.text === "[DONE]") {
      setSpeaking(true);
      return;
    }

    setResponse((prev) => prev + data.text);

    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop =
        responseContainerRef.current.scrollHeight;
    }
  };

  const closeResponse = () => {
    setShowResponse(false);
    setResponse("");
  };

  const getButtonText = () => {
    if (speaking) return "Stop";
    if (processing) return "Sending";
    if (recording) return "Send";
    return "Speak";
  };

  const getButtonClasses = () => {
    let baseClasses =
      "w-40 h-40 rounded-full relative z-10 font-orbitron text-xl font-bold cursor-pointer transition-all duration-300 uppercase tracking-wider overflow-hidden shadow-lg hover:scale-105 group";

    if (speaking)
      return cn(
        baseClasses,
        "bg-gradient-to-br from-blue-800 to-blue-600 shadow-blue-500/30"
      );
    if (processing)
      return cn(
        baseClasses,
        "bg-gradient-to-br from-orange-600 to-amber-500 shadow-amber-500/30"
      );
    if (recording)
      return cn(
        baseClasses,
        "bg-gradient-to-br from-rose-700 to-rose-600 shadow-rose-500/30 animate-pulse"
      );
    return cn(
      baseClasses,
      "bg-gradient-to-br from-primary-dark to-primary shadow-primary/30"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a0ca3] via-[#7209b7] to-[#f72585] font-montserrat relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent opacity-30" />
      <div className="fixed inset-0 bg-noise-pattern opacity-[0.1]" />
      <div className="fixed inset-0 bg-[linear-gradient(30deg,rgba(167,139,250,0.1)_12%,transparent_12.5%,transparent_87%,rgba(167,139,250,0.1)_87.5%,rgba(167,139,250,0.1))] opacity-15" />
      <div
        id="particles"
        className="fixed inset-0 overflow-hidden pointer-events-none"
      />

      {/* Connection Indicator */}
      <div className="fixed top-5 right-5 flex items-center gap-2 bg-purple-900/70 px-4 py-2 rounded-full z-50 backdrop-blur-md border border-purple-300/30">
        <div
          className={cn(
            "w-3 h-3 rounded-full shadow-lg transition-all duration-300",
            {
              "bg-emerald-400 shadow-emerald-400/50":
                connectionStatus === "connected",
              "bg-amber-400 shadow-amber-400/50 animate-pulse":
                connectionStatus === "connecting",
              "bg-purple-400 shadow-purple-400/50":
                connectionStatus === "disconnected",
              "bg-rose-500 shadow-rose-500/50": connectionStatus === "error",
            }
          )}
        />
        <span className="text-sm capitalize font-orbitron tracking-wider text-white/90">
          {connectionStatus}
        </span>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto max-w-lg px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-5xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-purple-100 to-white bg-clip-text text-transparent">
            Dr. Groq
          </h1>
          <p className="text-lg text-white/80">
            Your Talking AI medical assistant
          </p>
        </div>

        {/* Centered Record Button */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="relative">
            <button
              className={cn(
                "relative group w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl",
                "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                "focus:outline-none focus:ring-4 focus:ring-purple-400/50",
                recording
                  ? "animate-pulse bg-gradient-to-br from-pink-500 to-rose-500"
                  : "",
                processing
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                  : "",
                speaking
                  ? "bg-gradient-to-br from-violet-500 to-purple-600"
                  : ""
              )}
              onClick={handleButtonClick}
            >
              <span className="relative z-20 text-white font-medium text-lg">
                {getButtonText()}
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                {recording && <Mic className="w-10 h-10 text-white/70" />}
                {processing && (
                  <Loader2 className="w-10 h-10 text-white/70 animate-spin" />
                )}
                {speaking && (
                  <Volume2 className="w-10 h-10 text-white/70 animate-pulse" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />
            </button>

            {/* Ripple Effect */}
            {(recording || speaking) && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 animate-ping-slow rounded-full bg-white/20" />
                <div className="absolute inset-0 animate-ping-slow delay-300 rounded-full bg-white/20" />
                <div className="absolute inset-0 animate-ping-slow delay-600 rounded-full bg-white/20" />
              </div>
            )}
          </div>

          {/* Status */}
          <p className="mt-8 text-lg font-orbitron uppercase tracking-wider text-white/90">
            {status === "Processing" ? (
              <span className="relative">
                Processing
                <span className="absolute -right-6 animate-pulse">...</span>
              </span>
            ) : (
              status
            )}
          </p>

          {/* Audio Visualizer */}
          <div
            className={cn(
              "flex justify-center gap-1.5 h-6 mt-4 transition-opacity duration-300",
              recording || speaking ? "opacity-100" : "opacity-0"
            )}
          >
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-white rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Response Container */}
      {showResponse && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-b from-purple-900/90 to-purple-800/90 border border-purple-300/30 rounded-2xl p-6 max-w-[85%] w-[550px] shadow-2xl shadow-purple-500/30 z-50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4"
          ref={responseContainerRef}
        >
          <div className="flex justify-between items-center mb-4 border-b border-purple-300/30 pb-4">
            <div className="font-orbitron text-purple-100 text-xl relative pl-6">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50 animate-pulse" />
              Dr. Groq Response
            </div>
            <button
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={closeResponse}
            >
              <X className="w-4 h-4 text-white/90" />
            </button>
          </div>

          {processing && (
            <div className="flex items-center gap-1 mb-4 p-3 bg-purple-700/30 rounded-xl w-fit">
              <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-pulse" />
              <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-pulse delay-100" />
              <div className="w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-pulse delay-200" />
              <span className="ml-2 text-purple-200">
                Dr. Groq is typing...
              </span>
            </div>
          )}

          <div className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}
