import React, { useState, useRef } from 'react';
import { Upload, Zap, Sparkles, Camera, ImagePlus, Loader2, BarChart3, TrendingUp, Target, Clock } from 'lucide-react';

export default function ObjectDetectionUI() {
  const [image, setImage] = useState(null);
  const [graphImage, setGraphImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);
  const graphInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [detections, setDetections] = useState([]);
  const [error, setError] = useState(null);
  // Mock detection results for UI demo
  const mockDetections = [
    { class_name: 'Person', confidence: 0.95, x: 20, y: 15, w: 35, h: 60  },
    { class_name: 'Laptop', confidence: 0.88,  x: 45, y: 40, w: 30, h: 25  },
    { class_name: 'Cup', confidence: 0.82,  x: 75, y: 50, w: 15, h: 20  }
  ];

  // Mock stats
  const stats = {
    mAP: 0.847,
    mAP50: 0.923,
    mAP75: 0.876,
    precision: 0.891,
    recall: 0.865,
    f1Score: 0.878,
    inferenceTime: 45,
    totalObjects: 3
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
    if (file && file.type.startsWith('image/')) {
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

    // const [selectedFile, setSelectedFile] = useState(null);
 // Event handler for upload
    const processImage = async (file) => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setIsProcessing(true);
        setShowResults(false);
        setError(null);
        console.log('Uploading file:', file);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/detect/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'An unknown error occurred.');
            }

            const data = await response.json();
            setDetections(data.detections);
            console.log('Data from server:', data);
            // setDetections(mockDetections); // Use mock data for UI demo
            console.log('Detections received:', data.detections);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError(err.message);
            console.error('Error during file upload:', err);
        } finally {
            setIsProcessing(false);
            setShowResults(true);
        }
    };
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleGraphUploadClick = () => {
    graphInputRef.current.click();
  };

  const handleReset = () => {
    setImage(null);
    setGraphImage(null);
    setShowResults(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
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
            Advanced object detection powered by cutting-edge AI technology
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {!image ? (
            /* Upload Area */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative backdrop-blur-xl bg-white/5 border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10 scale-105'
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
            >
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="text-center">
                <div className={`inline-block mb-6 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative p-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-400/30">
                      <Upload className="w-16 h-16 text-purple-300" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-semibold mb-3 text-white">
                  {isDragging ? 'Drop your image here' : 'Upload an Image'}
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
          ) : (
            /* Results Area */
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Image Display */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30">
                    <div className="relative inline-block w-full">
                      <img
                        src={image}
                        alt="Uploaded"
                        className="w-full rounded-2xl shadow-2xl"
                      />
                      
                      {/* Processing Overlay */}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
                            <p className="text-xl font-semibold text-white">Analyzing Image...</p>
                            <p className="text-purple-300 mt-2">Detecting objects with AI</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Bounding Boxes */}
                      {showResults && detections.map((detection, idx) => (
                        <div
                          key={idx}
                          className="absolute border-4 border-cyan-400 rounded-lg animate-fade-in shadow-lg shadow-cyan-400/50"
                          style={{
                            left: `${detection.x}%`,
                            top: `${detection.y}%`,
                            width: `${detection.w}%`,
                            height: `${detection.h}%`,
                            animationDelay: `${idx * 200}ms`
                          }}
                        >
                          <div className="absolute -top-10 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap shadow-lg">
                            {detection.class_name} {(detection.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detection Results Panel */}
                  {showResults && (
                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30 animate-fade-in">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-2xl font-semibold">Detected Objects</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {detections.map((detection, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-lg">{detection.class_name}</span>
                              <span className="px-2 py-1 bg-cyan-500/20 rounded-lg text-sm text-cyan-300">
                                {(detection.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-purple-900/30 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${detection.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Stats & Metrics */}
                {showResults && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Performance Metrics */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-6">
                        <Target className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-semibold">Performance Metrics</h3>
                      </div>

                      <div className="space-y-4">
                        {/* mAP */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-200">mAP</span>
                            <span className="text-2xl font-bold text-cyan-400">{(stats.mAP * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${stats.mAP * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* mAP@50 */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-200">mAP@50</span>
                            <span className="text-2xl font-bold text-cyan-400">{(stats.mAP50 * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${stats.mAP50 * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* mAP@75 */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-200">mAP@75</span>
                            <span className="text-2xl font-bold text-cyan-400">{(stats.mAP75 * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${stats.mAP75 * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Precision & Recall */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                            <div className="text-sm text-purple-200 mb-1">Precision</div>
                            <div className="text-xl font-bold text-white">{(stats.precision * 100).toFixed(1)}%</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                            <div className="text-sm text-purple-200 mb-1">Recall</div>
                            <div className="text-xl font-bold text-white">{(stats.recall * 100).toFixed(1)}%</div>
                          </div>
                        </div>

                        {/* F1 Score */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-400/20">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-200">F1 Score</span>
                            <span className="text-xl font-bold text-white">{(stats.f1Score * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-semibold">Statistics</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span className="text-purple-200">Inference Time</span>
                          </div>
                          <span className="font-semibold text-white">{stats.inferenceTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-400" />
                            <span className="text-purple-200">Total Objects</span>
                          </div>
                          <span className="font-semibold text-white">{stats.totalObjects}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Graph Section */}
              {showResults && (
                <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-purple-500/30 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-2xl font-semibold">Performance Graphs</h3>
                    </div>
                    <button
                      onClick={handleGraphUploadClick}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <ImagePlus className="w-4 h-4" />
                        Upload Graph
                      </span>
                    </button>
                    <input
                      ref={graphInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGraphSelect}
                      className="hidden"
                    />
                  </div>

                  {graphImage ? (
                    <div className="rounded-2xl overflow-hidden border border-purple-400/30">
                      <img
                        src={graphImage}
                        alt="Performance Graph"
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-12 text-center hover:border-purple-400/50 transition-all duration-300">
                      <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                      <p className="text-purple-200 text-lg mb-2">No graph uploaded</p>
                      <p className="text-purple-300 text-sm">Click "Upload Graph" to add performance visualizations</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleUploadClick}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
                >
                  <span className="flex items-center gap-2">
                    <ImagePlus className="w-5 h-5" />
                    Upload New Image
                  </span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Real-time object detection' },
            { icon: Sparkles, title: 'High Accuracy', desc: 'Advanced AI models' },
            { icon: Camera, title: 'Easy Upload', desc: 'Drag, drop, or browse' }
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