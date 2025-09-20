'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Music,
  Film,
  Heart,
  Brain,
  LogOut,
  History,
  CheckCircle,
  UserIcon,
  ThumbsUp,
  ThumbsDown,
  Meh,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

import { app } from '@/lib/firebase';

const auth = getAuth(app);
const db = getFirestore(app);

const moodOptions = [
  'Depressed',
  'Sad',
  'Lonely',
  'Bored',
  'Anxious',
  'Neutral',
  'Relaxed',
  'Happy',
  'Excited',
  'Joyful',
  'Euphoric',
];

// Types
interface Recommendation {
  id?: string;
  mentalHealth: number;
  happiness: number;
  mood: string;
  songs: Song[];
  movies: Movie[];
  timestamp: Timestamp | null;
  completed: boolean;
  feedback?: {
    rating: number;
    comment: string;
    newMood: string;
  };
}

interface Song {
  song_name: string;
  genre: string;
  ytl: string;
  completed?: boolean;
}

interface Movie {
  movie_name: string;
  genre: string;
  completed?: boolean;
}

export default function RecommendationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const [mentalHealth, setMentalHealth] = useState<string>('3');
  const [happiness, setHappiness] = useState<string>('3');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentRecommendation, setCurrentRecommendation] =
    useState<Recommendation | null>(null);
  const [recommendationHistory, setRecommendationHistory] = useState<
    Recommendation[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>('form');
  const [viewingHistoryItem, setViewingHistoryItem] =
    useState<Recommendation | null>(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackMood, setFeedbackMood] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [completionProgress, setCompletionProgress] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        fetchRecommendationHistory();
      } else {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchRecommendationHistory = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'recommendations'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const recommendations: Recommendation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recommendations.push({
          id: doc.id,
          mentalHealth: data.mentalHealth,
          happiness: data.happiness,
          mood: data.mood,
          songs: data.songs || [],
          movies: data.movies || [],
          timestamp: data.timestamp,
          completed: data.completed || false,
          feedback: data.feedback,
        });
      });

      setRecommendationHistory(recommendations);
    } catch (error) {
      console.error('Error fetching recommendation history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your recommendation history',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleGetRecommendations = async () => {
    if (!mentalHealth || !happiness || !selectedMood) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and select a mood',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to get recommendations',
        variant: 'destructive',
      });
      router.push('/auth');
      return;
    }

    setIsLoading(true);
    setCurrentRecommendation(null);

    try {
      const response = await fetch('/api/movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mental_health: Number.parseInt(mentalHealth),
          happiness: Number.parseInt(happiness),
          mood: selectedMood,
        }),
      });

      const data = await response.json();

      const songsWithCompletion = (data.songs ?? []).map((song: Song) => ({
        ...song,
        completed: false,
      }));

      const moviesWithCompletion = (data.movies ?? []).map((movie: Movie) => ({
        ...movie,
        completed: false,
      }));

      const newRecommendation: Recommendation = {
        mentalHealth: Number.parseInt(mentalHealth),
        happiness: Number.parseInt(happiness),
        mood: selectedMood,
        songs: songsWithCompletion,
        movies: moviesWithCompletion,
        timestamp: null,
        completed: false,
      };

      const docRef = await addDoc(collection(db, 'recommendations'), {
        userId: user.uid,
        mentalHealth: Number.parseInt(mentalHealth),
        happiness: Number.parseInt(happiness),
        mood: selectedMood,
        songs: songsWithCompletion,
        movies: moviesWithCompletion,
        timestamp: serverTimestamp(),
        completed: false,
      });

      newRecommendation.id = docRef.id;
      newRecommendation.timestamp = Timestamp.now();

      setCurrentRecommendation(newRecommendation);
      setActiveTab('recommendations');

      fetchRecommendationHistory();

      setCompletionProgress(0);

      toast({
        title: 'Recommendations ready!',
        description: "We've found some great recommendations for you",
      });
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompletion = async (type: 'song' | 'movie', index: number) => {
    if (!currentRecommendation || !currentRecommendation.id) return;

    const updatedRecommendation = { ...currentRecommendation };

    if (type === 'song') {
      updatedRecommendation.songs[index].completed =
        !updatedRecommendation.songs[index].completed;
    } else {
      updatedRecommendation.movies[index].completed =
        !updatedRecommendation.movies[index].completed;
    }

    const totalItems =
      updatedRecommendation.songs.length + updatedRecommendation.movies.length;
    const completedItems =
      updatedRecommendation.songs.filter((s) => s.completed).length +
      updatedRecommendation.movies.filter((m) => m.completed).length;

    const progress = Math.round((completedItems / totalItems) * 100);
    setCompletionProgress(progress);

    const allCompleted = progress === 100;
    updatedRecommendation.completed = allCompleted;

    try {
      await updateDoc(doc(db, 'recommendations', currentRecommendation.id), {
        songs: updatedRecommendation.songs,
        movies: updatedRecommendation.movies,
        completed: allCompleted,
      });

      setCurrentRecommendation(updatedRecommendation);

      if (allCompleted && !showFeedback) {
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Error updating completion status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update completion status',
        variant: 'destructive',
      });
    }
  };

  const submitFeedback = async () => {
    if (!currentRecommendation || !currentRecommendation.id) return;

    if (!feedbackMood) {
      toast({
        title: 'Missing information',
        description: 'Please select your current mood',
        variant: 'destructive',
      });
      return;
    }

    try {
      const feedback = {
        rating: feedbackRating,
        comment: feedbackComment,
        newMood: feedbackMood,
      };

      await updateDoc(doc(db, 'recommendations', currentRecommendation.id), {
        feedback,
      });

      const updatedRecommendation = {
        ...currentRecommendation,
        feedback,
      };

      setCurrentRecommendation(updatedRecommendation);
      setFeedbackSubmitted(true);
      setShowConfetti(true);

      const updatedHistory = recommendationHistory.map((rec) =>
        rec.id === currentRecommendation.id ? updatedRecommendation : rec,
      );

      setRecommendationHistory(updatedHistory);

      toast({
        title: 'Feedback submitted!',
        description: 'Thank you for your feedback',
      });

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive',
      });
    }
  };

  // View history item
  const viewHistoryItem = (recommendation: Recommendation) => {
    setViewingHistoryItem(recommendation);
    setActiveTab('history-detail');
  };

  // Get feedback message based on mood change
  const getFeedbackMessage = () => {
    if (!currentRecommendation?.feedback) return '';

    const initialMood = currentRecommendation.mood;
    const newMood = currentRecommendation.feedback.newMood;

    const moodIndex = (mood: string) => moodOptions.indexOf(mood);
    const initialIndex = moodIndex(initialMood);
    const newIndex = moodIndex(newMood);

    if (newIndex > initialIndex + 2) {
      return 'Amazing improvement! Our recommendations really helped you feel much better!';
    } else if (newIndex > initialIndex) {
      return "Great! You're feeling better after enjoying our recommendations.";
    } else if (newIndex === initialIndex) {
      return "You're feeling about the same. We'll try to find better recommendations next time!";
    } else {
      return "We're sorry you're not feeling better. Let's try different recommendations next time.";
    }
  };

  // Get mood emoji
  const getMoodEmoji = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    if (
      ['happy', 'excited', 'joyful', 'euphoric'].some((m) =>
        lowerMood.includes(m),
      )
    ) {
      return '😄';
    } else if (['relaxed', 'neutral'].some((m) => lowerMood.includes(m))) {
      return '😊';
    } else if (['bored', 'anxious'].some((m) => lowerMood.includes(m))) {
      return '😐';
    } else if (['sad', 'lonely'].some((m) => lowerMood.includes(m))) {
      return '😔';
    } else if (['depressed'].some((m) => lowerMood.includes(m))) {
      return '😢';
    }
    return '😶';
  };

  // Format date
  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp.toMillis()).toLocaleString();
  };

  // Render confetti
  const renderConfetti = () => {
    if (!showConfetti) return null;

    const confetti = [];
    const colors = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#ff00ff',
      '#00ffff',
    ];

    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationDuration = Math.random() * 3 + 2;

      confetti.push(
        <div
          key={i}
          className='absolute rounded-full'
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animation: `fall ${animationDuration}s linear forwards`,
          }}
        />,
      );
    }

    return (
      <div
        ref={confettiRef}
        className='fixed inset-0 pointer-events-none z-50'
        style={{
          perspective: '500px',
        }}>
        {confetti}
      </div>
    );
  };

  // If loading auth state, show loading spinner
  if (authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin mx-auto text-purple-600 dark:text-purple-400' />
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin mx-auto text-purple-600 dark:text-purple-400' />
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800'>
      {renderConfetti()}

      <header className='bg-white dark:bg-gray-800 shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <Link href='/' className='mr-4'>
                <Button variant='outline' size='icon' className='h-9 w-9'>
                  <ArrowLeft className='h-4 w-4' />
                  <span className='sr-only'>Back to Home</span>
                </Button>
              </Link>
              <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600'>
                Health Track Recommender
              </h1>
            </div>

            <div className='flex items-center space-x-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative rounded-full h-8 w-8 p-0'>
                    <Avatar>
                      <AvatarImage
                        src={user.photoURL || undefined}
                        alt={user.displayName || 'User'}
                      />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab('form')}>
                    <UserIcon className='mr-2 h-4 w-4' />
                    <span>Get Recommendations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('history')}>
                    <History className='mr-2 h-4 w-4' />
                    <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-6'>
          {/* Tabs */}
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-4'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid grid-cols-3 mb-4'>
                <TabsTrigger
                  value='form'
                  className='flex items-center justify-center'>
                  <Brain className='mr-2 h-4 w-4' />
                  New Recommendation
                </TabsTrigger>
                <TabsTrigger
                  value='recommendations'
                  className='flex items-center justify-center'
                  disabled={!currentRecommendation}>
                  <Music className='mr-2 h-4 w-4' />
                  Current Recommendations
                </TabsTrigger>
                <TabsTrigger
                  value='history'
                  className='flex items-center justify-center'>
                  <History className='mr-2 h-4 w-4' />
                  History
                </TabsTrigger>
              </TabsList>

              {/* Form Tab */}
              <TabsContent value='form'>
                <Card>
                  <CardHeader>
                    <CardTitle>Get Personalized Recommendations</CardTitle>
                    <CardDescription>
                      Tell us how you're feeling and we'll recommend songs and
                      movies just for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='mental-health'>
                        How are you feeling today? (0-5)
                      </Label>
                      <div className='flex items-center'>
                        <Brain className='mr-2 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        <Input
                          id='mental-health'
                          type='number'
                          min='0'
                          max='5'
                          value={mentalHealth}
                          onChange={(e) => setMentalHealth(e.target.value)}
                          placeholder='Enter a score from 0 to 5'
                          className='focus:ring-purple-500'
                        />
                      </div>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        0 = Empty, 5 = Motivated
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='happiness'>Happiness Level (0-5)</Label>
                      <div className='flex items-center'>
                        <Heart className='mr-2 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        <Input
                          id='happiness'
                          type='number'
                          min='0'
                          max='5'
                          value={happiness}
                          onChange={(e) => setHappiness(e.target.value)}
                          placeholder='Enter a level from 0 to 5'
                          className='focus:ring-purple-500'
                        />
                      </div>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        0 = Very unhappy, 5 = Very happy
                      </p>
                    </div>

                    <div className='space-y-3'>
                      <Label>Select Your Current Mood</Label>
                      <div className='flex flex-wrap gap-2'>
                        {moodOptions.map((mood) => (
                          <Button
                            key={mood}
                            variant='outline'
                            size='sm'
                            onClick={() => setSelectedMood(mood)}
                            className={cn(
                              'rounded-full transition-all',
                              selectedMood === mood
                                ? 'bg-purple-500 text-white hover:bg-purple-600'
                                : 'hover:bg-purple-100 dark:hover:bg-gray-700',
                            )}>
                            {getMoodEmoji(mood)} {mood}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleGetRecommendations}
                      disabled={isLoading}
                      className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      size='lg'>
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Finding Perfect Recommendations...
                        </>
                      ) : (
                        'Get Recommendations'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value='recommendations'>
                {currentRecommendation ? (
                  <div className='space-y-6'>
                    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <h2 className='text-xl font-bold'>
                            Your Recommendations
                          </h2>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Based on: Mental Health (
                            {currentRecommendation.mentalHealth}/5), Happiness (
                            {currentRecommendation.happiness}/5), Mood:{' '}
                            {currentRecommendation.mood}{' '}
                            {getMoodEmoji(currentRecommendation.mood)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            currentRecommendation.completed
                              ? 'success'
                              : 'secondary'
                          }>
                          {currentRecommendation.completed
                            ? 'Completed'
                            : 'In Progress'}
                        </Badge>
                      </div>

                      <div className='mb-6'>
                        <Label className='mb-2 block'>
                          Completion Progress
                        </Label>
                        <Progress value={completionProgress} className='h-2' />
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                          {completionProgress}% complete
                        </p>
                      </div>

                      <Tabs defaultValue='songs'>
                        <TabsList className='grid w-full grid-cols-2 mb-6'>
                          <TabsTrigger
                            value='songs'
                            className='flex items-center'>
                            <Music className='mr-2 h-4 w-4' />
                            Songs ({currentRecommendation.songs.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value='movies'
                            className='flex items-center'>
                            <Film className='mr-2 h-4 w-4' />
                            Movies ({currentRecommendation.movies.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value='songs' className='space-y-4'>
                          {currentRecommendation.songs.map((song, index) => (
                            <motion.div
                              key={`song-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}>
                              <Card
                                className={cn(
                                  'overflow-hidden transition-all',
                                  song.completed
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'hover:shadow-md',
                                )}>
                                <CardContent className='p-0'>
                                  <div className='flex items-center p-4'>
                                    <div className='flex items-center mr-4'>
                                      <Checkbox
                                        id={`song-${index}`}
                                        checked={song.completed || false}
                                        onCheckedChange={() =>
                                          toggleCompletion('song', index)
                                        }
                                        className='mr-2'
                                      />
                                      <div className='h-10 w-10 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center'>
                                        <Music className='h-5 w-5 text-purple-500 dark:text-purple-400' />
                                      </div>
                                    </div>
                                    <div className='flex-1 ml-2'>
                                      <h3 className='font-medium text-gray-900 dark:text-white'>
                                        {song.song_name}
                                      </h3>
                                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        Genre: {song.genre}
                                      </p>
                                    </div>
                                    <a
                                      href={song.ytl}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors'>
                                      Listen
                                    </a>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </TabsContent>

                        <TabsContent value='movies' className='space-y-4'>
                          {currentRecommendation.movies.map((movie, index) => (
                            <motion.div
                              key={`movie-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}>
                              <Card
                                className={cn(
                                  'overflow-hidden transition-all',
                                  movie.completed
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'hover:shadow-md',
                                )}>
                                <CardContent className='p-0'>
                                  <div className='flex items-center p-4'>
                                    <div className='flex items-center mr-4'>
                                      <Checkbox
                                        id={`movie-${index}`}
                                        checked={movie.completed || false}
                                        onCheckedChange={() =>
                                          toggleCompletion('movie', index)
                                        }
                                        className='mr-2'
                                      />
                                      <div className='h-10 w-10 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center'>
                                        <Film className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                                      </div>
                                    </div>
                                    <div className='ml-2'>
                                      <h3 className='font-medium text-gray-900 dark:text-white'>
                                        {movie.movie_name}
                                      </h3>
                                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        Genre: {movie.genre}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Feedback Dialog */}
                    <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
                      <DialogContent className='sm:max-w-md'>
                        <DialogHeader>
                          <DialogTitle>How are you feeling now?</DialogTitle>
                          <DialogDescription>
                            Let us know if our recommendations helped improve
                            your mood
                          </DialogDescription>
                        </DialogHeader>

                        {!feedbackSubmitted ? (
                          <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                              <Label>Rate your experience</Label>
                              <div className='flex justify-center space-x-4'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setFeedbackRating(1)}
                                  className={cn(
                                    'rounded-full h-12 w-12',
                                    feedbackRating === 1 &&
                                      'bg-red-100 border-red-500 text-red-500',
                                  )}>
                                  <ThumbsDown className='h-6 w-6' />
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setFeedbackRating(3)}
                                  className={cn(
                                    'rounded-full h-12 w-12',
                                    feedbackRating === 3 &&
                                      'bg-yellow-100 border-yellow-500 text-yellow-500',
                                  )}>
                                  <Meh className='h-6 w-6' />
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setFeedbackRating(5)}
                                  className={cn(
                                    'rounded-full h-12 w-12',
                                    feedbackRating === 5 &&
                                      'bg-green-100 border-green-500 text-green-500',
                                  )}>
                                  <ThumbsUp className='h-6 w-6' />
                                </Button>
                              </div>
                            </div>

                            <div className='space-y-2'>
                              <Label>Your current mood</Label>
                              <div className='flex flex-wrap gap-2'>
                                {moodOptions.map((mood) => (
                                  <Button
                                    key={`feedback-${mood}`}
                                    variant='outline'
                                    size='sm'
                                    onClick={() => setFeedbackMood(mood)}
                                    className={cn(
                                      'rounded-full transition-all',
                                      feedbackMood === mood
                                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                                        : 'hover:bg-purple-100 dark:hover:bg-gray-700',
                                    )}>
                                    {getMoodEmoji(mood)} {mood}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className='space-y-2'>
                              <Label htmlFor='comment'>
                                Additional comments (optional)
                              </Label>
                              <Textarea
                                id='comment'
                                placeholder='Tell us more about your experience...'
                                value={feedbackComment}
                                onChange={(e) =>
                                  setFeedbackComment(e.target.value)
                                }
                              />
                            </div>

                            <DialogFooter className='sm:justify-start'>
                              <Button
                                type='button'
                                variant='default'
                                className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                onClick={submitFeedback}>
                                Submit Feedback
                              </Button>
                              <DialogClose asChild>
                                <Button type='button' variant='outline'>
                                  Skip
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </div>
                        ) : (
                          <div className='py-6 text-center space-y-4'>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                              }}
                              className='w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto'>
                              <CheckCircle className='h-12 w-12 text-green-600 dark:text-green-400' />
                            </motion.div>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                              Thank you for your feedback!
                            </h3>
                            <p className='text-gray-600 dark:text-gray-300'>
                              {getFeedbackMessage()}
                            </p>
                            <Button
                              onClick={() => {
                                setShowFeedback(false);
                                setActiveTab('form');
                              }}
                              className='mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'>
                              Get New Recommendations
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Music className='h-8 w-8 text-gray-400' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                      No active recommendations
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400 mb-6'>
                      Fill out the form to get personalized recommendations
                    </p>
                    <Button onClick={() => setActiveTab('form')}>
                      Get Recommendations
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value='history'>
                {activeTab === 'history-detail' && viewingHistoryItem ? (
                  <div className='space-y-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setActiveTab('history');
                        setViewingHistoryItem(null);
                      }}
                      className='mb-4'>
                      <ArrowLeft className='mr-2 h-4 w-4' /> Back to History
                    </Button>

                    <Card>
                      <CardHeader>
                        <div className='flex justify-between items-start'>
                          <div>
                            <CardTitle>Recommendation Details</CardTitle>
                            <CardDescription>
                              {formatDate(viewingHistoryItem.timestamp)}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              viewingHistoryItem.completed
                                ? 'success'
                                : 'secondary'
                            }>
                            {viewingHistoryItem.completed
                              ? 'Completed'
                              : 'In Progress'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                          <div className='text-center'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              Mental Health
                            </p>
                            <p className='text-xl font-bold'>
                              {viewingHistoryItem.mentalHealth}/5
                            </p>
                          </div>
                          <div className='text-center'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              Happiness
                            </p>
                            <p className='text-xl font-bold'>
                              {viewingHistoryItem.happiness}/5
                            </p>
                          </div>
                          <div className='text-center'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              Mood
                            </p>
                            <p className='text-xl font-bold'>
                              {getMoodEmoji(viewingHistoryItem.mood)}{' '}
                              {viewingHistoryItem.mood}
                            </p>
                          </div>
                        </div>

                        {viewingHistoryItem.feedback && (
                          <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                            <h3 className='font-medium mb-2'>Your Feedback</h3>
                            <div className='grid grid-cols-2 gap-4'>
                              <div>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                  Rating
                                </p>
                                <div className='flex items-center mt-1'>
                                  {viewingHistoryItem.feedback.rating <= 2 && (
                                    <ThumbsDown className='h-5 w-5 text-red-500 mr-1' />
                                  )}
                                  {viewingHistoryItem.feedback.rating === 3 && (
                                    <Meh className='h-5 w-5 text-yellow-500 mr-1' />
                                  )}
                                  {viewingHistoryItem.feedback.rating >= 4 && (
                                    <ThumbsUp className='h-5 w-5 text-green-500 mr-1' />
                                  )}
                                  <span>
                                    {viewingHistoryItem.feedback.rating}/5
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                  Mood After
                                </p>
                                <p className='mt-1'>
                                  {getMoodEmoji(
                                    viewingHistoryItem.feedback.newMood,
                                  )}{' '}
                                  {viewingHistoryItem.feedback.newMood}
                                </p>
                              </div>
                              {viewingHistoryItem.feedback.comment && (
                                <div className='col-span-2 mt-2'>
                                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Comment
                                  </p>
                                  <p className='mt-1 text-sm'>
                                    {viewingHistoryItem.feedback.comment}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <h3 className='font-medium mb-3'>
                            Recommended Songs
                          </h3>
                          <div className='space-y-2'>
                            {viewingHistoryItem.songs.map((song, index) => (
                              <div
                                key={`history-song-${index}`}
                                className={cn(
                                  'flex items-center p-3 rounded-lg border',
                                  song.completed
                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                    : 'border-gray-200 dark:border-gray-700',
                                )}>
                                <div className='h-8 w-8 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-3'>
                                  <Music className='h-4 w-4 text-purple-500 dark:text-purple-400' />
                                </div>
                                <div className='flex-1'>
                                  <p className='font-medium text-sm'>
                                    {song.song_name}
                                  </p>
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Genre: {song.genre}
                                  </p>
                                </div>
                                {song.completed && (
                                  <CheckCircle className='h-5 w-5 text-green-500' />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className='font-medium mb-3'>
                            Recommended Movies
                          </h3>
                          <div className='space-y-2'>
                            {viewingHistoryItem.movies.map((movie, index) => (
                              <div
                                key={`history-movie-${index}`}
                                className={cn(
                                  'flex items-center p-3 rounded-lg border',
                                  movie.completed
                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                    : 'border-gray-200 dark:border-gray-700',
                                )}>
                                <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mr-3'>
                                  <Film className='h-4 w-4 text-blue-500 dark:text-blue-400' />
                                </div>
                                <div className='flex-1'>
                                  <p className='font-medium text-sm'>
                                    {movie.movie_name}
                                  </p>
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Genre: {movie.genre}
                                  </p>
                                </div>
                                {movie.completed && (
                                  <CheckCircle className='h-5 w-5 text-green-500' />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div>
                    <h2 className='text-xl font-bold mb-4'>
                      Your Recommendation History
                    </h2>

                    {recommendationHistory.length > 0 ? (
                      <div className='space-y-4'>
                        {recommendationHistory.map((rec, index) => (
                          <motion.div
                            key={`history-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}>
                            <Card
                              className='hover:shadow-md transition-shadow cursor-pointer'
                              onClick={() => viewHistoryItem(rec)}>
                              <CardContent className='p-0'>
                                <div className='p-4'>
                                  <div className='flex justify-between items-start mb-2'>
                                    <div className='flex items-center'>
                                      <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mr-3'>
                                        <span className='text-white text-lg'>
                                          {getMoodEmoji(rec.mood)}
                                        </span>
                                      </div>
                                      <div>
                                        <h3 className='font-medium'>
                                          {rec.mood} Recommendations
                                        </h3>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                          {formatDate(rec.timestamp)}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge
                                      variant={
                                        rec.completed ? 'success' : 'secondary'
                                      }>
                                      {rec.completed
                                        ? 'Completed'
                                        : 'In Progress'}
                                    </Badge>
                                  </div>

                                  <div className='flex items-center justify-between mt-4 text-sm'>
                                    <div className='flex items-center'>
                                      <Music className='h-4 w-4 mr-1 text-purple-500' />
                                      <span>{rec.songs.length} songs</span>
                                    </div>
                                    <div className='flex items-center'>
                                      <Film className='h-4 w-4 mr-1 text-blue-500' />
                                      <span>{rec.movies.length} movies</span>
                                    </div>
                                    {rec.feedback && (
                                      <div className='flex items-center'>
                                        {rec.feedback.rating <= 2 && (
                                          <ThumbsDown className='h-4 w-4 mr-1 text-red-500' />
                                        )}
                                        {rec.feedback.rating === 3 && (
                                          <Meh className='h-4 w-4 mr-1 text-yellow-500' />
                                        )}
                                        {rec.feedback.rating >= 4 && (
                                          <ThumbsUp className='h-4 w-4 mr-1 text-green-500' />
                                        )}
                                        <span>
                                          Rated {rec.feedback.rating}/5
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow'>
                        <History className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                          No recommendation history
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 mb-6'>
                          Get your first recommendation to start building your
                          history
                        </p>
                        <Button onClick={() => setActiveTab('form')}>
                          Get Recommendations
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Toast notifications */}
      <Toaster />

      {/* CSS for confetti animation */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}
