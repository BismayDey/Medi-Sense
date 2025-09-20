'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  DropletsIcon as Drop,
  HeartPulse,
  Moon,
  Pill,
  Plus,
  Sparkles,
  Utensils,
  User,
  FootprintsIcon as Walking,
  AlertTriangle,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Medal,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Dashboard() {
  const [healthScore, setHealthScore] = useState(0);
  const [waterProgress, setWaterProgress] = useState(0);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [stepsProgress, setStepsProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setHealthScore(85);
      setWaterProgress(70);
      setSleepProgress(85);
      setStepsProgress(60);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const vitalSigns = [
    { name: 'Heart Rate', value: '72 bpm', trend: 'stable', icon: HeartPulse },
    {
      name: 'Blood Pressure',
      value: '120/80',
      trend: 'improving',
      icon: Activity,
    },
    { name: 'Oxygen Level', value: '98%', trend: 'stable', icon: Sparkles },
    { name: 'Temperature', value: '98.6°F', trend: 'stable', icon: Zap },
  ];

  const medications = [
    { name: 'Vitamin D', time: '8:00 AM', taken: true },
    { name: 'Multivitamin', time: '8:00 AM', taken: true },
    { name: 'Omega-3', time: '8:00 PM', taken: false },
  ];

  const appointments = [
    {
      doctor: 'Dr. Smith',
      specialty: 'Primary Care',
      date: 'May 20, 2024',
      time: '10:00 AM',
    },
    {
      doctor: 'Dr. Johnson',
      specialty: 'Dentist',
      date: 'June 15, 2024',
      time: '2:30 PM',
    },
  ];

  const activities = [
    { name: 'Running', duration: '30 min', calories: 320, date: 'Today' },
    {
      name: 'Strength Training',
      duration: '45 min',
      calories: 280,
      date: 'Yesterday',
    },
    { name: 'Cycling', duration: '60 min', calories: 450, date: '3 days ago' },
  ];

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <header className='sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
        <div className='flex flex-row items-center gap-2'>
          <Link href='/' className='mr-4'>
            <Button variant='outline' size='icon' className='h-9 w-9'>
              <ArrowLeft className='h-4 w-4' />
              <span className='sr-only'>Back to Home</span>
            </Button>
          </Link>
          <HeartPulse className='h-6 w-6 text-primary' />
          <h1 className='text-lg font-semibold'>MyHealth Dashboard</h1>
        </div>
        <div className='ml-auto flex items-center gap-4'>
          <Button size='sm' className='hidden md:flex'>
            <Calendar className='mr-2 h-4 w-4' />
            Schedule Appointment
          </Button>
        </div>
      </header>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Card className='relative overflow-hidden'>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Health Score
                </CardTitle>
                <Medal className='h-4 w-4 text-primary' />
              </CardHeader>
              <CardContent>
                <div className='text-center'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className='relative mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/30'>
                    <svg
                      className='absolute h-full w-full'
                      viewBox='0 0 100 100'>
                      <motion.circle
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: healthScore / 100 }}
                        transition={{
                          delay: 0.5,
                          duration: 1.5,
                          ease: 'easeOut',
                        }}
                        cx='50'
                        cy='50'
                        r='46'
                        fill='none'
                        stroke='hsl(var(--primary))'
                        strokeWidth='8'
                        strokeLinecap='round'
                        strokeDasharray='289.02652413026095'
                        strokeDashoffset='0'
                        transform='rotate(-90, 50, 50)'
                        className='drop-shadow-md'
                      />
                    </svg>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className='absolute flex flex-col items-center justify-center'>
                      <span className='text-3xl font-bold'>{healthScore}</span>
                      <span className='text-xs text-muted-foreground'>
                        /100
                      </span>
                    </motion.div>
                  </motion.div>
                  <div className='flex justify-center gap-4'>
                    <div className='flex items-center'>
                      <Badge variant='outline' className='font-normal'>
                        <ArrowUp className='mr-1 h-3 w-3 text-emerald-500' />
                        +5 pts
                      </Badge>
                    </div>
                    <div className='flex items-center'>
                      <Badge
                        variant='outline'
                        className='bg-emerald-50 font-normal dark:bg-emerald-950/20'>
                        <Sparkles className='mr-1 h-3 w-3 text-emerald-500' />
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Risk Level
                </CardTitle>
                <AlertTriangle className='h-4 w-4 text-amber-500' />
              </CardHeader>
              <CardContent>
                <div className='text-center'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30'>
                    <span className='text-2xl font-semibold text-emerald-600 dark:text-emerald-400'>
                      Low
                    </span>
                  </motion.div>
                  <div className='grid grid-cols-3 gap-1 text-xs'>
                    <div className='rounded bg-emerald-100 py-1 font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'>
                      Low
                    </div>
                    <div className='rounded bg-muted py-1 font-medium'>
                      Medium
                    </div>
                    <div className='rounded bg-muted py-1 font-medium'>
                      High
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Appointments
                </CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-center'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30'>
                    <div className='flex flex-col'>
                      <span className='text-3xl font-semibold text-blue-600 dark:text-blue-400'>
                        2
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        Upcoming
                      </span>
                    </div>
                  </motion.div>
                  <div className='flex justify-center'>
                    <Button variant='outline' size='sm' className='gap-1'>
                      <Calendar className='h-3 w-3' />
                      <span>View Schedule</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Medications
                </CardTitle>
                <Pill className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-center'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/30'>
                    <div className='flex flex-col'>
                      <span className='text-3xl font-semibold text-violet-600 dark:text-violet-400'>
                        3
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        Prescribed
                      </span>
                    </div>
                  </motion.div>
                  <div className='flex justify-center'>
                    <Button variant='outline' size='sm' className='gap-1'>
                      <Clock className='h-3 w-3' />
                      <span>Set Reminders</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='vitals'>Vitals</TabsTrigger>
            <TabsTrigger value='activity'>Activity</TabsTrigger>
            <TabsTrigger value='nutrition'>Nutrition</TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='col-span-4'>
                <Card className='h-full'>
                  <CardHeader>
                    <CardTitle>Vital Signs</CardTitle>
                    <CardDescription>
                      Recent measurements and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      {vitalSigns.map((vital, i) => (
                        <motion.div
                          key={vital.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                          className='flex items-center gap-4 rounded-lg border p-4'>
                          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                            <vital.icon className='h-6 w-6 text-primary' />
                          </div>
                          <div>
                            <p className='text-sm font-medium leading-none'>
                              {vital.name}
                            </p>
                            <p className='text-xl font-bold'>{vital.value}</p>
                            <p className='text-xs text-muted-foreground'>
                              {vital.trend === 'improving' ? (
                                <span className='flex items-center text-emerald-500'>
                                  <ArrowUp className='mr-1 h-3 w-3' /> Improving
                                </span>
                              ) : vital.trend === 'declining' ? (
                                <span className='flex items-center text-red-500'>
                                  <ArrowDown className='mr-1 h-3 w-3' />{' '}
                                  Declining
                                </span>
                              ) : (
                                <span className='flex items-center text-blue-500'>
                                  ― Stable
                                </span>
                              )}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant='outline' size='sm' className='w-full'>
                      View All Vital Signs
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='col-span-3'>
                <Card className='h-full'>
                  <CardHeader>
                    <CardTitle>Daily Goals</CardTitle>
                    <CardDescription>Your progress for today</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-5'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center'>
                          <Drop className='mr-2 h-4 w-4 text-blue-500' />
                          <span>Water Intake</span>
                        </div>
                        <span>
                          {Math.round(waterProgress * 0.08 * 10) / 10}/2L
                        </span>
                      </div>
                      <div className='h-2 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950/30'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${waterProgress}%` }}
                          transition={{
                            delay: 0.6,
                            duration: 1.5,
                            ease: 'easeOut',
                          }}
                          className='h-full bg-blue-500'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center'>
                          <Moon className='mr-2 h-4 w-4 text-indigo-500' />
                          <span>Sleep</span>
                        </div>
                        <span>
                          {Math.round(sleepProgress * 0.08 * 10) / 10}/8h
                        </span>
                      </div>
                      <div className='h-2 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950/30'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sleepProgress}%` }}
                          transition={{
                            delay: 0.8,
                            duration: 1.5,
                            ease: 'easeOut',
                          }}
                          className='h-full bg-indigo-500'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center'>
                          <Walking className='mr-2 h-4 w-4 text-emerald-500' />
                          <span>Steps</span>
                        </div>
                        <span>{Math.round(stepsProgress * 100)}/10,000</span>
                      </div>
                      <div className='h-2 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/30'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stepsProgress}%` }}
                          transition={{
                            delay: 1,
                            duration: 1.5,
                            ease: 'easeOut',
                          }}
                          className='h-full bg-emerald-500'
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='justify-between'>
                    <Button variant='ghost' size='sm'>
                      <Plus className='mr-2 h-4 w-4' />
                      Add Goal
                    </Button>
                    <Button variant='ghost' size='sm'>
                      View History
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>
                        Your scheduled medical visits
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>Add New</DropdownMenuItem>
                        <DropdownMenuItem>View Calendar</DropdownMenuItem>
                        <DropdownMenuItem>Set Reminders</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {appointments.map((appointment, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                          className='flex items-start gap-4 rounded-lg border p-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                            <Calendar className='h-5 w-5 text-primary' />
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium'>{appointment.doctor}</p>
                            <p className='text-sm text-muted-foreground'>
                              {appointment.specialty}
                            </p>
                            <div className='mt-1 flex items-center gap-3'>
                              <Badge variant='outline' className='text-xs'>
                                {appointment.date}
                              </Badge>
                              <Badge variant='outline' className='text-xs'>
                                {appointment.time}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size='sm' className='gap-1 w-full'>
                      <Plus className='h-4 w-4' />
                      Schedule New Appointment
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <div>
                      <CardTitle>Medications</CardTitle>
                      <CardDescription>
                        Track your daily medication intake
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>Add New</DropdownMenuItem>
                        <DropdownMenuItem>View All</DropdownMenuItem>
                        <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {medications.map((medication, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                          className={cn(
                            'flex items-center gap-4 rounded-lg border p-3',
                            medication.taken &&
                              'border-emerald-200 bg-emerald-50 dark:border-emerald-950/50 dark:bg-emerald-950/20',
                          )}>
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              medication.taken
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                                : 'bg-primary/10 text-primary',
                            )}>
                            <Pill className='h-5 w-5' />
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium'>{medication.name}</p>
                            <div className='mt-1 flex items-center gap-2'>
                              <Clock className='h-3 w-3 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                {medication.time}
                              </span>
                            </div>
                          </div>
                          <div>
                            {medication.taken ? (
                              <Badge className='bg-emerald-500 hover:bg-emerald-600'>
                                Taken
                              </Badge>
                            ) : (
                              <Button size='sm' variant='outline'>
                                Take
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant='outline' size='sm' className='w-full'>
                      Set Reminders
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <div>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>
                        Your latest physical activities
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>Add Activity</DropdownMenuItem>
                        <DropdownMenuItem>View Stats</DropdownMenuItem>
                        <DropdownMenuItem>Set Goals</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {activities.map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                          className='flex items-start gap-4 rounded-lg border p-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400'>
                            <Activity className='h-5 w-5' />
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium'>{activity.name}</p>
                            <div className='mt-1 flex items-center gap-3'>
                              <span className='flex items-center text-xs text-muted-foreground'>
                                <Clock className='mr-1 h-3 w-3' />{' '}
                                {activity.duration}
                              </span>
                              <span className='flex items-center text-xs text-muted-foreground'>
                                <Zap className='mr-1 h-3 w-3' />{' '}
                                {activity.calories} cal
                              </span>
                            </div>
                          </div>
                          <div>
                            <Badge variant='outline' className='text-xs'>
                              {activity.date}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full gap-1'>
                      <Plus className='h-4 w-4' />
                      Log Activity
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          <TabsContent value='vitals' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle>Blood Pressure</CardTitle>
                  <CardDescription>
                    Historical readings and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 rounded-full bg-primary'></div>
                        <span className='text-sm font-medium'>Systolic</span>
                      </div>
                      <span className='text-sm font-medium'>120 mmHg</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 rounded-full bg-blue-500'></div>
                        <span className='text-sm font-medium'>Diastolic</span>
                      </div>
                      <span className='text-sm font-medium'>80 mmHg</span>
                    </div>
                    <Separator className='my-2' />
                    <div className='h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center'>
                      <p className='text-muted-foreground text-sm'>
                        Blood pressure graph visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' size='sm' className='w-full'>
                    View History
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate</CardTitle>
                  <CardDescription>BPM monitoring and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col items-center space-y-2'>
                    <div className='relative flex h-32 w-32 items-center justify-center'>
                      <HeartPulse className='animate-pulse h-12 w-12 text-red-500' />
                      <div className='absolute inset-0 rounded-full border-4 border-red-100 dark:border-red-900/30'></div>
                    </div>
                    <div className='text-3xl font-bold'>72 BPM</div>
                    <Badge variant='outline' className='text-xs'>
                      <ArrowDown className='mr-1 h-3 w-3 text-emerald-500' />5
                      BPM lower than average
                    </Badge>
                    <div className='h-[100px] w-full bg-muted/20 rounded-md flex items-center justify-center'>
                      <p className='text-muted-foreground text-sm'>
                        Heart rate trend visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' size='sm' className='w-full'>
                    View Details
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Oxygen Saturation</CardTitle>
                  <CardDescription>SpO2 levels and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col items-center space-y-2'>
                    <div className='relative h-32 w-32'>
                      <svg className='h-full w-full' viewBox='0 0 100 100'>
                        <circle
                          cx='50'
                          cy='50'
                          r='45'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='8'
                          className='text-muted/20'
                        />
                        <circle
                          cx='50'
                          cy='50'
                          r='45'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='8'
                          strokeDasharray='283'
                          strokeDashoffset='28.3'
                          className='text-blue-500'
                        />
                      </svg>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-3xl font-bold'>98%</span>
                      </div>
                    </div>
                    <Badge className='bg-emerald-500 hover:bg-emerald-600'>
                      Normal Range
                    </Badge>
                    <div className='h-[100px] w-full bg-muted/20 rounded-md flex items-center justify-center'>
                      <p className='text-muted-foreground text-sm'>
                        Oxygen level trend visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' size='sm' className='w-full'>
                    View History
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Vital Signs</CardTitle>
                <CardDescription>
                  Comprehensive view of your health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                  {[
                    {
                      name: 'Body Temperature',
                      value: '98.6°F',
                      status: 'normal',
                      icon: Zap,
                    },
                    {
                      name: 'Respiratory Rate',
                      value: '16 rpm',
                      status: 'normal',
                      icon: Activity,
                    },
                    {
                      name: 'Glucose',
                      value: '95 mg/dL',
                      status: 'normal',
                      icon: Drop,
                    },
                    {
                      name: 'BMI',
                      value: '22.5',
                      status: 'normal',
                      icon: User,
                    },
                    {
                      name: 'Cholesterol (Total)',
                      value: '180 mg/dL',
                      status: 'normal',
                      icon: Activity,
                    },
                    {
                      name: 'Cholesterol (HDL)',
                      value: '55 mg/dL',
                      status: 'normal',
                      icon: Activity,
                    },
                    {
                      name: 'Cholesterol (LDL)',
                      value: '110 mg/dL',
                      status: 'normal',
                      icon: Activity,
                    },
                    {
                      name: 'Triglycerides',
                      value: '120 mg/dL',
                      status: 'normal',
                      icon: Activity,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10'>
                          <item.icon className='h-5 w-5 text-primary' />
                        </div>
                        <div>
                          <p className='text-sm font-medium'>{item.name}</p>
                          <p className='text-lg font-semibold'>{item.value}</p>
                        </div>
                      </div>
                      <Badge
                        variant='outline'
                        className='bg-emerald-50 font-normal dark:bg-emerald-950/20'>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' size='sm' className='w-full'>
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='activity' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>
                  Overview of your physical activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-3'>
                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <Walking className='h-10 w-10 text-primary' />
                    <div className='text-3xl font-bold'>6,420</div>
                    <div className='text-sm text-muted-foreground'>
                      Daily Steps
                    </div>
                    <Progress value={64} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      64% of 10,000 goal
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <Activity className='h-10 w-10 text-primary' />
                    <div className='text-3xl font-bold'>1,250</div>
                    <div className='text-sm text-muted-foreground'>
                      Daily Calories
                    </div>
                    <Progress value={62.5} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      62.5% of 2,000 goal
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <Zap className='h-10 w-10 text-primary' />
                    <div className='text-3xl font-bold'>35</div>
                    <div className='text-sm text-muted-foreground'>
                      Active Minutes
                    </div>
                    <Progress value={58.3} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      58.3% of 60 min goal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercise Log</CardTitle>
                <CardDescription>
                  Recent workouts and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    {
                      name: 'Morning Run',
                      type: 'Cardio',
                      duration: '30 min',
                      distance: '3.2 km',
                      calories: 320,
                      date: 'Today',
                    },
                    {
                      name: 'Strength Training',
                      type: 'Strength',
                      duration: '45 min',
                      distance: '-',
                      calories: 280,
                      date: 'Yesterday',
                    },
                    {
                      name: 'Cycling',
                      type: 'Cardio',
                      duration: '60 min',
                      distance: '15 km',
                      calories: 450,
                      date: '3 days ago',
                    },
                    {
                      name: 'Yoga',
                      type: 'Flexibility',
                      duration: '40 min',
                      distance: '-',
                      calories: 180,
                      date: '4 days ago',
                    },
                  ].map((exercise, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-4 rounded-lg border p-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                        <Activity className='h-6 w-6 text-primary' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-semibold'>{exercise.name}</h4>
                          <Badge variant='outline'>{exercise.date}</Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {exercise.type}
                        </p>
                        <div className='mt-2 flex flex-wrap gap-3'>
                          <div className='flex items-center text-xs'>
                            <Clock className='mr-1 h-3 w-3' />
                            <span>{exercise.duration}</span>
                          </div>
                          <div className='flex items-center text-xs'>
                            <Walking className='mr-1 h-3 w-3' />
                            <span>{exercise.distance}</span>
                          </div>
                          <div className='flex items-center text-xs'>
                            <Zap className='mr-1 h-3 w-3' />
                            <span>{exercise.calories} cal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button size='sm' className='gap-1 w-full'>
                  <Plus className='h-4 w-4' />
                  Log Exercise
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='nutrition' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Summary</CardTitle>
                <CardDescription>
                  Daily intake and nutritional breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-4'>
                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <Utensils className='h-10 w-10 text-primary' />
                    <div className='text-3xl font-bold'>1,850</div>
                    <div className='text-sm text-muted-foreground'>
                      Calories
                    </div>
                    <Progress value={77} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      77% of 2,400 goal
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <div className='text-3xl font-bold'>75g</div>
                    <div className='text-sm text-muted-foreground'>Protein</div>
                    <Progress value={75} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      75% of 100g goal
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <div className='text-3xl font-bold'>210g</div>
                    <div className='text-sm text-muted-foreground'>Carbs</div>
                    <Progress value={70} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      70% of 300g goal
                    </div>
                  </div>

                  <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border p-6'>
                    <div className='text-3xl font-bold'>55g</div>
                    <div className='text-sm text-muted-foreground'>Fat</div>
                    <Progress value={68.75} className='h-2 w-[80%]' />
                    <div className='text-xs text-muted-foreground'>
                      68.75% of 80g goal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meal Log</CardTitle>
                <CardDescription>
                  Today's meals and nutritional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    {
                      name: 'Breakfast',
                      time: '7:30 AM',
                      calories: 450,
                      items: ['Oatmeal with berries', 'Greek yogurt', 'Coffee'],
                    },
                    {
                      name: 'Lunch',
                      time: '12:15 PM',
                      calories: 680,
                      items: [
                        'Grilled chicken salad',
                        'Whole grain bread',
                        'Apple',
                      ],
                    },
                    {
                      name: 'Snack',
                      time: '3:30 PM',
                      calories: 150,
                      items: ['Mixed nuts', 'Banana'],
                    },
                    {
                      name: 'Dinner',
                      time: '7:00 PM',
                      calories: 570,
                      items: ['Salmon', 'Quinoa', 'Roasted vegetables'],
                    },
                  ].map((meal, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-4 rounded-lg border p-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                        <Utensils className='h-6 w-6 text-primary' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-semibold'>{meal.name}</h4>
                          <Badge variant='outline'>{meal.time}</Badge>
                        </div>
                        <p className='text-sm font-medium'>
                          {meal.calories} calories
                        </p>
                        <div className='mt-2'>
                          <ul className='text-sm text-muted-foreground'>
                            {meal.items.map((item, j) => (
                              <li key={j}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button size='sm' className='gap-1 w-full'>
                  <Plus className='h-4 w-4' />
                  Log Meal
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Intake</CardTitle>
                <CardDescription>Daily hydration tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col items-center space-y-6'>
                  <div className='relative h-40 w-40'>
                    <div className='absolute inset-4 rounded-full border-4 border-blue-100 dark:border-blue-950/30'></div>
                    <div
                      className='absolute inset-4 overflow-hidden rounded-full border-4 border-blue-100 dark:border-blue-950/30'
                      style={{ height: `${waterProgress}%`, bottom: '16px' }}>
                      <div className='absolute inset-0 bg-blue-500/30'></div>
                    </div>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='text-3xl font-bold'>
                          {Math.round(waterProgress * 0.08 * 10) / 10}L
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          of 2L goal
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Button
                        key={i}
                        variant={
                          i <= Math.round(waterProgress / 12.5)
                            ? 'default'
                            : 'outline'
                        }
                        size='icon'
                        className='h-10 w-10 rounded-full'>
                        <Drop className='h-5 w-5' />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size='sm' className='gap-1 w-full'>
                  <Plus className='h-4 w-4' />
                  Add Water Intake
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
