"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Location from "@/components/Location";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Mail,
  CheckCircle,
  Stethoscope,
  Activity,
  Brain,
  Pill,
  Menu,
  X,
  Users,
  User,
  ArrowRightFromLine,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function HealthcareLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [locate, setLocate] = useState([22.4657, 88.3702]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  return (
    <>
      <script id="kal" type="text/javascript">
        {`(function(w, d, s, o) {
    w.ChatbotWidget = o;
    var js = d.createElement(s);
    js.src = 'https://chatbuild.vercel.app/widget.min.js';
    js.async = 1;
    js.dataset.botId = 'z3gvNx1NGRinJSBJDGYW';
    d.getElementsByTagName('head')[0].appendChild(js);
  })(window, document, 'script', {});`}
      </script>
      <div className="flex min-h-screen flex-col bg-[#f8fafc]">
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10">
                {" "}
                <DotLottieReact
                  src="https://lottie.host/97565632-549b-44ea-8f86-6084fc5d1840/kiRoMpiDxH.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <motion.span
                className="text-xl font-bold bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #0f172a, #0284c7, #0ea5e9, #0284c7, #0f172a)",
                  backgroundSize: "300% 100%",
                  color: "transparent",
                }}
                animate={{
                  backgroundPosition: ["0%", "100%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Health Track
              </motion.span>
            </div>
            <nav className="hidden md:flex gap-8">
              <Link
                href="#"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Home
              </Link>
              <Link
                href="#services"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Services
              </Link>
              <Link
                href="#doctors"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Doctors
              </Link>
              <Link
                href="#locations"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Locations
              </Link>
              <Link
                href="#contact"
                className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-10 rounded-full overflow-hidden border border-gray-300 focus:outline-none"
                  >
                    <img
                      src={user?.photoURL || ""}
                      alt={user?.displayName || "User"}
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <hr className="border-gray-200" />

                      <a
                        href="/profile"
                        className="px-4 py-2 text-sm hover:bg-gray-100 flex flex-nowrap items-center gap-2"
                      >
                        <Settings size={20} />
                        Profile Settings
                      </a>

                      <button
                        onClick={handleSignOut}
                        className="flex w-full px-4 py-2 items-center gap-2 text-sm text-red-600 hover:bg-gray-100 font-bold flex-nowrap"
                      >
                        <ArrowRightFromLine size={20} />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="text-xl bg-[#0284c7] hover:bg-[#0369a1]"
                  size="sm"
                >
                  <Link href="/auth">
                    <User color="white" className="transform scale-150" />
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-[40px] w-[40px] -mr-[20px]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-[30px] w-[30px]" />
                ) : (
                  <Menu className="h-[30px] w-[30px]" />
                )}
              </Button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b">
              <nav className="flex flex-col p-4 space-y-3">
                <Link
                  href="#"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#services"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#doctors"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Doctors
                </Link>
                <Link
                  href="#locations"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Locations
                </Link>
                <Link
                  href="#contact"
                  className="text-x1 font-bold text-[#334155] hover:text-[#0284c7] transition-colors p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Button
                  size="sm"
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white mt-2"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  1-800-HEALTH
                </Button>
              </nav>
            </div>
          )}
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-20 bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe]">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                    Trusted Healthcare Provider
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-5xl xl:text-6xl/none">
                      Your Health Is Our
                      <span className="text-[#0284c7]">Top Priority</span>
                    </h1>
                    <p className="max-w-[600px] text-[#64748b] md:text-xl">
                      Providing compassionate care and cutting-edge medical
                      services to our community for over 25 years.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link
                      href="/PresAI"
                      className="bg-[#0284c7] hover:bg-[#0369a1] px-4 py-2 rounded-sm text-white inline-flex items-center gap-2 shadow-sm font-bold"
                    >
                      X
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/PresAI"
                      className="bg-[#0284c7] hover:bg-[#0369a1] px-4 py-2 rounded-sm text-white inline-flex items-center gap-2 shadow-sm font-bold"
                    >
                      Analyze Your Prescription
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
                    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                      <Clock className="h-4 w-4 text-[#0284c7]" />
                      <span className="text-[#334155]">
                        24/7 Emergency Care
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                      <CheckCircle className="h-4 w-4 text-[#0284c7]" />
                      <span className="text-[#334155]">Insurance Accepted</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0284c7]/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0284c7]/10 rounded-full blur-xl"></div>
                  <DotLottieReact
                    src="https://lottie.host/dbb9634e-fda1-4e7f-8118-de18aa7f3833/bI50uEmxYv.lottie"
                    autoplay
                    className="mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:aspect-square"
                    style={{ width: 550, height: 550 }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* <section
            id="services"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Our Services
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Comprehensive Healthcare Solutions
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    We offer a wide range of medical services to meet the needs
                    of our diverse patient population.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <HeartPulse className="h-10 w-10 text-[#0284c7]" />,
                    title: "Primary Care",
                    description:
                      "Comprehensive healthcare services for patients of all ages, focusing on your overall health and wellness.",
                    link: "/primary",
                  },
                  {
                    icon: <Users className="h-10 w-10 text-[#0284c7]" />,
                    title: "Family Medicine",
                    description:
                      "Care for the entire family, from newborns to seniors, building lasting relationships with our patients.",
                    link: "/family",
                  },
                  {
                    icon: <Calendar className="h-10 w-10 text-[#0284c7]" />,
                    title: "Preventive Care",
                    description:
                      "Regular check-ups and screenings to maintain your health and catch potential issues early.",
                    link: "/preventive-care",
                  },
                  {
                    icon: <Brain className="h-10 w-10 text-[#0284c7]" />,
                    title: "Neurology",
                    description:
                      "Specialized care for conditions affecting the brain, spine, and nervous system.",
                    link: "/neurology",
                  },
                  {
                    icon: <Activity className="h-10 w-10 text-[#0284c7]" />,
                    title: "Cardiology",
                    description:
                      "Expert care for heart conditions with the latest diagnostic and treatment technologies.",
                    link: "/cardiology",
                  },
                  {
                    icon: <Pill className="h-10 w-10 text-[#0284c7]" />,
                    title: "Pharmacy",
                    description:
                      "On-site pharmacy services for convenient access to your prescribed medications.",
                    link: "/pharmacy",
                  },
                ].map((service, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden transition-all hover:shadow-md border-none bg-white"
                  >
                    <CardHeader className="p-6">
                      <div className="w-12 h-12 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4 group-hover:bg-[#0284c7]/20 transition-colors">
                        {service.icon}
                      </div>
                      <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <CardDescription className="text-base text-[#64748b]">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0">
                      <Link
                        href={service.link}
                        className="p-0 h-auto font-semibold text-[#0284c7] group-hover:text-[#0369a1] transition-colors flex items-center"
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section> */}

          <section
            id="ai-assistant"
            className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe]"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  AI-Powered Healthcare
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Meet Your Personal Health Assistant
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    Our AI-powered health assistant provides personalized care,
                    monitoring, and support for your everyday health needs.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-6 group-hover:bg-[#0284c7]/20 transition-colors">
                      <div className="w-24 h-24">
                        {" "}
                        <DotLottieReact
                          src="https://lottie.host/6cef0fb7-84b7-4d02-861a-c00b3d631392/UNPjZm7wCt.lottie"
                          loop
                          autoplay
                          style={{
                            width: "120%",
                            height: "120%",
                            position: "relative",
                            left: "-10%",
                            top: "-10%",
                          }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#0284c7] transition-colors text-center">
                      Daily Health Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      Monitor vital signs, activity levels, sleep patterns, and
                      nutrition with our AI-powered tracking system. Receive
                      personalized insights and recommendations.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-6 mb-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-[#64748b]">
                              Heart Rate
                            </span>
                            <span className="text-base font-medium text-[#0f172a]">
                              72 bpm
                            </span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
                            <div
                              className="bg-[#0284c7] h-2.5 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-[#64748b]">
                              Sleep Quality
                            </span>
                            <span className="text-base font-medium text-[#0f172a]">
                              Good
                            </span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
                            <div
                              className="bg-[#0284c7] h-2.5 rounded-full"
                              style={{ width: "80%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dailyhealth"
                      className="w-full group border-2 border-[#0284c7] text-[#0284c7] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition text-lg"
                    >
                      Try AI Diagnostics
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
                {/* AI-Powered Diagnostics */}
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-6 group-hover:bg-[#0284c7]/20 transition-colors">
                      <div className="w-24 h-24">
                        {" "}
                        <DotLottieReact
                          src="https://lottie.host/7107f310-4316-49ee-b018-f9dfcdff8765/UCUCfaeRfM.lottie"
                          loop
                          autoplay
                          style={{
                            width: "150%",
                            height: "150%",
                            position: "relative",
                            left: "-25%",
                            top: "-25%",
                          }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#0284c7] transition-colors text-center">
                      AI-Powered Diagnostics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      Early detection of skin diseases, diabetes risk factors,
                      and heart conditions through our advanced AI diagnostic
                      tools. Upload images or input symptoms for analysis.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-center text-center">
                          <span className="text-base font-bold text-[red]">
                            Skin Analysis
                          </span>
                          <span className="text-sm font-bold text-[#43c543]">
                            98% accuracy rate
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-base font-semibold text-[red]">
                            Heart Risk
                          </span>
                          <span className="text-sm font-semibold text-[#43c543]">
                            95% accuracy rate
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-base font-bold text-[red]">
                            Diabetes
                          </span>
                          <span className="text-sm font-semibold text-[#43c543]">
                            93% accuracy rate
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/diagnostics"
                      className="w-full group border-2 border-[#0284c7] text-[#0284c7] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition text-lg"
                    >
                      Try AI Diagnostics
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-[#34D399]/10 flex items-center justify-center mb-6 group-hover:bg-[#34D399]/20 transition-colors">
                      <div className="w-24 h-24">
                        <DotLottieReact
                          src="https://lottie.host/3e949fa4-d66c-4bb7-94a9-12307dd3d2d5/uh0oOIpMSV.lottie"
                          loop
                          autoplay
                          style={{
                            width: "120%",
                            height: "120%",
                            position: "relative",
                            left: "-10%",
                            top: "-10%",
                          }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#1D4ED8] group-hover:text-[#34D399] transition-colors text-center">
                      Liver & Kidney Disease Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      Predict liver and kidney health risks using AI. Analyse
                      enzyme levels, creatinine, blood urea, and lifestyle
                      factors to get detailed health insights.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-6 mb-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-[#64748b]">
                              Liver Enzyme Levels
                            </span>
                            <span className="text-base font-medium text-[#0f172a]">
                              Slightly Elevated
                            </span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
                            <div
                              className="bg-[#F59E0B] h-2.5 rounded-full"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-[#64748b]">
                              Creatinine Levels
                            </span>
                            <span className="text-base font-medium text-[#0f172a]">
                              Normal
                            </span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
                            <div
                              className="bg-[#10B981] h-2.5 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base text-[#64748b]">
                              Blood Urea Nitrogen
                            </span>
                            <span className="text-base font-medium text-[#0f172a]">
                              Moderate Risk
                            </span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
                            <div
                              className="bg-[#F97316] h-2.5 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/liver"
                      className="w-full group border-2 border-[#34D399] text-[#34D399] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#2F9F74] hover:text-white transition text-lg"
                    >
                      Try Liver & Kidney Prediction
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
                {/* Mental Health Support */}
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-6 group-hover:bg-[#0284c7]/20 transition-colors">
                      <div className="w-20 h-20">
                        <DotLottieReact
                          src="https://lottie.host/8bd4b3fb-0c50-4bc7-ae4e-b3fa7c49140f/6Z63mollKW.lottie"
                          loop
                          autoplay
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#0284c7] transition-colors text-center">
                      Mental Health Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      24/7 AI chat support for mental health concerns, stress
                      management, and emotional well-being. Get personalized
                      coping strategies and resources.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-5 mb-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center shrink-0 text-white text-xs">
                          AI
                        </div>
                        <div className="bg-[#e0f2fe] rounded-lg p-2 text-sm text-[#0f172a]">
                          How are you feeling today? I'm here to listen and
                          help.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-[#f1f5f9] rounded-lg p-2 text-sm text-[#0f172a]">
                          I've been feeling anxious about work lately.
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[black] flex items-center justify-center shrink-0 text-[white] text-xs">
                          You
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/AI"
                      className="w-full group border-2 border-[#0284c7] text-[#0284c7] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition text-lg"
                    >
                      Chat with AI Support
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-[#6b1e9b]/10 flex items-center justify-center mb-6 group-hover:bg-[#6b1e9b]/20 transition-colors">
                      <div className="w-24 h-24">
                        <DotLottieReact
                          src="https://lottie.host/ce53b9e0-ef45-4364-bddd-5ae2ccd20d63/2oP8xUEhNa.lottie"
                          loop
                          autoplay
                          style={{
                            width: "130%",
                            height: "130%",
                            position: "relative",
                            left: "-15%",
                            top: "-15%",
                            transform: "scale(1.1)",
                          }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#5a1a72] group-hover:text-[#6b1e9b] transition-colors text-center">
                      Real-Time Talking Bot Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#4b1963] text-center">
                      View all bot activity and settings. Monitor bot
                      performance, user interactions, and configure bot
                      responses in real-time.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-[#0f172a]">
                          Bot Features
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            Real-time voice processing
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            AI-driven responses
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            Multi-language support
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            Contextual understanding
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/TALKING"
                      className="w-full group border-2 border-[#6b1e9b] text-[#6b1e9b] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#6b1e9b] hover:text-white transition text-lg"
                    >
                      Talk With Bot
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                {/* Health Dashboard */}
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-6 group-hover:bg-[#0284c7]/20 transition-colors">
                      <div className="w-24 h-24">
                        {" "}
                        <DotLottieReact
                          src="https://lottie.host/95a7ce8a-45e2-4d37-9ded-0f279695a94d/rzDWWpsZMM.lottie"
                          loop
                          autoplay
                          style={{
                            width: "130%",
                            height: "130%",
                            position: "relative",
                            left: "-15%",
                            top: "-15%",
                            transform: "scale(1.1)",
                          }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#0284c7] transition-colors text-center">
                      Personalized Health Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      View all your health data in one place with personalized
                      insights, trends, and recommendations. Track progress and
                      set health goals.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-6 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] hover:border-[#0284c7]/50 transition-colors">
                          <div className="text-sm text-[#64748b]">
                            Health Score
                          </div>
                          <div className="text-xl font-medium text-[#0f172a]">
                            85/100
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] hover:border-[#0284c7]/50 transition-colors">
                          <div className="text-sm text-[#64748b]">
                            Risk Level
                          </div>
                          <div className="text-xl font-medium text-[#22c55e]">
                            Low
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] hover:border-[#0284c7]/50 transition-colors">
                          <div className="text-sm text-[#64748b]">
                            Appointments
                          </div>
                          <div className="text-xl font-medium text-[#0f172a]">
                            2
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] hover:border-[#0284c7]/50 transition-colors">
                          <div className="text-sm text-[#64748b]">
                            Medications
                          </div>
                          <div className="text-xl font-medium text-[#0f172a]">
                            3
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/healthdash"
                      className="w-full group border-2 border-[#0284c7] text-[#0284c7] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition text-lg"
                    >
                      View Your Dashboard
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
                {/* Emergency Assistance */}
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#ef4444]/10 flex items-center justify-center mb-6 group-hover:bg-[#ef4444]/20 transition-colors">
                      <div className="w-20 h-20">
                        <DotLottieReact
                          src="https://lottie.host/73bf3a96-2724-40be-96fc-3a79200bc6af/Jr5WIb1X4b.lottie"
                          loop
                          autoplay
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#ef4444] transition-colors text-center">
                      Emergency Assistance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      Quick access to emergency services, real-time guidance for
                      first aid, and community support during emergencies.
                      One-tap emergency contact.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-[#0f172a]">
                          Emergency Features
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            One-tap emergency call
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            GPS location sharing
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                          <span className="text-base text-[#64748b]">
                            First aid instructions
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/emergency"
                      className="w-full group border-2 border-[#ef4444] text-[#ef4444] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#ef4444] hover:text-white transition text-lg"
                    >
                      Emergency Services
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>

                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-6 group-hover:bg-[#0284c7]/20 transition-colors">
                      <div className="w-20 h-20">
                        <DotLottieReact
                          src="https://lottie.host/324115cc-3e6a-4364-a826-207873327a20/FRG5sdnNdg.lottie"
                          loop
                          autoplay
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#0284c7] transition-colors text-center">
                      Tailored Health Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      Receive personalized health recommendations based on your
                      profile, health history, and current conditions. Get
                      nutrition, exercise, and lifestyle advice.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-4 mb-6">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-md border border-[#e2e8f0] hover:border-[#0284c7]/50 transition-colors">
                          <div className="text-xs text-[#64748b]">
                            Nutrition
                          </div>
                          <div className="text-sm text-[#0f172a]">
                            Increase omega-3 intake for heart health
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-[#e2e8f0] hover:border-[#0284c7]/50 transition-colors">
                          <div className="text-xs text-[#64748b]">Exercise</div>
                          <div className="text-sm text-[#0f172a]">
                            30 min moderate cardio, 3x weekly
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/healthrecom"
                      className="w-full group border-2 border-[#0284c7] text-[#0284c7] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition text-lg"
                    >
                      Get Recommendations
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
                <Card className="group overflow-hidden transition-all hover:shadow-lg border-none bg-white w-full max-w-lg mx-auto scale-100 hover:scale-[1.02] duration-300">
                  <CardHeader className="p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6 group-hover:bg-[#10b981]/20 transition-colors">
                      <div className="w-20 h-20">
                        <DotLottieReact
                          src="https://lottie.host/f26e91c4-f120-420b-848b-34a426ec53a5/KSRMPjKW3m.lottie" // Use a relevant animation for prescription or health-related analysis
                          loop
                          autoplay
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-[#0f172a] group-hover:text-[#10b981] transition-colors text-center">
                      Prescription Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-lg text-[#64748b] text-center">
                      Upload your prescription and get detailed analysis,
                      medication interactions, side effects, and personalized
                      recommendations.
                    </CardDescription>
                  </CardContent>
                  <div className="px-8 pb-8">
                    <div className="bg-[#f8fafc] rounded-lg p-5 mb-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 text-white text-xs">
                          AI
                        </div>
                        <div className="bg-[#e0fdf4] rounded-lg p-2 text-sm text-[#0f172a]">
                          Please upload your prescription and I’ll analyze it
                          for any potential issues.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-[#f1f5f9] rounded-lg p-2 text-sm text-[#0f172a]">
                          I’m on multiple medications for hypertension. Can you
                          check for possible interactions?
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[black] flex items-center justify-center shrink-0 text-[white] text-xs">
                          You
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/PresAI"
                      className="w-full group border-2 border-[#10b981] text-[#10b981] px-6 py-3 rounded-lg flex items-center justify-center hover:bg-[#10b981] hover:text-white transition text-lg"
                    >
                      Start Prescription Analysis
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              </div>
              <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden ">
                <div className="md:flex ">
                  <div className="md:shrink-0 bg-[#0284c7]/20 border-r-2 border-black">
                    <DotLottieReact
                      src="https://lottie.host/2ca4d15b-c15a-499b-a311-571163beee91/ny2dTgfWMt.lottie"
                      loop
                      autoplay
                      className="h-48 w-full object-cover md:h-full md:w-48"
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-[#0284c7] font-semibold">
                      Entertainment Tailored to Your Mood
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-[#0f172a]">
                      Smart Movie & Music Recommendations Based on Your Mood
                    </h3>
                    <p className="mt-2 text-[#64748b]">
                      Get the best movie and music recommendations based on how
                      you feel. Whether you're happy, sad, or need motivation,
                      our system curates the perfect entertainment experience
                      for you.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Mood-Based Recommendations
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Curated Selections
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Personalized Experience
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/msrecom"
                        className="inline-block px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-md transition-colors"
                      >
                        Get Your Recommendations
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:shrink-0 border-r-2 border-black bg-[#0284c7]/20">
                    <DotLottieReact
                      src="https://lottie.host/1f71738d-8adc-4255-acfe-f626d62343ae/8xcwvNMhRi.lottie"
                      loop
                      autoplay
                      className="h-48 w-full object-cover md:h-full md:w-48"
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-[#0284c7] font-semibold">
                      AI-Powered Healthcare
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-[#0f172a]">
                      Experience the Future of Healthcare Today
                    </h3>
                    <p className="mt-2 text-[#64748b]">
                      Our AI health assistant combines cutting-edge technology
                      with medical expertise to provide you with personalized
                      healthcare support. From daily health tracking to early
                      disease detection, mental health support, and emergency
                      assistance, we're here for you 24/7.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        HIPAA Compliant
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Data Encryption
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Medical-Grade Accuracy
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/groqAI"
                        className="inline-block px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-md transition-colors"
                      >
                        Get Started with AI Health Assistant
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden ">
                <div className="md:flex ">
                  <div className="md:shrink-0 bg-[#0284c7]/20 border-r-2 border-black">
                    <DotLottieReact
                      src="https://lottie.host/7bee7353-3115-4ed6-9688-ab682b9819fa/g4MlXQHh7X.lottie"
                      loop
                      autoplay
                      className="h-48 w-full object-cover md:h-full md:w-48"
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-[#0284c7] font-semibold">
                      Smart Meal Planning
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-[#0f172a]">
                      Effortless Meal Planning & Nutrition Tracking
                    </h3>
                    <p className="mt-2 text-[#64748b]">
                      Simplify your meal planning with an intuitive interface
                      that helps you organize meals for each day of the week.
                      Search for recipes, explore detailed nutritional
                      information, and track daily intake effortlessly. Plan
                      meals that fit your lifestyle while staying informed about
                      calories, protein, carbs, and fats.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Recipe Search
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Weekly Meal Planner
                      </Badge>
                      <Badge className="bg-[#0284c7]/10 text-[#0284c7] hover:bg-[#0284c7]/20 transition-colors">
                        Nutrition Insights
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/meal"
                        className="inline-block px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-md transition-colors"
                      >
                        Start Planning Your Meals
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="doctors"
            className="w-full py-12 md:py-24 lg:py-32 bg-white"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Our Team
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Meet Our Doctors
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    Our team of experienced healthcare professionals is
                    dedicated to providing you with the highest quality care.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "DR. Nancy Maguire",
                    specialty: "Family Medicine",
                    image: "/doc2.jpg",
                    education: "Johns Hopkins University",
                  },
                  {
                    name: "Dr. Debanjan Das",
                    specialty: "Cardiology",
                    image: "/doc3.jpg",
                    education: "Johns Hopkins University",
                  },
                  {
                    name: "Dr. Alex Smith",
                    specialty: "Pediatrics",
                    image: "/doc1.jpg",
                    education: "Stanford University",
                  },
                ].map((doctor, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden transition-all hover:shadow-md border-none bg-[#f8fafc]"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        width={300}
                        height={400}
                        className="w-full object-cover h-64 transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                        {doctor.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-[#64748b]">
                        {doctor.specialty}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-normal text-[#64748b] border-[#cbd5e1]"
                        >
                          {doctor.education}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  className="group border-[#0284c7] text-[#0284c7]"
                >
                  View All Doctors
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </section>

          <section
            id="locations"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Our Locations
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Find Us Near You
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    With multiple locations across the city, quality healthcare
                    is always close by.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2">
                <div className="space-y-6">
                  {[
                    {
                      name: "Apollo Hospitals, Chennai",
                      address:
                        "21, Greams Lane, Off Greams Road, Chennai – 600006, India",
                      phone: "+91 44 4040 1066",
                      hours: "Open 24/7",
                      loc: [13.06354085944341, 80.25160261097177],
                    },
                    {
                      name: "Max Super Speciality Hospital, Saket",
                      address:
                        "12, Press Enclave Road, Saket Institutional Area, Saket, New Delhi – 110017, India",
                      phone: "011-26515050",
                      hours: "Open 24/7",
                      loc: [28.527982817911077, 77.2149330093889],
                    },
                    {
                      name: "Peerless Hospital, Kolkata",
                      address:
                        "360 Panchasayar, Kolkata – 700094, West Bengal, India",
                      phone: "+91 33 4011 1222",
                      hours: "Open 24/7",
                      loc: [22.48072670825034, 88.39414734187994],
                    },
                  ].map((location, index) => (
                    <Card
                      key={index}
                      className="group hover:shadow-md transition-all border-none bg-white"
                    >
                      <CardHeader>
                        <CardTitle className="text-[#0f172a] group-hover:text-[#0284c7] transition-colors">
                          {location.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#64748b]" />
                          <span className="text-sm text-[#64748b]">
                            {location.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#64748b]" />
                          <span className="text-sm text-[#64748b]">
                            {location.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#64748b]" />
                          <span className="text-sm text-[#64748b]">
                            {location.hours}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => setLocate(location.loc)}
                          variant="outline"
                          size="sm"
                          className="w-full group border-[#0284c7] text-[#0284c7]"
                        >
                          Get Directions
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold mb-6">Our Location</h1>
                  <Location locate={locate} />
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  FAQ
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] sm:text-4xl">
                    Frequently Asked Questions
                  </h2>
                  <p className="max-w-[700px] text-[#64748b] md:text-lg">
                    Find answers to common questions about our services,
                    insurance, and appointments.
                  </p>
                </div>
              </div>
              <div className="mx-auto max-w-3xl mt-12">
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "What insurance plans do you accept?",
                      answer:
                        "We accept most major insurance plans, including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact our office to verify your specific insurance coverage.",
                    },
                    {
                      question: "How do I schedule an appointment?",
                      answer:
                        "You can schedule an appointment by calling our office, using our online booking system on this website, or through our patient portal. We offer same-day appointments for urgent needs.",
                    },
                    {
                      question: "What should I bring to my first appointment?",
                      answer:
                        "Please bring your insurance card, photo ID, list of current medications, medical records if available, and any referral forms if required by your insurance. Arriving 15 minutes early to complete paperwork is recommended.",
                    },
                    {
                      question: "Do you offer telehealth services?",
                      answer:
                        "Yes, we offer telehealth services for many types of appointments. These virtual visits allow you to consult with your healthcare provider from the comfort of your home for follow-ups, medication management, and certain conditions.",
                    },
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-[#e2e8f0]"
                    >
                      <AccordionTrigger className="text-left font-medium text-[#0f172a] hover:text-[#0284c7] transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#64748b]">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="w-full py-12 md:py-24 lg:py-32 bg-[#f0f9ff]"
          >
            <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-[#0284c7]/20 bg-[#0284c7]/10 px-3 py-1 text-sm text-[#0284c7]">
                  Contact Us
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-[#0f172a] md:text-4xl">
                    Ready to prioritize your health?
                  </h2>
                  <p className="max-w-[600px] text-[#64748b] md:text-lg">
                    Schedule an appointment today and take the first step
                    towards better health.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7]/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-[#0284c7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">Phone</h3>
                      <p className="text-[#64748b]">+91 33 4011 1222</p>
                      <p className="text-sm text-[#64748b]">
                        Available 24/7 for emergencies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-[#0284c7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">Email</h3>
                      <p className="text-[#64748b]">info@medicare.com</p>
                      <p className="text-sm text-[#64748b]">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0284c7]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#0284c7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f172a]">
                        Main Location
                      </h3>
                      <p className="text-[#64748b]">
                        360 Panchasayar, Kolkata – 700094, West Bengal, India
                      </p>
                      <p className="text-sm text-[#64748b]">Open 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="shadow-md border-none bg-white">
                <CardHeader>
                  <CardTitle className="text-[#0f172a]">
                    Book an Appointment
                  </CardTitle>
                  <CardDescription className="text-[#64748b]">
                    Fill out the form below and we'll contact you to confirm
                    your appointment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium text-[#0f172a]"
                      >
                        First Name
                      </label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        className="border-[#e2e8f0]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium text-[#0f172a]"
                      >
                        Last Name
                      </label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        className="border-[#e2e8f0]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="border-[#e2e8f0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="border-[#e2e8f0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="service"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Service
                    </label>
                    <Select>
                      <SelectTrigger className="border-[#e2e8f0]">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary-care">
                          Primary Care
                        </SelectItem>
                        <SelectItem value="family-medicine">
                          Family Medicine
                        </SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-[#0f172a]"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your symptoms or reason for visit..."
                      className="border-[#e2e8f0]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white">
                    Submit Request
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </main>
        <footer className="w-full border-t bg-white">
          <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-start md:justify-between md:py-12">
            <div className="flex flex-col gap-2 max-w-xs">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-[#0284c7]" />
                <span className="text-xl font-bold text-[#0f172a]">
                  Health Track
                </span>
              </div>
              <p className="text-sm text-[#64748b]">
                Providing quality healthcare services since 1998. Our mission is
                to deliver compassionate care and improve the health of our
                community.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-[#0f172a]">Services</h3>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Primary Care
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Family Medicine
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Pediatrics
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Cardiology
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-[#0f172a]">Company</h3>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Our Doctors
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Contact
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-[#0f172a]">Legal</h3>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Patient Rights
                </Link>
              </div>
            </nav>
          </div>
          <div className="border-t border-[#e2e8f0] py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-[#64748b] md:text-left">
                © {new Date().getFullYear()} MediCare. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-[#64748b] hover:text-[#0284c7] transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
