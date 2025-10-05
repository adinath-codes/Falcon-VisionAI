import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Zap,
  Sparkles,
  Camera,
  ImagePlus,
  Loader2,
  BarChart3,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";

export default function ObjectDetectionUI() {
  const [image, setImage] = useState(null);
  const [graphImage, setGraphImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);
  const graphInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // This is more robust as it uses class IDs directly.
  const classColors = {
    0: "#FF5733", // ID 0: Orange-Red
    1: "#33C4FF", // ID 1: Light Blue
    2: "#FFD700", // ID 2: Gold
    3: "#DA70D6", // ID 3: Orchid
    4: "#90EE90", // ID 4: Light Green
    5: "#FF4500", // ID 5: Orange-Red
    6: "#1E90FF", // ID 6: Dodger Blue
    default: "#FFFFFF",
  };

  const classNames = {
    0: "Nitrogen Tank",
    1: "Fire Extinguisher",
    2: "EmergencyPhone",
    3: "O2 Tank",
    4: "SafetySwitch",
    5: "Firealarm",
    6: "Other Object",
  };

  // The fixed useEffect hook
  useEffect(() => {
    const canvas = canvasRef.current;

    // Exit early if canvas or image are null
    if (!canvas || !image) {
      // This is the cleanup function that prevents the "two canvases" bug
      return () => {
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
    }

    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      // We only draw detections if the array is not empty
      if (detections.length > 0) {
        detections.forEach((detection) => {
          const imageWidth = canvas.width;
          const imageHeight = canvas.height;
          const { x, y, w, h } = detection;

          const color =
            classColors[detection.class_id] || classColors["default"];
          const className =
            detection.class_name || classNames[detection.class_id] || "Unknown";

          // Convert normalized coordinates to pixel coordinates
          const x_center_px = x * imageWidth;
          const y_center_px = y * imageHeight;
          const w_px = w * imageWidth;
          const h_px = h * imageHeight;

          const x1 = x_center_px - w_px / 2;
          const y1 = y_center_px - h_px / 2;

          // ===>>> CORRECT DRAWING ORDER IS HERE <<<===

          // Bounding box style
          context.strokeStyle = color;
          context.lineWidth = 8;
          context.strokeRect(x1, y1, w_px, h_px);

          // Label background
          context.fillStyle = color;
          context.font = "24px Arial";
          const confidence = detection.confidence * 100;
          const label = `${className}: ${confidence.toFixed(2)}%`;
          const textWidth = context.measureText(label).width;

          // Draw the background for the text
          context.fillRect(x1, y1, textWidth + 10, 30);

          // Label text
          context.fillStyle = "#000000"; // Black text for contrast
          context.fillText(label, x1 + 5, y1 + 22);
        });
      }
    };
  }, [image, detections, previewUrl]);

  // Rest of your component code...

  // Mock stats
  const stats = {
    mAP: 0.847,
    mAP50: 0.923,
    mAP75: 0.876,
    precision: 0.891,
    recall: 0.865,
    f1Score: 0.878,
    inferenceTime: 45,
    totalObjects: 3,
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetections([]);
      processImage(file);
      setError(null);
    }
  };

  const handleGraphSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGraphImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (file) => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsProcessing(true);
    setShowResults(false);
    setError(null);
    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/detect/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "An unknown error occurred.");
      }

      const data = await response.json();
      setDetections(data.detections);
      console.log("Detections received:", data.detections);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
      console.error("Error during file upload:", err);
    } finally {
      setIsProcessing(false);
      setShowResults(true);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl shadow-lg shadow-purple-500/50">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Falcon VisionAI
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            AI powered purely by synthesized data generated in a 3d environment,
            with the support of Unreal Engine, no real data was used to train
            the model
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {!image ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative backdrop-blur-xl bg-white/5 border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                  isDragging
                    ? "border-cyan-400 bg-cyan-500/10 scale-105"
                    : "border-purple-500/30 hover:border-purple-400/50"
                }`}
              >
                {error && <p style={{ color: "red" }}>Error: {error}</p>}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="text-center">
                  <div
                    className={`inline-block mb-6 transition-transform duration-300 ${
                      isDragging ? "scale-110" : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-400/30">
                        <Upload className="w-16 h-16 text-purple-300" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-3xl font-semibold mb-3 text-white">
                    {isDragging ? "Drop your image here" : "Upload an Image"}
                  </h3>
                  <p className="text-purple-200 mb-8 text-lg">
                    Drag and drop or click to browse
                  </p>

                  <button
                    onClick={handleUploadClick}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Choose Image
                    </span>
                  </button>
                </div>
              </div>
              {stats && (
                <div className="space-y-6 mt-6  animate-fade-in">
                  <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-xl font-semibold">
                        Model Metrics (Average across the Targets)
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-200">mAP</span>
                          <span className="text-2xl font-bold text-cyan-400">
                            {(stats.mAP * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.mAP * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-200">mAP@50</span>
                          <span className="text-2xl font-bold text-cyan-400">
                            {(stats.mAP50 * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.mAP50 * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-purple-200">mAP@75</span>
                          <span className="text-2xl font-bold text-cyan-400">
                            {(stats.mAP75 * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/30 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.mAP75 * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                          <div className="text-sm text-purple-200 mb-1">
                            Precision
                          </div>
                          <div className="text-xl font-bold text-white">
                            {(stats.precision * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                          <div className="text-sm text-purple-200 mb-1">
                            Recall
                          </div>
                          <div className="text-xl font-bold text-white">
                            {(stats.recall * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">F1 Score</span>
                          <span className="text-xl font-bold text-white">
                            {(stats.f1Score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-xl font-semibold">Graphs & charts</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-cyan-400" />
                          <span className="text-purple-200">
                            Inference Time
                          </span>
                        </div>
                        <span className="font-semibold text-white">
                          {stats.inferenceTime}ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-cyan-400" />
                          <span className="text-purple-200">Total Objects</span>
                        </div>
                        <span className="font-semibold text-white">
                          {stats.totalObjects}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                <div className="lg:col-span-2 space-y-6">
                  <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30">
                    <div className="relative inline-block w-full">
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
                            <p className="text-xl font-semibold text-white">
                              Analyzing Image...
                            </p>
                            <p className="text-purple-300 mt-2">
                              Detecting objects with AI
                            </p>
                          </div>
                        </div>
                      )}
                      {showResults && (
                        <div>
                          <canvas
                            ref={canvasRef}
                            className="w-full rounded-2xl shadow-2xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {showResults && (
                  <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-2xl font-semibold">
                        Detected Objects
                      </h3>
                    </div>

                    <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
                      {detections.map((detection, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-lg">
                              {detection.class_name}
                            </span>
                            <span className="px-2 py-1 bg-cyan-500/20 rounded-lg text-sm text-cyan-300">
                              {(detection.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${detection.confidence * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Real-time object detection",
            },
            {
              icon: Sparkles,
              title: "High Accuracy",
              desc: "Advanced AI models",
            },
            {
              icon: Camera,
              title: "Easy Upload",
              desc: "Drag, drop, or browse",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-purple-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
            >
              <feature.icon className="w-10 h-10 text-cyan-400 mb-3" />
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-purple-200">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
