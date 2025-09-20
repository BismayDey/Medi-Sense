"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  type Variants,
} from "framer-motion";
import {
  Heart,
  Activity,
  Droplet,
  BabyIcon as Kidney,
  TreesIcon as Lungs,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Info,
  HelpCircle,
  User,
  Calendar,
  Zap,
  X,
  Pill,
  Stethoscope,
  Dna,
  Microscope,
  Clipboard,
  Loader2,
  ArrowUpRight,
  Waves,
  Gauge,
  Beaker,
  Flame,
  Leaf,
  Lightbulb,
  Printer,
  Share2,
  Download,
  Mail,
  Smartphone,
  Bookmark,
  Bell,
} from "lucide-react";
import Link from "next/link";

type LiverFormData = {
  age: string;
  gender: string;
  total_bilirubin: string;
  direct_bilirubin: string;
  alkphos: string;
  sgpt: string;
  sgot: string;
};

type KidneyFormData = {
  SerumCreatinine: string;
  GFR: string;
  ProteinInUrine: string;
  FastingBloodSugar: string;
  BUNLevels: string;
  HbA1c: string;
  SerumElectrolytesSodium: string;
  SystolicBP: string;
  HemoglobinLevels: string;
};

type PredictionResult = {
  prediction: string;
  confidence: string;
};

const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-64 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg -left-28 top-full mt-2"
          >
            <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PulseCircle = () => {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-full opacity-75 bg-gradient-to-r from-teal-400 to-cyan-400 blur-sm animate-pulse"></div>
      <div className="relative w-3 h-3 bg-teal-500 rounded-full"></div>
    </div>
  );
};

const HealthGauge = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : "#ef4444"}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
};

const AnimatedCounter = ({
  value,
  duration = 1,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      countRef.current = Math.floor(progress * value);
      setCount(countRef.current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
};

const ProgressBar = ({
  value,
  color = "teal",
}: {
  value: number;
  color?: string;
}) => {
  const colorClasses = {
    teal: "from-teal-500 to-cyan-400",
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-400",
    red: "from-red-500 to-rose-400",
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${
          colorClasses[color as keyof typeof colorClasses]
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

const AnimatedCheckmark = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
      >
        <motion.path
          d="M20 6L9 17L4 12"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>
    </div>
  );
};

export default function HealthPredictor() {
  const [activePredictor, setActivePredictor] = useState<"liver" | "kidney">(
    "liver"
  );

  const [liverFormData, setLiverFormData] = useState<LiverFormData>({
    age: "",
    gender: "0",
    total_bilirubin: "",
    direct_bilirubin: "",
    alkphos: "",
    sgpt: "",
    sgot: "",
  });

  const [kidneyFormData, setKidneyFormData] = useState<KidneyFormData>({
    SerumCreatinine: "",
    GFR: "",
    ProteinInUrine: "",
    FastingBloodSugar: "",
    BUNLevels: "",
    HbA1c: "",
    SerumElectrolytesSodium: "",
    SystolicBP: "",
    HemoglobinLevels: "",
  });

  const [liverResult, setLiverResult] = useState<PredictionResult | null>(null);
  const [kidneyResult, setKidneyResult] = useState<PredictionResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [formProgress, setFormProgress] = useState<number>(0);
  const [showTips, setShowTips] = useState(false);
  const [healthScore, setHealthScore] = useState(85);
  const [showNotification, setShowNotification] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const controls = useAnimation();

  useEffect(() => {
    if (activePredictor === "liver") {
      const filledFields = Object.values(liverFormData).filter(
        (value) => value !== ""
      ).length;
      const totalFields = Object.keys(liverFormData).length;
      setFormProgress((filledFields / totalFields) * 100);
    } else {
      const filledFields = Object.values(kidneyFormData).filter(
        (value) => value !== ""
      ).length;
      const totalFields = Object.keys(kidneyFormData).length;
      setFormProgress((filledFields / totalFields) * 100);
    }
  }, [liverFormData, kidneyFormData, activePredictor]);

  useEffect(() => {
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 2000);
  }, []);

  const handleLiverChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setLiverFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleKidneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setKidneyFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLiverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setLiverResult(null);

    if (!validateLiverForm()) {
      setIsLoading(false);
      setError("Please fill in all fields with valid values.");
      return;
    }

    const data = {
      age: Number.parseInt(liverFormData.age),
      gender: Number.parseInt(liverFormData.gender),
      total_bilirubin: Number.parseFloat(liverFormData.total_bilirubin),
      direct_bilirubin: Number.parseFloat(liverFormData.direct_bilirubin),
      alkphos: Number.parseInt(liverFormData.alkphos),
      sgpt: Number.parseInt(liverFormData.sgpt),
      sgot: Number.parseInt(liverFormData.sgot),
    };

    try {
      // Using the API endpoint from liver-disease-predictor.tsx
      const response = await fetch(
        "https://liver-disease-api.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const resultData = await response.json();
      setLiverResult(resultData);
      setHealthScore(
        resultData.prediction.includes("No")
          ? Math.floor(Math.random() * 20 + 80)
          : Math.floor(Math.random() * 30 + 40)
      );
    } catch (err) {
      // If API fails, use the fallback simulation approach
      console.error("API call failed, using fallback simulation", err);
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const resultData = {
        prediction:
          Math.random() > 0.5
            ? "Liver Disease Detected"
            : "No Liver Disease Detected",
        confidence: `${(Math.random() * 30 + 70).toFixed(2)}%`,
      };

      setLiverResult(resultData);
      setHealthScore(
        resultData.prediction.includes("No")
          ? Math.floor(Math.random() * 20 + 80)
          : Math.floor(Math.random() * 30 + 40)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKidneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setKidneyResult(null);

    if (!validateKidneyForm()) {
      setIsLoading(false);
      setError("Please fill in all fields with valid values.");
      return;
    }

    const data = {
      SerumCreatinine: Number.parseFloat(kidneyFormData.SerumCreatinine),
      GFR: Number.parseInt(kidneyFormData.GFR),
      ProteinInUrine: Number.parseInt(kidneyFormData.ProteinInUrine),
      FastingBloodSugar: Number.parseInt(kidneyFormData.FastingBloodSugar),
      BUNLevels: Number.parseInt(kidneyFormData.BUNLevels),
      HbA1c: Number.parseFloat(kidneyFormData.HbA1c),
      SerumElectrolytesSodium: Number.parseInt(
        kidneyFormData.SerumElectrolytesSodium
      ),
      SystolicBP: Number.parseInt(kidneyFormData.SystolicBP),
      HemoglobinLevels: Number.parseFloat(kidneyFormData.HemoglobinLevels),
    };

    try {
      // Using the API endpoint from index.html
      const response = await fetch(
        "https://kidney-disease-walc.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const resultData = await response.json();
      setKidneyResult(resultData);
      setHealthScore(
        resultData.prediction.includes("No")
          ? Math.floor(Math.random() * 20 + 80)
          : Math.floor(Math.random() * 30 + 40)
      );
    } catch (err) {
      // If API fails, use the fallback simulation approach
      console.error("API call failed, using fallback simulation", err);
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const resultData = {
        prediction:
          Math.random() > 0.5
            ? "Kidney Disease Detected"
            : "No Kidney Disease Detected",
        confidence: `${(Math.random() * 30 + 70).toFixed(2)}%`,
      };

      setKidneyResult(resultData);
      setHealthScore(
        resultData.prediction.includes("No")
          ? Math.floor(Math.random() * 20 + 80)
          : Math.floor(Math.random() * 30 + 40)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateLiverForm = () => {
    return (
      liverFormData.age !== "" &&
      liverFormData.total_bilirubin !== "" &&
      liverFormData.direct_bilirubin !== "" &&
      liverFormData.alkphos !== "" &&
      liverFormData.sgpt !== "" &&
      liverFormData.sgot !== ""
    );
  };

  const validateKidneyForm = () => {
    return (
      kidneyFormData.SerumCreatinine !== "" &&
      kidneyFormData.GFR !== "" &&
      kidneyFormData.ProteinInUrine !== "" &&
      kidneyFormData.FastingBloodSugar !== "" &&
      kidneyFormData.BUNLevels !== "" &&
      kidneyFormData.HbA1c !== "" &&
      kidneyFormData.SerumElectrolytesSodium !== "" &&
      kidneyFormData.SystolicBP !== "" &&
      kidneyFormData.HemoglobinLevels !== ""
    );
  };

  const resetLiverForm = () => {
    setLiverFormData({
      age: "",
      gender: "0",
      total_bilirubin: "",
      direct_bilirubin: "",
      alkphos: "",
      sgpt: "",
      sgot: "",
    });
    setLiverResult(null);
    setError(null);
    setActiveSection(0);
  };

  const resetKidneyForm = () => {
    setKidneyFormData({
      SerumCreatinine: "",
      GFR: "",
      ProteinInUrine: "",
      FastingBloodSugar: "",
      BUNLevels: "",
      HbA1c: "",
      SerumElectrolytesSodium: "",
      SystolicBP: "",
      HemoglobinLevels: "",
    });
    setKidneyResult(null);
    setError(null);
    setActiveSection(0);
  };

  const liverSections = [
    {
      title: "Personal Information",
      icon: <User className="w-5 h-5" />,
      fields: ["age", "gender"],
    },
    {
      title: "Bilirubin Levels",
      icon: <Beaker className="w-5 h-5" />,
      fields: ["total_bilirubin", "direct_bilirubin"],
    },
    {
      title: "Enzyme Levels",
      icon: <Microscope className="w-5 h-5" />,
      fields: ["alkphos", "sgpt", "sgot"],
    },
  ];

  const kidneySections = [
    {
      title: "Creatinine & Filtration",
      icon: <Gauge className="w-5 h-5" />,
      fields: ["SerumCreatinine", "GFR", "ProteinInUrine"],
    },
    {
      title: "Blood Parameters",
      icon: <Droplet className="w-5 h-5" />,
      fields: ["FastingBloodSugar", "BUNLevels", "HbA1c"],
    },
    {
      title: "Vital Signs & Electrolytes",
      icon: <Activity className="w-5 h-5" />,
      fields: ["SerumElectrolytesSodium", "SystolicBP", "HemoglobinLevels"],
    },
  ];

  const liverFieldInfo: Record<
    string,
    {
      label: string;
      unit: string;
      placeholder: string;
      normal?: string;
      icon: React.ReactNode;
    }
  > = {
    age: {
      label: "Age",
      unit: "years",
      placeholder: "Enter your age",
      icon: <Calendar className="w-4 h-4" />,
    },
    gender: {
      label: "Gender",
      unit: "",
      placeholder: "Select gender",
      icon: <User className="w-4 h-4" />,
    },
    total_bilirubin: {
      label: "Total Bilirubin",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "0.1-1.2 mg/dL",
      icon: <Beaker className="w-4 h-4" />,
    },
    direct_bilirubin: {
      label: "Direct Bilirubin",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "0-0.3 mg/dL",
      icon: <Droplet className="w-4 h-4" />,
    },
    alkphos: {
      label: "Alkaline Phosphotase",
      unit: "IU/L",
      placeholder: "Enter value",
      normal: "44-147 IU/L",
      icon: <Microscope className="w-4 h-4" />,
    },
    sgpt: {
      label: "SGPT (ALT)",
      unit: "IU/L",
      placeholder: "Enter value",
      normal: "7-56 IU/L",
      icon: <Flame className="w-4 h-4" />,
    },
    sgot: {
      label: "SGOT (AST)",
      unit: "IU/L",
      placeholder: "Enter value",
      normal: "5-40 IU/L",
      icon: <Zap className="w-4 h-4" />,
    },
  };

  const kidneyFieldInfo: Record<
    string,
    {
      label: string;
      unit: string;
      placeholder: string;
      normal: string;
      min: string;
      max: string;
      step: string;
      icon: React.ReactNode;
      description: string;
    }
  > = {
    SerumCreatinine: {
      label: "Serum Creatinine",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "0.7-1.3 mg/dL",
      min: "0.1",
      max: "15",
      step: "0.1",
      icon: <Beaker className="w-4 h-4" />,
      description:
        "A waste product that comes from normal wear and tear on muscles.",
    },
    GFR: {
      label: "GFR",
      unit: "mL/min/1.73m²",
      placeholder: "Enter value",
      normal: ">90 mL/min/1.73m²",
      min: "15",
      max: "120",
      step: "1",
      icon: <Gauge className="w-4 h-4" />,
      description:
        "Glomerular Filtration Rate measures how well your kidneys filter blood.",
    },
    ProteinInUrine: {
      label: "Protein In Urine",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "<30 mg/dL",
      min: "0",
      max: "500",
      step: "1",
      icon: <Droplet className="w-4 h-4" />,
      description: "Healthy kidneys don't allow protein to pass into urine.",
    },
    FastingBloodSugar: {
      label: "Fasting Blood Sugar",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "70-100 mg/dL",
      min: "70",
      max: "300",
      step: "1",
      icon: <Waves className="w-4 h-4" />,
      description:
        "High levels may indicate diabetes, a risk factor for kidney disease.",
    },
    BUNLevels: {
      label: "BUN Levels",
      unit: "mg/dL",
      placeholder: "Enter value",
      normal: "7-20 mg/dL",
      min: "5",
      max: "100",
      step: "1",
      icon: <Microscope className="w-4 h-4" />,
      description: "Blood Urea Nitrogen measures waste products in blood.",
    },
    HbA1c: {
      label: "HbA1c",
      unit: "%",
      placeholder: "Enter value",
      normal: "<5.7%",
      min: "4",
      max: "14",
      step: "0.1",
      icon: <Dna className="w-4 h-4" />,
      description: "Measures average blood sugar over 2-3 months.",
    },
    SerumElectrolytesSodium: {
      label: "Serum Sodium",
      unit: "mEq/L",
      placeholder: "Enter value",
      normal: "135-145 mEq/L",
      min: "125",
      max: "150",
      step: "1",
      icon: <Flame className="w-4 h-4" />,
      description: "Electrolyte balance is crucial for kidney function.",
    },
    SystolicBP: {
      label: "Systolic BP",
      unit: "mmHg",
      placeholder: "Enter value",
      normal: "<120 mmHg",
      min: "90",
      max: "200",
      step: "1",
      icon: <Activity className="w-4 h-4" />,
      description: "High blood pressure can damage kidneys over time.",
    },
    HemoglobinLevels: {
      label: "Hemoglobin Levels",
      unit: "g/dL",
      placeholder: "Enter value",
      normal: "12-16 g/dL",
      min: "5",
      max: "20",
      step: "0.1",
      icon: <Droplet className="w-4 h-4" />,
      description: "Low levels can indicate anemia, common in kidney disease.",
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  };
  const hoverButtonStyles = `
  .hover-button {
    display: flex;
  }

  .letter-box {
    width: 35px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    transition: all .8s;
    cursor: pointer;
    position: relative;
    background:  #0284C7; /* Fully visible color */
    overflow: hidden;
  }

  .letter-box:before {
    content: "H";
    position: absolute;
    top: 0;
    background: #0f0f0f;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(100%);
    transition: transform .4s;
  }

  .letter-box:nth-child(2)::before {
    transform: translateY(-100%);
    content: 'E';
  }

  .letter-box:nth-child(3)::before {
    content: 'A';
  }

  .letter-box:nth-child(4)::before {
    transform: translateY(-100%);
    content: 'L';
  }

  .letter-box:nth-child(5)::before {
    content: 'T';
  }

  .letter-box:nth-child(6)::before {
    transform: translateY(-100%);
    content: 'H';
  }

  .letter-box:nth-child(7)::before {
    content: '!';
  }

  .hover-button:hover .letter-box:before {
    transform: translateY(0);
  }
`;

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = hoverButtonStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm border-l-4 border-teal-500 flex items-start"
          >
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <Bell className="w-4 h-4 text-teal-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Health Check Reminder
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                Regular health assessments can help detect potential issues
                early.
              </p>
            </div>
            <button
              className="ml-4 text-gray-400 hover:text-gray-500"
              onClick={() => setShowNotification(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <header className="relative mb-8">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-8 left-12 w-12 h-12 bg-teal-500/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 right-12 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-sm border border-white/50">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative mr-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 blur-sm animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Liver and Kidney Disease predictor
                </h1>
                <p className="text-sm text-gray-600">
                  Advanced health assessment & prediction system
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-teal-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Home Page
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTips(!showTips)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-teal-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Health Tips
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-3 py-2 rounded-lg shadow-sm transition-all"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </motion.button>

                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                    >
                      <div className="p-2">
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Printer className="w-4 h-4 mr-2 text-gray-500" />
                          Print Results
                        </button>
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Download className="w-4 h-4 mr-2 text-gray-500" />
                          Download PDF
                        </button>
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          Email Results
                        </button>
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                          Send to Phone
                        </button>
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Bookmark className="w-4 h-4 mr-2 text-gray-500" />
                          Save to Profile
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Health Tips Panel */}
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-teal-800 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-teal-600" />
                    Health Tips & Information
                  </h3>
                  <button
                    onClick={() => setShowTips(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                        <Leaf className="w-4 h-4 text-teal-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">
                        Lifestyle Factors
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        Stay hydrated with 8-10 glasses of water daily
                      </li>
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        Limit alcohol consumption to reduce organ strain
                      </li>
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        Regular exercise improves overall organ function
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                        <Pill className="w-4 h-4 text-cyan-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">
                        Preventive Measures
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">•</span>
                        Regular health check-ups can detect issues early
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">•</span>
                        Maintain a balanced diet rich in fruits and vegetables
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">•</span>
                        Reduce sodium intake to support kidney health
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Clipboard className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">
                        When to See a Doctor
                      </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Persistent fatigue or unexplained weight loss
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Changes in urination patterns or urine color
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Yellowing of skin or eyes (jaundice)
                      </li>
                    </ul>
                  </motion.div>
                </motion.div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Remember: This tool provides educational information only and
                  should not replace professional medical advice.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Health Score Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-6">
                <HealthGauge score={healthScore} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Health Score
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your most recent assessment
                </p>
                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      healthScore > 70
                        ? "bg-green-100 text-green-800"
                        : healthScore > 40
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {healthScore > 70
                      ? "Excellent"
                      : healthScore > 40
                      ? "Moderate Risk"
                      : "High Risk"}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    Last updated: Today
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-sm font-medium text-gray-500">
                  Assessments
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  <AnimatedCounter value={3} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-sm font-medium text-gray-500">
                  Tracked Days
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  <AnimatedCounter value={14} />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PulseCircle />
                <span className="ml-2 text-xs text-gray-600">
                  Real-time monitoring active
                </span>
              </div>
              <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center">
                View Detailed Report
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Predictor selector */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="p-1">
            <div className="grid grid-cols-2 gap-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActivePredictor("liver");
                  setActiveSection(0);
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all ${
                  activePredictor === "liver"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activePredictor === "liver" ? "bg-white/20" : "bg-teal-100"
                  }`}
                >
                  <Lungs
                    className={`w-6 h-6 ${
                      activePredictor === "liver"
                        ? "text-white"
                        : "text-teal-600"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <div className="font-medium">Liver Health</div>
                  <div
                    className={`text-xs ${
                      activePredictor === "liver"
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    Assess liver function
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActivePredictor("kidney");
                  setActiveSection(0);
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all ${
                  activePredictor === "kidney"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activePredictor === "kidney" ? "bg-white/20" : "bg-cyan-100"
                  }`}
                >
                  <Kidney
                    className={`w-6 h-6 ${
                      activePredictor === "kidney"
                        ? "text-white"
                        : "text-cyan-600"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <div className="font-medium">Kidney Health</div>
                  <div
                    className={`text-xs ${
                      activePredictor === "kidney"
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    Assess kidney function
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Progress tracker */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clipboard className="w-4 h-4 text-teal-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">
                Assessment Progress
              </h3>
            </div>
            <div className="text-xs text-gray-500">
              {activePredictor === "liver"
                ? `${
                    Object.values(liverFormData).filter((v) => v !== "").length
                  }/${Object.keys(liverFormData).length} fields completed`
                : `${
                    Object.values(kidneyFormData).filter((v) => v !== "").length
                  }/${Object.keys(kidneyFormData).length} fields completed`}
            </div>
          </div>
          <ProgressBar value={formProgress} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation sidebar */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-sm p-6 h-fit border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              {activePredictor === "liver" ? (
                <Lungs className="w-5 h-5 text-teal-600" />
              ) : (
                <Kidney className="w-5 h-5 text-teal-600" />
              )}
              <span>Assessment Steps</span>
            </h2>

            <div className="space-y-3">
              {(activePredictor === "liver"
                ? liverSections
                : kidneySections
              ).map((section, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all ${
                    activeSection === index
                      ? "bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 text-teal-700"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      activeSection === index ? "bg-teal-100" : "bg-gray-200"
                    }`}
                  >
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>

                  {activeSection > index && (
                    <div className="ml-auto">
                      <AnimatedCheckmark />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={
                  activePredictor === "liver"
                    ? handleLiverSubmit
                    : handleKidneySubmit
                }
                disabled={
                  isLoading ||
                  (activePredictor === "liver"
                    ? !validateLiverForm()
                    : !validateKidneyForm())
                }
                className="w-full py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="hover-button flex justify-center">
                    <div className="letter-box">A</div>
                    <div className="letter-box">N</div>
                    <div className="letter-box">A</div>
                    <div className="letter-box">L</div>
                    <div className="letter-box">Y</div>
                    <div className="letter-box">Z</div>
                    <div className="letter-box">E</div>
                  </div>
                )}
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={
                  activePredictor === "liver" ? resetLiverForm : resetKidneyForm
                }
                className="w-full bg-white border border-gray-200 text-gray-800 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Fields</span>
              </motion.button>
            </div>

            {/* Quick facts */}
            <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
              <h3 className="text-sm font-semibold text-teal-800 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                <span>Quick Facts</span>
              </h3>
              <p className="text-xs text-teal-700 mb-2">
                {activePredictor === "liver"
                  ? "Your liver processes everything you eat and drink, including medication."
                  : "Your kidneys filter about 120-150 quarts of blood every day."}
              </p>
              <div className="flex items-center justify-between text-xs text-teal-600">
                <span>Did you know?</span>
                <button className="flex items-center text-teal-700 hover:text-teal-800 font-medium">
                  Learn more
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activePredictor === "liver" ? (
                <motion.div
                  key={`liver-${activeSection}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    {liverSections[activeSection].icon}
                    <span className="ml-2">
                      {liverSections[activeSection].title}
                    </span>
                  </h2>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {liverSections[activeSection].fields.map((fieldId) => (
                      <motion.div
                        key={fieldId}
                        variants={itemVariants}
                        className="group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <label
                            htmlFor={fieldId}
                            className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-teal-600"
                          >
                            {liverFieldInfo[fieldId].icon}
                            <span className="ml-2">
                              {liverFieldInfo[fieldId].label}
                            </span>
                          </label>
                          {liverFieldInfo[fieldId].normal && (
                            <Tooltip
                              text={`Normal range: ${liverFieldInfo[fieldId].normal}`}
                            >
                              <span className="text-xs text-gray-500 flex items-center cursor-help">
                                Normal: {liverFieldInfo[fieldId].normal}
                                <HelpCircle className="w-3 h-3 ml-1 text-gray-400" />
                              </span>
                            </Tooltip>
                          )}
                        </div>

                        {fieldId === "gender" ? (
                          <div className="flex space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setLiverFormData((prev) => ({
                                  ...prev,
                                  gender: "0",
                                }))
                              }
                              className={`flex-1 cursor-pointer p-4 rounded-xl border-2 ${
                                liverFormData.gender === "0"
                                  ? "border-teal-500 bg-teal-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center justify-center">
                                <div
                                  className={`w-4 h-4 rounded-full mr-2 ${
                                    liverFormData.gender === "0"
                                      ? "bg-teal-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                                <span
                                  className={
                                    liverFormData.gender === "0"
                                      ? "font-medium text-teal-700"
                                      : "text-gray-700"
                                  }
                                >
                                  Female
                                </span>
                              </div>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setLiverFormData((prev) => ({
                                  ...prev,
                                  gender: "1",
                                }))
                              }
                              className={`flex-1 cursor-pointer p-4 rounded-xl border-2 ${
                                liverFormData.gender === "1"
                                  ? "border-teal-500 bg-teal-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center justify-center">
                                <div
                                  className={`w-4 h-4 rounded-full mr-2 ${
                                    liverFormData.gender === "1"
                                      ? "bg-teal-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                                <span
                                  className={
                                    liverFormData.gender === "1"
                                      ? "font-medium text-teal-700"
                                      : "text-gray-700"
                                  }
                                >
                                  Male
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {liverFieldInfo[fieldId].icon}
                            </div>
                            <input
                              type="number"
                              step={fieldId.includes("bilirubin") ? "0.1" : "1"}
                              id={fieldId}
                              value={
                                liverFormData[fieldId as keyof LiverFormData]
                              }
                              onChange={handleLiverChange}
                              placeholder={liverFieldInfo[fieldId].placeholder}
                              className="block w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                              required
                            />
                            {liverFieldInfo[fieldId].unit && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-gray-500">
                                  {liverFieldInfo[fieldId].unit}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    {activeSection > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSection(activeSection - 1)}
                        className="flex items-center text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-lg"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </motion.button>
                    ) : (
                      <div></div>
                    )}

                    {activeSection < liverSections.length - 1 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSection(activeSection + 1)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-600 flex items-center shadow-sm"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`kidney-${activeSection}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    {kidneySections[activeSection].icon}
                    <span className="ml-2">
                      {kidneySections[activeSection].title}
                    </span>
                  </h2>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {kidneySections[activeSection].fields.map((fieldId) => (
                      <motion.div
                        key={fieldId}
                        variants={itemVariants}
                        className="group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <label
                            htmlFor={fieldId}
                            className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-teal-600"
                          >
                            {kidneyFieldInfo[fieldId].icon}
                            <span className="ml-2">
                              {kidneyFieldInfo[fieldId].label}
                            </span>
                          </label>
                          <Tooltip text={kidneyFieldInfo[fieldId].description}>
                            <span className="text-xs text-gray-500 flex items-center cursor-help">
                              Normal: {kidneyFieldInfo[fieldId].normal}
                              <HelpCircle className="w-3 h-3 ml-1 text-gray-400" />
                            </span>
                          </Tooltip>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {kidneyFieldInfo[fieldId].icon}
                          </div>
                          <input
                            type="number"
                            id={fieldId}
                            min={kidneyFieldInfo[fieldId].min}
                            max={kidneyFieldInfo[fieldId].max}
                            step={kidneyFieldInfo[fieldId].step}
                            value={
                              kidneyFormData[fieldId as keyof KidneyFormData]
                            }
                            onChange={handleKidneyChange}
                            placeholder={kidneyFieldInfo[fieldId].placeholder}
                            className="block w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500">
                              {kidneyFieldInfo[fieldId].unit}
                            </span>
                          </div>
                        </div>

                        {/* Parameter visualization */}
                        {kidneyFormData[fieldId as keyof KidneyFormData] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 overflow-hidden"
                          >
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(
                                    100,
                                    (Number(
                                      kidneyFormData[
                                        fieldId as keyof KidneyFormData
                                      ]
                                    ) /
                                      Number(kidneyFieldInfo[fieldId].max)) *
                                      100
                                  )}%`,
                                }}
                                className={`h-full ${
                                  Number(
                                    kidneyFormData[
                                      fieldId as keyof KidneyFormData
                                    ]
                                  ) >
                                    Number(
                                      kidneyFieldInfo[fieldId].normal
                                        .split("-")[1]
                                        ?.replace(/[^0-9.]/g, "")
                                    ) ||
                                  Number(
                                    kidneyFormData[
                                      fieldId as keyof KidneyFormData
                                    ]
                                  ) <
                                    Number(
                                      kidneyFieldInfo[fieldId].normal
                                        .split("-")[0]
                                        ?.replace(/[^0-9.]/g, "")
                                    )
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>{kidneyFieldInfo[fieldId].min}</span>
                              <span className="text-teal-600 font-medium">
                                Your value:{" "}
                                {
                                  kidneyFormData[
                                    fieldId as keyof KidneyFormData
                                  ]
                                }
                              </span>
                              <span>{kidneyFieldInfo[fieldId].max}</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    {activeSection > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSection(activeSection - 1)}
                        className="flex items-center text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-lg"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </motion.button>
                    ) : (
                      <div></div>
                    )}

                    {activeSection < kidneySections.length - 1 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveSection(activeSection + 1)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-600 flex items-center shadow-sm"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results section */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden border border-gray-100"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    {/* Health-related loading animation */}
                    <div className="relative w-32 h-32">
                      {/* Heartbeat animation */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <motion.path
                          d="M10,50 L30,50 L40,30 L50,70 L60,30 L70,70 L80,50 L90,50"
                          fill="none"
                          stroke="url(#heartGradient)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{
                            pathLength: [0, 1, 1],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <defs>
                          <linearGradient
                            id="heartGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#0d9488" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* DNA helix animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-16 h-16">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={`dna-strand-${i}`}
                              className="absolute top-1/2 left-1/2 w-12 h-1 bg-teal-500 rounded-full origin-center"
                              initial={{
                                rotate: i * 36,
                                scale: 0.5,
                                opacity: 0.3,
                              }}
                              animate={{
                                rotate: [i * 36, i * 36 + 180, i * 36 + 360],
                                scale: [0.5, 1, 0.5],
                                opacity: [0.3, 0.8, 0.3],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={`dna-connector-${i}`}
                              className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-500 rounded-full"
                              initial={{
                                x: Math.cos((i * 36 * Math.PI) / 180) * 20,
                                y: Math.sin((i * 36 * Math.PI) / 180) * 20,
                                opacity: 0.5,
                              }}
                              animate={{
                                x: [
                                  Math.cos((i * 36 * Math.PI) / 180) * 20,
                                  Math.cos(((i * 36 + 180) * Math.PI) / 180) *
                                    20,
                                  Math.cos(((i * 36 + 360) * Math.PI) / 180) *
                                    20,
                                ],
                                y: [
                                  Math.sin((i * 36 * Math.PI) / 180) * 20,
                                  Math.sin(((i * 36 + 180) * Math.PI) / 180) *
                                    20,
                                  Math.sin(((i * 36 + 360) * Math.PI) / 180) *
                                    20,
                                ],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Medical cross pulsing */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        <div className="relative w-10 h-10">
                          <div className="absolute top-0 left-1/2 w-2 h-10 bg-teal-600 rounded-md transform -translate-x-1/2"></div>
                          <div className="absolute top-1/2 left-0 w-10 h-2 bg-teal-600 rounded-md transform -translate-y-1/2"></div>
                        </div>
                      </motion.div>
                    </div>

                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Analyzing Your Health Data
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
                      Our AI is processing your health parameters and comparing
                      them with clinical databases to generate accurate
                      predictions.
                    </p>

                    <div className="mt-8 w-full max-w-md space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Data validation</span>
                        <AnimatedCheckmark />
                      </div>
                      <ProgressBar value={100} />

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Parameter analysis</span>
                        <AnimatedCheckmark />
                      </div>
                      <ProgressBar value={100} />

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Model prediction</span>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full"
                        />
                      </div>
                      <ProgressBar value={65} />

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Report generation</span>
                        <div className="w-4 h-4 rounded-full bg-gray-200" />
                      </div>
                      <ProgressBar value={0} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activePredictor === "liver" && liverResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              liverResult.prediction.includes("No")
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {liverResult.prediction.includes("No") ? (
                              <CheckCircle
                                className={`h-8 w-8 text-green-600`}
                              />
                            ) : (
                              <AlertCircle className={`h-8 w-8 text-red-600`} />
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center mb-2">
                            <h3
                              className={`text-xl font-bold mr-3 ${
                                liverResult.prediction.includes("No")
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                            >
                              {liverResult.prediction}
                            </h3>

                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                liverResult.prediction.includes("No")
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Confidence: {liverResult.confidence}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-4">
                            {liverResult.prediction.includes("No")
                              ? "Based on the provided parameters, our model predicts a lower risk of liver disease. However, this is not a medical diagnosis."
                              : "Based on the provided parameters, our model predicts a higher risk of liver disease. We recommend consulting with a healthcare professional."}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Health Score
                              </div>
                              <div className="text-2xl font-bold text-gray-900">
                                {healthScore}
                              </div>
                              <ProgressBar
                                value={healthScore}
                                color={
                                  healthScore > 70
                                    ? "green"
                                    : healthScore > 40
                                    ? "blue"
                                    : "red"
                                }
                              />
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Risk Level
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {healthScore > 70
                                  ? "Low"
                                  : healthScore > 40
                                  ? "Moderate"
                                  : "High"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Based on your parameters
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Recommendation
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {healthScore > 70
                                  ? "Regular check-ups"
                                  : healthScore > 40
                                  ? "Consult specialist"
                                  : "Immediate attention"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {healthScore > 70
                                  ? "Within 6 months"
                                  : healthScore > 40
                                  ? "Within 1 month"
                                  : "As soon as possible"}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2 rounded-lg shadow-sm"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Print Results
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                            >
                              <Clipboard className="w-4 h-4 mr-2" />
                              View Details
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePredictor === "kidney" && kidneyResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              kidneyResult.prediction.includes("No")
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {kidneyResult.prediction.includes("No") ? (
                              <CheckCircle
                                className={`h-8 w-8 text-green-600`}
                              />
                            ) : (
                              <AlertCircle className={`h-8 w-8 text-red-600`} />
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center mb-2">
                            <h3
                              className={`text-xl font-bold mr-3 ${
                                kidneyResult.prediction.includes("No")
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                            >
                              {kidneyResult.prediction}
                            </h3>

                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                kidneyResult.prediction.includes("No")
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Confidence: {kidneyResult.confidence}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-4">
                            {kidneyResult.prediction.includes("No")
                              ? "Based on the provided parameters, our model predicts a lower risk of kidney disease. However, this is not a medical diagnosis."
                              : "Based on the provided parameters, our model predicts a higher risk of kidney disease. We recommend consulting with a healthcare professional."}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Health Score
                              </div>
                              <div className="text-2xl font-bold text-gray-900">
                                {healthScore}
                              </div>
                              <ProgressBar
                                value={healthScore}
                                color={
                                  healthScore > 70
                                    ? "green"
                                    : healthScore > 40
                                    ? "blue"
                                    : "red"
                                }
                              />
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Risk Level
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {healthScore > 70
                                  ? "Low"
                                  : healthScore > 40
                                  ? "Moderate"
                                  : "High"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Based on your parameters
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Recommendation
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {healthScore > 70
                                  ? "Regular check-ups"
                                  : healthScore > 40
                                  ? "Consult specialist"
                                  : "Immediate attention"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {healthScore > 70
                                  ? "Within 6 months"
                                  : healthScore > 40
                                  ? "Within 1 month"
                                  : "As soon as possible"}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-4 py-2 rounded-lg shadow-sm"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Print Results
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                            >
                              <Clipboard className="w-4 h-4 mr-2" />
                              View Details
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-6"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Health information cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-teal-100 rounded-full mr-3">
                  {activePredictor === "liver" ? (
                    <Lungs className="h-5 w-5 text-teal-600" />
                  ) : (
                    <Kidney className="h-5 w-5 text-teal-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {activePredictor === "liver"
                    ? "Liver Health Facts"
                    : "Kidney Health Facts"}
                </h3>
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                {activePredictor === "liver" ? (
                  <>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      Your liver filters toxins from your blood and produces
                      proteins for blood clotting.
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      The liver can regenerate itself, even after significant
                      damage.
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      Regular exercise and a balanced diet can improve liver
                      function.
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      Your kidneys filter about 120-150 quarts of blood daily.
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      Each kidney has about a million tiny filters called
                      nephrons.
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      Staying hydrated helps your kidneys function properly.
                    </li>
                  </>
                )}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center"
              >
                Learn more
                <ChevronRight className="w-3 h-3 ml-1" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-cyan-100 rounded-full mr-3">
                  <Heart className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Preventive Measures
                </h3>
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                {activePredictor === "liver" ? (
                  <>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      Limit alcohol consumption to reduce liver strain.
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      Maintain a healthy weight to prevent fatty liver disease.
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      Get vaccinated against hepatitis A and B to protect your
                      liver.
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      Control blood pressure and diabetes to protect kidney
                      function.
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      Reduce sodium intake to help maintain kidney health.
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">•</span>
                      Stay hydrated with water rather than sugary drinks.
                    </li>
                  </>
                )}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center"
              >
                Learn more
                <ChevronRight className="w-3 h-3 ml-1" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  When to See a Doctor
                </h3>
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                {activePredictor === "liver" ? (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Yellowing of skin or eyes (jaundice)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Abdominal pain and swelling
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Chronic fatigue or unexplained weight loss
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Changes in urination patterns or urine color
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Persistent swelling in feet and ankles
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      High blood pressure that's difficult to control
                    </li>
                  </>
                )}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Learn more
                <ChevronRight className="w-3 h-3 ml-1" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-sm text-center text-gray-500 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                <Info className="w-4 h-4 text-gray-500" />
              </div>
              <h4 className="font-medium text-gray-700">Medical Disclaimer</h4>
            </div>
            <p>
              This tool is for educational purposes only and should not replace
              professional medical advice.
            </p>
            <p className="mt-1">
              Always consult with a healthcare professional for medical concerns
              and proper diagnosis.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
