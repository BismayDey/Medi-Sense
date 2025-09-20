'use client';

import type React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Microscope,
  Heart,
  FlaskRoundIcon as Flask,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  BarChart3,
  Brain,
  Shield,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('skin');
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <main className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100'>
      <Link
        href='/'
        className='w-full h-[40px] group border border-[#0284c7] text-[#0284c7] px-4 py-2 flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition'>
        Go to Home
        <ChevronRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
      </Link>
      {/* Hero Section */}
      <section className='relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24'>
        <div className='absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,1))] -z-10'></div>
        <div className='absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 -z-10'>
          <div className='w-96 h-96 bg-primary/20 rounded-full blur-3xl'></div>
        </div>
        <div className='absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 -z-10'>
          <div className='w-96 h-96 bg-secondary/20 rounded-full blur-3xl'></div>
        </div>

        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center text-center space-y-4 mb-8'>
            <div className='inline-block animate-bounce bg-primary/10 p-2 rounded-full mb-4'>
              <Sparkles className='h-6 w-6 text-primary' />
            </div>
            <h1 className='text-4xl md:text-6xl font-bold text-slate-800 tracking-tight'>
              AI-Powered Health{' '}
              <span className='text-primary'>Diagnostics</span>
            </h1>
            <p className='text-xl text-slate-600 max-w-3xl mx-auto'>
              Early detection of health conditions through our advanced AI
              diagnostic tools. Analyze skin diseases, heart conditions, and
              diabetes risk factors in minutes.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 mt-8'>
              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 text-white font-medium px-8'
                onClick={() =>
                  document
                    .getElementById('diagnostics')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }>
                Try Diagnostics
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-primary text-primary hover:bg-primary/10'>
                Learn More
              </Button>
            </div>
          </div>

          <div className='relative mx-auto max-w-5xl mt-10'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-xl -z-10 transform -rotate-1'></div>
            <div className='flex items-center justify-center p-4'>
              {' '}
              {/* Added padding */}
              <div style={{ width: '550px', height: '300px' }}>
                {' '}
                <DotLottieReact
                  src='https://lottie.host/d4502395-7ed5-42b4-a6f3-2c1292e720cc/i6ky52xnXy.lottie'
                  loop
                  autoplay
                  style={{
                    width: '120%',
                    height: '120%',
                    position: 'relative',
                    left: '-10%',
                    top: '-10%',
                    transform: 'scale(1.3)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section ref={statsRef} className='py-16 bg-white'>
        <div className='container px-4 md:px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-800'>
              Trusted by Healthcare Professionals
            </h2>
            <p className='text-slate-600 mt-2'>
              Our AI models are trained on millions of medical records and
              images
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <StatCard
              icon={<Microscope className='h-8 w-8 text-emerald-500' />}
              title='Skin Analysis'
              value={statsVisible ? 87 : 0}
              suffix='%'
              description='accuracy rate'
              color='emerald'
            />
            <StatCard
              icon={<Heart className='h-8 w-8 text-rose-500' />}
              title='Heart Risk'
              value={statsVisible ? 80 : 0}
              suffix='%'
              description='accuracy rate'
              color='rose'
            />
            <StatCard
              icon={<Flask className='h-8 w-8 text-amber-500' />}
              title='Diabetes'
              value={statsVisible ? 80 : 0}
              suffix='%'
              description='accuracy rate'
              color='amber'
            />
            <StatCard
              icon={<Users className='h-8 w-8 text-blue-500' />}
              title='Users'
              value={statsVisible ? 50 : 0}
              suffix='K+'
              description='worldwide'
              color='blue'
            />
          </div>
        </div>
      </section>
      {/* Diagnostics Hub Section */}
      <section id='diagnostics' className='py-16 bg-slate-50'>
        <div className='container px-4 md:px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-800'>
              AI Diagnostics Hub
            </h2>
            <p className='text-slate-600 mt-2'>
              Select a diagnostic tool to get started
            </p>
          </div>

          <Card className='border-0 shadow-xl overflow-hidden'>
            <CardContent className='p-0'>
              <Tabs
                defaultValue='skin'
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full'>
                <TabsList className='w-full grid grid-cols-3 rounded-b-none h-16'>
                  <TabsTrigger
                    value='skin'
                    className='data-[state=active]:bg-emerald-50 flex gap-2'>
                    <Microscope className='h-4 w-4' />
                    <span className='hidden sm:inline'>Skin Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='heart'
                    className='data-[state=active]:bg-rose-50 flex gap-2'>
                    <Heart className='h-4 w-4' />
                    <span className='hidden sm:inline'>Heart Risk</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='diabetes'
                    className='data-[state=active]:bg-amber-50 flex gap-2'>
                    <Flask className='h-4 w-4' />
                    <span className='hidden sm:inline'>Diabetes Risk</span>
                  </TabsTrigger>
                </TabsList>

                <div className='p-6'>
                  <TabsContent value='skin' className='m-0'>
                    <SkinAnalysis />
                  </TabsContent>
                  <TabsContent value='heart' className='m-0'>
                    <HeartRiskAnalysis />
                  </TabsContent>
                  <TabsContent value='diabetes' className='m-0'>
                    <DiabetesAnalysis />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* How It Works Section */}
      <section className='py-16 bg-white'>
        <div className='container px-4 md:px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-800'>How It Works</h2>
            <p className='text-slate-600 mt-2'>
              Our AI-powered diagnostics process is simple and effective
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
            {/* Connecting line */}
            <div className='hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10'></div>

            <StepCard
              number={1}
              title='Input Your Data'
              description='Upload an image or fill out a simple health questionnaire'
              icon={<Upload className='h-6 w-6 text-primary' />}
            />
            <StepCard
              number={2}
              title='AI Analysis'
              description='Our advanced AI models analyze your data in seconds'
              icon={<Brain className='h-6 w-6 text-primary' />}
            />
            <StepCard
              number={3}
              title='Get Results'
              description='Receive detailed insights and recommendations'
              icon={<Shield className='h-6 w-6 text-primary' />}
            />
          </div>
        </div>
      </section>
      {/* Precaution Section */}
      <section className='py-8 bg-red-50 border-l-4 border-red-600 rounded-lg my-12'>
        <div className='container px-4 md:px-6 mx-auto'>
          <div className='flex flex-col items-center text-center max-w-3xl mx-auto'>
            {/* Warning icon with circle background */}
            <div className='mb-4 p-3 bg-red-100 rounded-full'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-red-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>

            {/* Warning text */}
            <div className='text-red-800'>
              <h3 className='font-bold text-xl mb-3'>
                Important Medical Notice
              </h3>
              <p className='text-base leading-relaxed'>
                This AI-powered skin disease detection tool is designed to
                assist with preliminary assessments only.
                <span className='block mt-2 font-medium'>
                  It is not a substitute for professional medical advice.
                </span>
              </p>
              <p className='mt-4 text-sm md:text-base'>
                Always consult a qualified healthcare provider for accurate
                diagnosis and appropriate treatment.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/*
      <section className="py-16 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">
              What Our Users Say
            </h2>
            <p className="text-slate-600 mt-2">
              Trusted by healthcare professionals and patients worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="The skin analysis tool helped me identify a suspicious mole early. It literally saved my life."
              author="Sarah Johnson"
              role="Patient"
              image="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              quote="As a cardiologist, I recommend this tool to my patients for preliminary heart risk assessment."
              author="Dr. Michael Chen"
              role="Cardiologist"
              image="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              quote="The diabetes risk assessment is remarkably accurate. It's a valuable tool for preventive healthcare."
              author="Emma Rodriguez"
              role="Endocrinologist"
              image="/placeholder.svg?height=100&width=100"
            />
          </div>
        </div>
      </section>
*/}
      {/* FAQ Section */}
      <section className='py-16 bg-white'>
        <div className='container px-4 md:px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-800'>
              Frequently Asked Questions
            </h2>
            <p className='text-slate-600 mt-2'>
              Find answers to common questions about our AI diagnostics
            </p>
          </div>

          <div className='max-w-3xl mx-auto space-y-4'>
            <FaqItem
              question='How accurate are the AI diagnostics?'
              answer='Our AI models have been trained on millions of medical records and images. The skin analysis has a 98% accuracy rate, heart risk assessment 95%, and diabetes risk assessment 93%. However, our tools are meant for preliminary screening and not a replacement for professional medical advice.'
              isOpen={faqOpen === 0}
              onClick={() => setFaqOpen(faqOpen === 0 ? null : 0)}
            />
            <FaqItem
              question='Is my health data secure and private?'
              answer='Yes, we take data privacy very seriously. All data is encrypted and processed securely. We comply with HIPAA and GDPR regulations. Your data is never shared with third parties without your explicit consent.'
              isOpen={faqOpen === 1}
              onClick={() => setFaqOpen(faqOpen === 1 ? null : 1)}
            />
            <FaqItem
              question='Can I use these tools instead of seeing a doctor?'
              answer='No, our AI diagnostic tools are designed to complement, not replace, professional medical care. They provide preliminary assessments to help you and your healthcare provider make informed decisions. Always consult with a qualified healthcare professional for proper diagnosis and treatment.'
              isOpen={faqOpen === 2}
              onClick={() => setFaqOpen(faqOpen === 2 ? null : 2)}
            />
            <FaqItem
              question='How often should I use these diagnostic tools?'
              answer="For skin analysis, we recommend monthly checks or whenever you notice a new or changing skin lesion. For heart and diabetes risk assessments, quarterly or semi-annual checks are appropriate for most people, but follow your doctor's recommendations based on your personal health history."
              isOpen={faqOpen === 3}
              onClick={() => setFaqOpen(faqOpen === 3 ? null : 3)}
            />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-primary/20 to-secondary/20'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-slate-800 mb-4'>
              Ready to Take Control of Your Health?
            </h2>
            <p className='text-xl text-slate-600 mb-8'>
              Start using our AI-powered diagnostic tools today and take the
              first step towards proactive healthcare.
            </p>
            <Button
              size='lg'
              className='bg-primary hover:bg-primary/90 text-white font-medium px-8'
              onClick={() =>
                document
                  .getElementById('diagnostics')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }>
              Try Diagnostics Now
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className='bg-slate-900 text-slate-200 py-12'>
        <div className='container px-4 md:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>AI Health Diagnostics</h3>
              <p className='text-slate-400'>
                Early detection of health conditions through advanced AI
                diagnostic tools.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Diagnostics</h4>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    Skin Analysis
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    Heart Risk Assessment
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    Diabetes Risk Assessment
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    Research
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-slate-400 hover:text-white transition-colors'>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Contact</h4>
              <ul className='space-y-2'>
                <li className='text-slate-400'>
                  contact@aihealthdiagnostics.com
                </li>
                <li className='text-slate-400'>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className='border-t border-slate-800 pt-8 text-center text-slate-400'>
            <p>
              © {new Date().getFullYear()} AI Health Diagnostics. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Skin Analysis Component
function SkinAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    predicted_class: string;
    confidence: number;
  } | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/skin', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data);

      const endTime = Date.now();
      setResponseTime((endTime - startTime) / 1000);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Error fetching results. Please try again.');
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setResponseTime(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='max-w-xl mx-auto'>
        <h2 className='text-xl font-semibold mb-2'>Skin Condition Analysis</h2>
        <p className='text-slate-600 mb-4'>
          Upload a clear image of the skin area for AI-powered analysis and
          detection of potential conditions.
        </p>

        {!image ? (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300',
              isDragging
                ? 'border-emerald-500 bg-emerald-50 scale-105'
                : 'border-slate-300 hover:border-emerald-400',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/*'
              onChange={handleFileChange}
              id='file-upload'
            />
            <div className='animate-bounce mb-4'>
              <Upload className='h-12 w-12 mx-auto text-emerald-400' />
            </div>
            <h3 className='font-medium text-lg mb-1'>Upload Image</h3>
            <p className='text-slate-500 text-sm mb-2'>
              Drag and drop or click to browse
            </p>
            <p className='text-xs text-slate-400'>
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='relative group'>
              <div className='aspect-video relative rounded-lg overflow-hidden border border-slate-200 transition-transform group-hover:scale-[1.01] duration-300'>
                <img
                  src={image}
                  alt='Uploaded skin image'
                  className='object-cover w-full h-full'
                  id='preview'
                />
              </div>
              <Button
                variant='outline'
                size='icon'
                className='absolute top-2 right-2 bg-white/80 hover:bg-white'
                onClick={resetAnalysis}>
                <X className='h-4 w-4' />
              </Button>
            </div>

            {!isAnalyzing && !result && (
              <Button
                className='w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg'
                onClick={handleAnalyze}
                id='submit-btn'>
                <Microscope className='mr-2 h-4 w-4' /> Analyze Image
              </Button>
            )}

            {isAnalyzing && (
              <div className='space-y-2'>
                <div className='flex justify-between text-sm mb-1'>
                  <span>Analyzing image...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className='h-2' />
                <div className='text-xs text-slate-500 animate-pulse'>
                  AI model processing your image...
                </div>
              </div>
            )}

            {error && (
              <div className='p-4 bg-red-50 text-red-600 rounded-lg'>
                {error}
              </div>
            )}

            {result && (
              <Card className='p-4 border-0 shadow-md overflow-hidden relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-70 -z-10'></div>
                <div className='flex items-start gap-4'>
                  <div className='p-2 rounded-full bg-emerald-100'>
                    <CheckCircle2 className='h-6 w-6 text-emerald-600' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg'>Analysis Result</h3>
                    <p className='text-slate-600'>
                      Predicted: {result.predicted_class} (
                      {result.confidence.toFixed(2)}% confidence)
                    </p>
                    {responseTime && (
                      <p className='text-sm text-slate-500 mt-2'>
                        Response time: {responseTime} seconds
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// Heart Risk Analysis Component
function HeartRiskAnalysis() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    cp: '',
    trestbps: '',
    chol: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 4;
      });
    }, 100);

    try {
      const apiData = {
        age: Number.parseInt(formData.age),
        gender: Number.parseInt(formData.gender),
        cp: Number.parseInt(formData.cp),
        trestbps: Number.parseInt(formData.trestbps),
        chol: Number.parseInt(formData.chol),
        restecg: Number.parseInt(formData.restecg),
        thalach: Number.parseInt(formData.thalach),
        exang: Number.parseInt(formData.exang),
        oldpeak: Number.parseFloat(formData.oldpeak),
        slope: Number.parseInt(formData.slope),
        ca: Number.parseInt(formData.ca),
      };

      const response = await fetch('/api/heart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data.result || data.error);
    } catch (error) {
      console.error('Error analyzing heart risk:', error);
      setResult('Error fetching data. Please try again.');
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className='space-y-6'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-xl font-semibold mb-2'>Heart Risk Analysis</h2>
        <p className='text-slate-600 mb-4'>
          Enter your health metrics for an AI-powered analysis of your
          cardiovascular risk factors.
        </p>

        {!isAnalyzing && !result ? (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='age'>Age</Label>
                <Input
                  id='age'
                  name='age'
                  type='number'
                  placeholder='Enter your age'
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='gender'>Gender (0 = Female, 1 = Male)</Label>
                <Input
                  id='gender'
                  name='gender'
                  type='number'
                  placeholder='0 or 1'
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='cp'>Chest Pain Type (0-3)</Label>
                <Input
                  id='cp'
                  name='cp'
                  type='number'
                  placeholder='0-3'
                  value={formData.cp}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='trestbps'>Resting BLood Pressure (mmHg)</Label>
                <Input
                  id='trestbps'
                  name='trestbps'
                  type='number'
                  placeholder='e.g., 120'
                  value={formData.trestbps}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='chol'>Serum Cholesterol (mg/dL)</Label>
                <Input
                  id='chol'
                  name='chol'
                  type='number'
                  placeholder='e.g., 200'
                  value={formData.chol}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='restecg'>Resting ECG (0-2)</Label>
                <Input
                  id='restecg'
                  name='restecg'
                  type='number'
                  placeholder='0-2'
                  value={formData.restecg}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='thalach'>Max Heart Rate achieved</Label>
                <Input
                  id='thalach'
                  name='thalach'
                  type='number'
                  placeholder='e.g., 150'
                  value={formData.thalach}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='exang'>
                  Exercise Induced Angina (0 = No, 1 = Yes)
                </Label>
                <Input
                  id='exang'
                  name='exang'
                  type='number'
                  placeholder='0 or 1'
                  value={formData.exang}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='oldpeak'>
                  Oldpeak (ST Depression induced by exercise relative to rest)
                </Label>
                <Input
                  id='oldpeak'
                  name='oldpeak'
                  type='number'
                  step='0.1'
                  placeholder='e.g., 1.5'
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slope'>
                  Slope of the peak exercise ST segment (0-2)
                </Label>
                <Input
                  id='slope'
                  name='slope'
                  type='number'
                  placeholder='0-2'
                  value={formData.slope}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='ca'>
                  Number of major vessels (0-3) colored by flouroscopy
                </Label>
                <Input
                  id='ca'
                  name='ca'
                  type='number'
                  placeholder='0-3'
                  value={formData.ca}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-rose-500'
                />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-rose-600 hover:bg-rose-700 transition-all duration-300 hover:shadow-lg'>
              <Heart className='mr-2 h-4 w-4' /> Analyze Heart Risk
            </Button>
          </form>
        ) : isAnalyzing ? (
          <div className='space-y-4 py-8'>
            <div className='flex justify-center mb-4'>
              <div className='relative w-24 h-24'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Heart className='h-12 w-12 text-rose-500 animate-pulse' />
                </div>
                <svg
                  className='w-24 h-24 rotate-[-90deg]'
                  viewBox='0 0 100 100'>
                  <circle
                    className='text-rose-100'
                    strokeWidth='8'
                    stroke='currentColor'
                    fill='transparent'
                    r='42'
                    cx='50'
                    cy='50'
                  />
                  <circle
                    className='text-rose-500 transition-all duration-300 ease-in-out'
                    strokeWidth='8'
                    strokeDasharray={264}
                    strokeDashoffset={264 - (progress / 100) * 264}
                    strokeLinecap='round'
                    stroke='currentColor'
                    fill='transparent'
                    r='42'
                    cx='50'
                    cy='50'
                  />
                </svg>
              </div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-medium mb-1'>
                Analyzing your heart health data
              </div>
              <div className='text-sm text-slate-500 animate-pulse'>
                AI model processing your information...
              </div>
            </div>
          </div>
        ) : (
          result && (
            <div className='space-y-6'>
              <Card className='p-6 border-0 shadow-md overflow-hidden relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-70 -z-10'></div>
                <div className='flex flex-col md:flex-row md:items-center gap-6'>
                  <div className='p-4 rounded-full bg-rose-100'>
                    <Heart className='h-12 w-12 text-rose-600' />
                  </div>
                  <div className='flex-1 text-center md:text-left'>
                    <h3 className='text-2xl font-bold mb-1'>Analysis Result</h3>
                    <p className='text-slate-600'>{result}</p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={resetAnalysis}
                variant='outline'
                className='w-full hover:bg-rose-50 transition-all duration-300'>
                Start New Analysis
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Diabetes Analysis Component
function DiabetesAnalysis() {
  const [formData, setFormData] = useState({
    glucose: '',
    BP: '',
    insulin: '',
    BMI: '',
    age: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 4;
      });
    }, 100);

    try {
      const apiData = {
        glucose: Number.parseInt(formData.glucose),
        BP: Number.parseInt(formData.BP),
        insulin: Number.parseInt(formData.insulin),
        BMI: Number.parseFloat(formData.BMI),
        age: Number.parseInt(formData.age),
      };

      const response = await fetch('/api/diabetes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data.result || data.error);
    } catch (error) {
      console.error('Error analyzing diabetes risk:', error);
      setResult('Error fetching data. Please try again.');
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setProgress(0);
  };

  return (
    <div className='space-y-6'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-xl font-semibold mb-2'>Diabetes Risk Analysis</h2>
        <p className='text-slate-600 mb-4'>
          Enter your health metrics for an AI-powered analysis of your diabetes
          risk factors.
        </p>

        {!isAnalyzing && !result ? (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='glucose'>Glucose (mg/dL)</Label>
                <Input
                  id='glucose'
                  name='glucose'
                  type='number'
                  placeholder='e.g., 95'
                  value={formData.glucose}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-amber-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='BP'>Blood Pressure (mmHg)</Label>
                <Input
                  id='BP'
                  name='BP'
                  type='number'
                  placeholder='e.g., 120'
                  value={formData.BP}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-amber-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='insulin'>Insulin (μU/mL)</Label>
                <Input
                  id='insulin'
                  name='insulin'
                  type='number'
                  placeholder='e.g., 50'
                  value={formData.insulin}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-amber-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='BMI'>BMI</Label>
                <Input
                  id='BMI'
                  name='BMI'
                  type='number'
                  step='0.1'
                  placeholder='e.g., 24.5'
                  value={formData.BMI}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-amber-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='age'>Age</Label>
                <Input
                  id='age'
                  name='age'
                  type='number'
                  placeholder='e.g., 35'
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className='transition-all duration-300 focus:ring-2 focus:ring-amber-500'
                />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:shadow-lg'>
              <Flask className='mr-2 h-4 w-4' /> Analyze Diabetes Risk
            </Button>
          </form>
        ) : isAnalyzing ? (
          <div className='space-y-4 py-8'>
            <div className='flex justify-center mb-4'>
              <div className='relative w-24 h-24'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Flask className='h-12 w-12 text-amber-500 animate-pulse' />
                </div>
                <svg
                  className='w-24 h-24 rotate-[-90deg]'
                  viewBox='0 0 100 100'>
                  <circle
                    className='text-amber-100'
                    strokeWidth='8'
                    stroke='currentColor'
                    fill='transparent'
                    r='42'
                    cx='50'
                    cy='50'
                  />
                  <circle
                    className='text-amber-500 transition-all duration-300 ease-in-out'
                    strokeWidth='8'
                    strokeDasharray={264}
                    strokeDashoffset={264 - (progress / 100) * 264}
                    strokeLinecap='round'
                    stroke='currentColor'
                    fill='transparent'
                    r='42'
                    cx='50'
                    cy='50'
                  />
                </svg>
              </div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-medium mb-1'>
                Analyzing your health data
              </div>
              <div className='text-sm text-slate-500 animate-pulse'>
                AI model processing your information...
              </div>
            </div>
          </div>
        ) : (
          result && (
            <div className='space-y-6'>
              <Card className='p-6 border-0 shadow-md overflow-hidden relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-70 -z-10'></div>
                <div className='flex flex-col md:flex-row md:items-center gap-6'>
                  <div className='p-4 rounded-full bg-amber-100'>
                    <Flask className='h-12 w-12 text-amber-600' />
                  </div>
                  <div className='flex-1 text-center md:text-left'>
                    <h3 className='text-2xl font-bold mb-1'>Analysis Result</h3>
                    <p className='text-slate-600'>{result}</p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={resetAnalysis}
                variant='outline'
                className='w-full hover:bg-amber-50 transition-all duration-300'>
                Start New Analysis
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
// Stat Card Component
function StatCard({
  icon,
  title,
  value,
  suffix,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  suffix: string;
  description: string;
  color: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value > 0) {
      const duration = 2000; // ms
      const interval = 50; // ms
      const steps = duration / interval;
      const increment = value / steps;

      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <Card
      className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden relative`}>
      <div className={`absolute inset-0 bg-${color}-50 opacity-50 -z-10`}></div>
      <CardContent className='p-6 flex items-center gap-4'>
        <div className='bg-white p-3 rounded-full shadow-sm'>{icon}</div>
        <div>
          <h3 className='font-medium text-slate-800'>{title}</h3>
          <div className='flex items-baseline gap-1'>
            <span className='text-2xl font-bold'>
              {count}
              {suffix}
            </span>
            <span className='text-sm text-slate-500'>{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Step Card Component
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className='flex flex-col items-center text-center relative group'>
      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative z-10 group-hover:bg-primary/20 transition-all duration-300'>
        <div className='absolute -inset-2 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow'></div>
        {icon}
      </div>
      <div className='absolute top-8 left-0 right-0 text-center'>
        <span className='text-4xl font-bold text-primary/10'>{number}</span>
      </div>
      <h3 className='text-lg font-semibold mb-2'>{title}</h3>
      <p className='text-slate-600'>{description}</p>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  quote,
  author,
  role,
  image,
}: {
  quote: string;
  author: string;
  role: string;
  image: string;
}) {
  return (
    <Card className='border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group'>
      <CardContent className='p-6 flex flex-col items-center text-center'>
        <div className='relative w-16 h-16 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-all duration-300'>
          <Image
            src={image || '/placeholder.svg'}
            alt={author}
            fill
            className='object-cover'
          />
        </div>
        <p className='text-slate-600 mb-4 italic'>"{quote}"</p>
        <div>
          <h4 className='font-semibold'>{author}</h4>
          <p className='text-sm text-slate-500'>{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ Item Component
function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className='border border-slate-200 rounded-lg overflow-hidden'>
      <button
        className='w-full p-4 text-left font-medium flex justify-between items-center hover:bg-slate-50 transition-colors'
        onClick={onClick}>
        {question}
        {isOpen ? (
          <ChevronUp className='h-5 w-5 text-slate-500' />
        ) : (
          <ChevronDown className='h-5 w-5 text-slate-500' />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className='p-4 pt-0 text-slate-600'>{answer}</div>
      </div>
    </div>
  );
}

// Types
interface AnalysisResult {
  condition: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface HeartRiskResult {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
  keyFactors: string[];
  recommendations: string[];
}

interface DiabetesRiskResult {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
  keyFactors: string[];
  recommendations: string[];
}
