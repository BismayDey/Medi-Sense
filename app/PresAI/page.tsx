"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Upload,
  ImageIcon,
  FileText,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging]
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setFileName(file.name);
      setActiveStep(2);
    };
    reader.readAsDataURL(file);
    setDescription(null);
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setActiveStep(3);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then((res) => res.blob());
      formData.append("image", blob);

      const response = await fetch("/api/ImageAi", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDescription(data.result);
      setActiveStep(4);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze image. Please try again."
      );
      setActiveStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setFileName(null);
    setDescription(null);
    setError(null);
    setActiveStep(1);
  };

  const steps = [
    { number: 1, title: "Upload Image", icon: <Upload className="w-5 h-5" /> },
    {
      number: 2,
      title: "Review Image",
      icon: <ImageIcon className="w-5 h-5" />,
    },
    { number: 3, title: "Analyze", icon: <Loader2 className="w-5 h-5" /> },
    { number: 4, title: "Results", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      <div className="max-w-5xl w-full mx-auto p-6 md:p-8 flex-grow">
        <header className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-teal-800 mb-3"
          >
            Health Image Analysis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-teal-600 text-lg"
          >
            Upload medical images for AI-powered analysis and insights
          </motion.p>
        </header>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center w-full max-w-3xl mx-auto px-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex flex-col items-center relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-5 w-full h-[2px] right-1/2 z-0">
                    <div
                      className={`h-full transition-all duration-500 ${
                        activeStep > step.number ? "bg-teal-500" : "bg-gray-200"
                      }`}
                      style={{
                        width: activeStep > step.number ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                )}

                {/* Step circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                    activeStep === step.number
                      ? "bg-teal-500 text-white ring-4 ring-teal-100"
                      : activeStep > step.number
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {activeStep > step.number ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step title */}
                <span
                  className={`mt-2 text-sm font-medium ${
                    activeStep >= step.number
                      ? "text-teal-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Upload className="w-5 h-5 text-teal-600 mr-2" />
                    <h2 className="font-semibold text-xl text-teal-800">
                      Upload an image for analysis
                    </h2>
                  </div>

                  <div className="mb-6 bg-teal-50 rounded-lg p-4 border border-teal-100 flex items-start">
                    <Info className="w-5 h-5 text-teal-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-teal-800 mb-1">
                        Instructions
                      </h3>
                      <ul className="text-sm text-teal-700 space-y-1 list-disc pl-5">
                        <li>Upload clear, well-lit images for best results</li>
                        <li>
                          Ensure the medical condition is clearly visible in the
                          frame
                        </li>
                        <li>Maximum file size: 10MB</li>
                        <li>Supported formats: JPG, PNG, WEBP</li>
                        <li>
                          All images are processed securely and not stored
                          permanently
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    className={`relative border-2 ${
                      isDragging
                        ? "border-teal-500 bg-teal-50"
                        : "border-dashed border-teal-200"
                    } rounded-lg p-8 transition-all duration-300 hover:border-teal-400`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center">
                      <motion.div
                        animate={{
                          y: isDragging ? -10 : 0,
                          scale: isDragging ? 1.1 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <ImageIcon className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-teal-700 mb-2">
                        {isDragging
                          ? "Drop your image here"
                          : "Drag and drop your image here"}
                      </h3>
                      <p className="text-teal-600 mb-4">or</p>
                      <button
                        onClick={handleButtonClick}
                        type="button"
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        Browse Files
                      </button>
                      <p className="mt-4 text-sm text-gray-500">
                        Supports JPG, PNG, and other common formats (max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && image && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <ImageIcon className="w-5 h-5 text-teal-600 mr-2" />
                    <h2 className="font-semibold text-xl text-teal-800">
                      Image Preview
                    </h2>
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-teal-600 mb-2">
                    <span className="font-medium">File:</span> {fileName}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={image}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg mx-auto max-h-[400px] object-contain"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={resetAnalysis}
                    className="px-4 py-2 border border-teal-200 text-teal-700 rounded-md hover:bg-teal-50 transition-colors"
                  >
                    Upload Different Image
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzeImage}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-md font-medium flex items-center justify-center min-w-[180px] bg-[#0284c7]/10 text-white hover:bg-teal-700 shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
                  >
                    Analyze Image <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8 flex flex-col items-center justify-center min-h-[400px]"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="w-16 h-16 text-teal-500 mb-6" />
                </motion.div>
                <h2 className="text-xl font-semibold text-teal-800 mb-2">
                  Analyzing Your Image
                </h2>
                <p className="text-teal-600 text-center max-w-md">
                  Our AI is examining your image to provide detailed medical
                  insights. This may take a few moments...
                </p>
              </motion.div>
            )}

            {activeStep === 4 && description && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-teal-600 mr-2" />
                    <h2 className="font-semibold text-xl text-teal-800">
                      Analysis Results
                    </h2>
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    New Analysis
                  </button>
                </div>

                {image && (
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="md:w-1/3">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <img
                          src={image || "/placeholder.svg"}
                          alt="Analyzed"
                          className="max-w-full h-auto rounded-lg mx-auto object-contain"
                        />
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <div className="p-5 bg-teal-50 rounded-lg border border-teal-100 h-full overflow-auto">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="prose prose-teal max-w-none"
                        >
                          <ReactMarkdown>{description}</ReactMarkdown>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <div className="flex">
                    <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-blue-800 font-medium mb-1">
                        Important Note
                      </h3>
                      <p className="text-blue-700 text-sm">
                        This analysis is provided as a preliminary assessment
                        tool. Always consult with a qualified healthcare
                        professional for proper diagnosis and treatment. The AI
                        analysis should not replace professional medical advice.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={resetAnalysis}
                    className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors shadow-md"
                  >
                    Analyze Another Image
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-8 mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-teal-600">
          <p className="mb-1">
            This tool is designed to assist healthcare professionals. Results
            should be verified by qualified medical personnel.
          </p>
          <p>© {new Date().getFullYear()} Health Image Analysis Tool</p>
        </footer>
      </div>
    </div>
  );
}
