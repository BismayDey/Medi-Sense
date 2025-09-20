'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Copy,
  Check,
  Trash2,
  Moon,
  Sun,
  Menu,
  X,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { auth, database } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, onValue, update, remove } from 'firebase/database';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
};

type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          if (
            process.env.NODE_ENV === 'development' ||
            window.location.hostname.includes('vercel.app')
          ) {
            setUser({
              uid: 'preview-user-id',
              email: 'preview@example.com',
              displayName: 'Preview User',
            });
          } else {
            router.push('/auth');
          }
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Auth state change error:', error);
      setUser({
        uid: 'preview-user-id',
        email: 'preview@example.com',
        displayName: 'Preview User',
      });
    }
  }, [router]);

  // Load chat sessions from Firebase
  useEffect(() => {
    if (!user) return;

    try {
      const sessionsRef = ref(database, `chats/${user.uid}/sessions`);

      const unsubscribe = onValue(
        sessionsRef,
        (snapshot) => {
          try {
            const data = snapshot.val();

            if (!data) {
              if (
                process.env.NODE_ENV === 'development' ||
                window.location.hostname.includes('vercel.app')
              ) {
                const mockSessions = [
                  {
                    id: 'preview-session',
                    title: 'Preview Chat',
                    lastMessage: 'This is a preview chat session',
                    timestamp: Date.now(),
                    messages: [],
                  },
                ];
                setChatSessions(mockSessions);
                if (!activeChatId) {
                  setActiveChatId('preview-session');
                }
              }
              return;
            }

            const sessionsList = Object.entries(data).map(
              ([id, sessionData]: [string, any]) => ({
                id,
                title: sessionData.title || 'New Chat',
                lastMessage: sessionData.lastMessage || '',
                timestamp: sessionData.timestamp || Date.now(),
                messages: sessionData.messages
                  ? Object.values(sessionData.messages)
                  : [],
              }),
            );

            sessionsList.sort((a, b) => b.timestamp - a.timestamp);
            setChatSessions(sessionsList);

            if (!activeChatId && sessionsList.length > 0) {
              setActiveChatId(sessionsList[0].id);
              setMessages(sessionsList[0].messages);
            }
          } catch (error) {
            console.error('Error processing chat sessions:', error);
          }
        },
        (error) => {
          console.error('Database error:', error);
          if (
            process.env.NODE_ENV === 'development' ||
            window.location.hostname.includes('vercel.app')
          ) {
            const mockSessions = [
              {
                id: 'preview-session',
                title: 'Preview Chat',
                lastMessage: 'This is a preview chat session',
                timestamp: Date.now(),
                messages: [],
              },
            ];
            setChatSessions(mockSessions);
            if (!activeChatId) {
              setActiveChatId('preview-session');
            }
          }
        },
      );

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Setting up database listener error:', error);
      if (
        process.env.NODE_ENV === 'development' ||
        window.location.hostname.includes('vercel.app')
      ) {
        const mockSessions = [
          {
            id: 'preview-session',
            title: 'Preview Chat',
            lastMessage: 'This is a preview chat session',
            timestamp: Date.now(),
            messages: [],
          },
        ];
        setChatSessions(mockSessions);
        if (!activeChatId) {
          setActiveChatId('preview-session');
        }
      }
    }
  }, [user, activeChatId]);

  // Load messages when active chat changes
  useEffect(() => {
    if (!user || !activeChatId) return;

    try {
      const messagesRef = ref(
        database,
        `chats/${user.uid}/sessions/${activeChatId}/messages`,
      );

      const unsubscribe = onValue(
        messagesRef,
        (snapshot) => {
          try {
            const data = snapshot.val();

            if (!data) {
              if (
                process.env.NODE_ENV === 'development' ||
                window.location.hostname.includes('vercel.app')
              ) {
                const introMessage = {
                  id: generateId(),
                  content: `👋 Hello${
                    user.displayName ? `, ${user.displayName}` : ''
                  }! I'm Dr. Groq, your friendly AI doctor 🤖. I'm here to help you with your health-related questions. What can I assist you with today?`,
                  sender: 'bot',
                  timestamp: Date.now(),
                };
                setMessages([introMessage]);
              }
              return;
            }

            const messagesList = Object.values(data) as Message[];
            messagesList.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(messagesList);
          } catch (error) {
            console.error('Error processing messages:', error);
          }
        },
        (error) => {
          console.error('Database error:', error);
          if (
            process.env.NODE_ENV === 'development' ||
            window.location.hostname.includes('vercel.app')
          ) {
            const introMessage = {
              id: generateId(),
              content: `👋 Hello${
                user.displayName ? `, ${user.displayName}` : ''
              }! I'm Dr. Groq, your friendly AI doctor 🤖. I'm here to help you with your health-related questions. What can I assist you with today?`,
              sender: 'bot',
              timestamp: Date.now(),
            };
            setMessages([introMessage]);
          }
        },
      );

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Setting up messages listener error:', error);
      if (
        process.env.NODE_ENV === 'development' ||
        window.location.hostname.includes('vercel.app')
      ) {
        const introMessage = {
          id: generateId(),
          content: `👋 Hello${
            user.displayName ? `, ${user.displayName}` : ''
          }! I'm Dr. Groq, your friendly AI doctor 🤖. I'm here to help you with your health-related questions. What can I assist you with today?`,
          sender: 'bot',
          timestamp: Date.now(),
        };
        setMessages([introMessage]);
      }
    }
  }, [user, activeChatId, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Create intro message when starting a new chat
  useEffect(() => {
    if (user && activeChatId === 'new') {
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: 'New Chat',
        lastMessage: '',
        timestamp: Date.now(),
        messages: [],
      };

      const chatRef = ref(database, `chats/${user.uid}/sessions/${newChatId}`);
      set(chatRef, newChat);

      setActiveChatId(newChatId);

      const introMessage = {
        id: generateId(),
        content: `👋 Hello${
          user.displayName ? `, ${user.displayName}` : ''
        }! I'm Dr. Groq, your friendly AI doctor 🤖. I'm here to help you with your health-related questions. What can I assist you with today?`,
        sender: 'bot',
        timestamp: Date.now(),
      };

      const messageRef = ref(
        database,
        `chats/${user.uid}/sessions/${newChatId}/messages/${introMessage.id}`,
      );
      set(messageRef, introMessage);

      update(ref(database, `chats/${user.uid}/sessions/${newChatId}`), {
        lastMessage: introMessage.content,
        timestamp: Date.now(),
      });
    }
  }, [user, activeChatId]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const formatDate = (timestamp: number) => {
    const now = new Date();
    const messageDate = new Date(timestamp);

    if (messageDate.toDateString() === now.toDateString()) {
      return 'Today';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return format(messageDate, 'MMM d, yyyy');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);

    toast({
      description: 'Message copied to clipboard',
      duration: 2000,
    });
  };

  const createNewChat = () => {
    setActiveChatId('new');
    setMessages([]);
    setIsMobileMenuOpen(false);
  };

  const switchChat = (chatId: string) => {
    setActiveChatId(chatId);
    const chat = chatSessions.find((session) => session.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
    setIsMobileMenuOpen(false);
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) return;

    const chatRef = ref(database, `chats/${user.uid}/sessions/${chatId}`);
    remove(chatRef);

    if (activeChatId === chatId) {
      if (chatSessions.length > 1) {
        const otherChat = chatSessions.find((session) => session.id !== chatId);
        if (otherChat) {
          setActiveChatId(otherChat.id);
        } else {
          createNewChat();
        }
      } else {
        createNewChat();
      }
    }

    toast({
      description: 'Chat deleted',
      duration: 2000,
    });
  };

  const clearChat = () => {
    if (!user || !activeChatId) return;

    const messagesRef = ref(
      database,
      `chats/${user.uid}/sessions/${activeChatId}/messages`,
    );
    remove(messagesRef);

    const introMessage = {
      id: generateId(),
      content: 'Chat history cleared. How can I assist you today?',
      sender: 'bot',
      timestamp: Date.now(),
    };

    const messageRef = ref(
      database,
      `chats/${user.uid}/sessions/${activeChatId}/messages/${introMessage.id}`,
    );
    set(messageRef, introMessage);

    update(ref(database, `chats/${user.uid}/sessions/${activeChatId}`), {
      lastMessage: introMessage.content,
      timestamp: Date.now(),
    });

    toast({
      description: 'Chat cleared',
      duration: 2000,
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  async function sendMessage() {
    const message = input.trim();
    if (!message || !user || !activeChatId) {
      console.warn('Missing required fields:', { message, user, activeChatId });
      return;
    }

    const newMessageId = generateId();
    const userMessage: Message = {
      id: newMessageId,
      content: message,
      sender: 'user', // Explicit type for sender
      timestamp: Date.now(),
    };

    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Firebase operations
    try {
      const messageRef = ref(
        database,
        `chats/${user.uid}/sessions/${activeChatId}/messages/${newMessageId}`,
      );
      await set(messageRef, userMessage);

      const updates = {
        lastMessage: message,
        timestamp: Date.now(),
      };

      if (messages.length <= 1) {
        updates.title =
          message.length > 30 ? `${message.substring(0, 30)}...` : message;
      }

      await update(
        ref(database, `chats/${user.uid}/sessions/${activeChatId}`),
        updates,
      );
    } catch (error) {
      console.error('Firebase operation error:', error);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: message }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: `HTTP error ${res.status}` };
        }
        throw new Error(
          errorData.error || errorData.message || 'AI service error',
        );
      }

      const data = await res.json();
      const botMessage: Message = {
        id: generateId(),
        content: data?.response || 'The AI did not provide a response.',
        sender: 'bot', // Explicit type for sender
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);

      const botMessageRef = ref(
        database,
        `chats/${user.uid}/sessions/${activeChatId}/messages/${botMessage.id}`,
      );
      await set(botMessageRef, botMessage);

      await update(
        ref(database, `chats/${user.uid}/sessions/${activeChatId}`),
        {
          lastMessage: botMessage.content,
          timestamp: Date.now(),
        },
      );
    } catch (err) {
      console.error('API request error:', err);

      let errorContent = 'An error occurred.';
      if (err instanceof Error) {
        errorContent =
          err.message.includes('500') || err.name === 'AbortError'
            ? 'Our AI service is temporarily unavailable. Please try again later.'
            : `Error: ${err.message}`;
      }

      const errorMessage: Message = {
        id: generateId(),
        content: errorContent,
        sender: 'bot', // Explicit type for sender
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      try {
        const errorMessageRef = ref(
          database,
          `chats/${user.uid}/sessions/${activeChatId}/messages/${errorMessage.id}`,
        );
        await set(errorMessageRef, errorMessage);

        await update(
          ref(database, `chats/${user.uid}/sessions/${activeChatId}`),
          {
            lastMessage: errorMessage.content,
            timestamp: Date.now(),
          },
        );
      } catch (firebaseError) {
        console.error('Firebase error handling failed:', firebaseError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='animate-pulse text-center'>
          <div className='mb-4 h-12 w-12 rounded-full bg-blue-100 mx-auto'></div>
          <p className='text-slate-500'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div
        className={cn(
          'flex h-screen w-screen overflow-hidden transition-colors duration-300',
          isDarkMode
            ? 'bg-slate-900 text-white'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50',
        )}>
        {/* Sidebar for desktop */}
        <Sidebar
          className='hidden md:flex h-full'
          variant='floating'
          collapsible='icon'>
          <SidebarHeader
            className={cn(
              'p-4 flex flex-col gap-2 border-b',
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200',
            )}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold'>
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium text-sm truncate max-w-[120px]'>
                    {user.displayName || user.email}
                  </span>
                  <span
                    className={cn(
                      'text-xs',
                      isDarkMode ? 'text-slate-400' : 'text-slate-500',
                    )}>
                    Online
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewChat}
              className={cn(
                'flex items-center gap-2 w-full p-2 rounded-lg text-sm font-medium',
                isDarkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
              )}>
              <Plus className='h-4 w-4' />
              <span>New Chat</span>
            </motion.button>
          </SidebarHeader>

          <SidebarContent
            className={cn(
              'flex-1 overflow-y-auto',
              isDarkMode ? 'bg-slate-800' : 'bg-white',
            )}>
            <SidebarMenu>
              {chatSessions.map((chat) => (
                <SidebarMenuItem key={chat.id} className='relative'>
                  <SidebarMenuButton
                    onClick={() => switchChat(chat.id)}
                    isActive={activeChatId === chat.id}
                    className='group'>
                    <MessageSquare className='h-4 w-4 flex-shrink-0' />
                    <div className='flex flex-col min-w-0'>
                      <span className='font-medium truncate'>{chat.title}</span>
                      <span
                        className={cn(
                          'text-xs truncate',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500',
                        )}>
                        {formatDate(chat.timestamp)}
                      </span>
                    </div>
                  </SidebarMenuButton>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full',
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200',
                    )}>
                    <Trash2 className='h-3 w-3' />
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 z-40 md:hidden'
              onClick={toggleMobileMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'fixed top-0 left-0 h-full w-[280px] z-50 md:hidden overflow-y-auto flex flex-col',
                isDarkMode ? 'bg-slate-800' : 'bg-white',
              )}>
              <div className='p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold'>
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-medium text-sm truncate max-w-[180px]'>
                      {user.displayName || user.email}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        isDarkMode ? 'text-slate-400' : 'text-slate-500',
                      )}>
                      Online
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className={cn(
                    'p-2 rounded-full',
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
                  )}>
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='p-4'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNewChat}
                  className={cn(
                    'flex items-center gap-2 w-full p-2 rounded-lg text-sm font-medium',
                    isDarkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
                  )}>
                  <Plus className='h-4 w-4' />
                  <span>New Chat</span>
                </motion.button>
              </div>

              <div className='flex-1 overflow-y-auto px-2 pb-4'>
                {chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => switchChat(chat.id)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg cursor-pointer relative group',
                      activeChatId === chat.id
                        ? isDarkMode
                          ? 'bg-slate-700'
                          : 'bg-slate-100'
                        : isDarkMode
                        ? 'hover:bg-slate-700'
                        : 'hover:bg-slate-100',
                    )}>
                    <MessageSquare className='h-4 w-4 flex-shrink-0' />
                    <div className='flex flex-col min-w-0'>
                      <span className='font-medium truncate'>{chat.title}</span>
                      <span
                        className={cn(
                          'text-xs truncate',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500',
                        )}>
                        {formatDate(chat.timestamp)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className={cn(
                        'absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full',
                        isDarkMode
                          ? 'hover:bg-slate-600'
                          : 'hover:bg-slate-200',
                      )}>
                      <Trash2 className='h-3 w-3' />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className='flex-1 flex flex-col h-full overflow-hidden'>
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'p-4 flex items-center justify-between border-b backdrop-blur-md z-10',
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 shadow-lg shadow-slate-900/20'
                : 'bg-white/80 border-slate-200 shadow-md',
            )}>
            <div className='flex items-center'>
              <button
                onClick={toggleMobileMenu}
                className={cn(
                  'mr-3 p-2 rounded-full md:hidden',
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
                )}>
                <Menu className='h-5 w-5' />
              </button>

              <SidebarTrigger className='hidden md:flex mr-3' />

              <Link href='/' className='mr-4'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
                  )}
                  aria-label='Go back'>
                  <ArrowLeft
                    className={cn(
                      'h-5 w-5',
                      isDarkMode ? 'text-white' : 'text-slate-700',
                    )}
                  />
                </motion.button>
              </Link>

              <div className='flex items-center'>
                <div className='relative mr-3'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold'>
                    G
                  </div>
                  <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800'></span>
                </div>
                <div>
                  <h1
                    className={cn(
                      'text-xl font-semibold',
                      isDarkMode ? 'text-white' : 'text-slate-800',
                    )}>
                    Dr. Groq AI
                  </h1>
                  <p
                    className={cn(
                      'text-xs',
                      isDarkMode ? 'text-slate-400' : 'text-slate-500',
                    )}>
                    Online • Powered by Groq LLM
                  </p>
                </div>
              </div>
            </div>

            <div className='flex space-x-2'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
                )}
                aria-label='Clear chat'>
                <Trash2
                  className={cn(
                    'h-5 w-5',
                    isDarkMode ? 'text-white' : 'text-slate-700',
                  )}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
                )}
                aria-label={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }>
                {isDarkMode ? (
                  <Sun className='h-5 w-5 text-yellow-300' />
                ) : (
                  <Moon className='h-5 w-5 text-slate-700' />
                )}
              </motion.button>
            </div>
          </motion.header>

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className={cn(
              'flex-1 p-4 overflow-y-auto flex flex-col space-y-4 scroll-smooth',
              isDarkMode ? 'scrollbar-dark' : 'scrollbar-light',
            )}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex items-start gap-3 group',
                    message.sender === 'user' ? 'justify-end' : 'justify-start',
                  )}>
                  {message.sender === 'bot' && (
                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold mt-1'>
                      G
                    </div>
                  )}

                  <div className='flex flex-col max-w-[80%] md:max-w-[70%]'>
                    <div
                      className={cn(
                        'p-4 rounded-2xl shadow-sm',
                        message.sender === 'user'
                          ? isDarkMode
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-none'
                          : isDarkMode
                          ? 'bg-slate-800 text-white rounded-tl-none border border-slate-700'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-100',
                      )}>
                      <p className='whitespace-pre-wrap break-words'>
                        {message.content}
                      </p>
                    </div>

                    <div className='flex items-center mt-1 text-xs'>
                      <span
                        className={cn(
                          'text-xs',
                          isDarkMode ? 'text-slate-400' : 'text-slate-500',
                        )}>
                        {formatTime(message.timestamp)}
                      </span>

                      {message.sender === 'bot' && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            copyToClipboard(message.content, message.id)
                          }
                          className={cn(
                            'ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
                            isDarkMode
                              ? 'hover:bg-slate-700'
                              : 'hover:bg-slate-100',
                          )}
                          aria-label='Copy to clipboard'>
                          {copiedMessageId === message.id ? (
                            <Check className='h-3 w-3 text-green-500' />
                          ) : (
                            <Copy
                              className={cn(
                                'h-3 w-3',
                                isDarkMode
                                  ? 'text-slate-400'
                                  : 'text-slate-500',
                              )}
                            />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold mt-1'>
                      {user.displayName
                        ? user.displayName.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold mt-1'>
                  G
                </div>

                <div
                  className={cn(
                    'p-4 rounded-2xl rounded-tl-none',
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-white border border-slate-100 shadow-sm',
                  )}>
                  <div className='flex space-x-2 items-center h-6'>
                    <div className='typing-dot'></div>
                    <div className='typing-dot'></div>
                    <div className='typing-dot'></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              'p-4 border-t',
              isDarkMode
                ? 'bg-slate-800/80 backdrop-blur-md border-slate-700'
                : 'bg-white/80 backdrop-blur-md border-slate-200',
            )}>
            <div
              className={cn(
                'flex items-end rounded-xl p-2 transition-all',
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600'
                  : 'bg-slate-50 border border-slate-200',
              )}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder='Type your message...'
                className={cn(
                  'flex-1 resize-none p-2 outline-none bg-transparent',
                  isDarkMode
                    ? 'text-white placeholder:text-slate-400'
                    : 'text-slate-800 placeholder:text-slate-400',
                )}
                style={{ minHeight: '44px', maxHeight: '150px' }}
                rows={1}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={cn(
                  'ml-2 p-3 rounded-full transition-colors',
                  input.trim()
                    ? isDarkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                    : isDarkMode
                    ? 'bg-slate-600 text-slate-400'
                    : 'bg-slate-200 text-slate-400',
                )}>
                <Send className='h-5 w-5' />
              </motion.button>
            </div>

            <div
              className={cn(
                'text-xs mt-2 text-center',
                isDarkMode ? 'text-slate-500' : 'text-slate-400',
              )}>
              Dr. Groq provides general information, not medical advice. Consult
              a healthcare professional for medical concerns.
            </div>
          </motion.div>

          {/* CSS for typing animation */}
          <style jsx global>{`
            @keyframes blink {
              0%,
              100% {
                opacity: 0.2;
                transform: translateY(0);
              }
              50% {
                opacity: 1;
                transform: translateY(-2px);
              }
            }

            .typing-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${isDarkMode ? '#6366f1' : '#4f46e5'};
              animation: blink 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
              animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
              animation-delay: 0.4s;
            }

            .scrollbar-light::-webkit-scrollbar {
              width: 6px;
            }

            .scrollbar-light::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.05);
              border-radius: 10px;
            }

            .scrollbar-light::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.1);
              border-radius: 10px;
            }

            .scrollbar-light::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.2);
            }

            .scrollbar-dark::-webkit-scrollbar {
              width: 6px;
            }

            .scrollbar-dark::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 10px;
            }

            .scrollbar-dark::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }

            .scrollbar-dark::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}</style>
        </div>
      </div>
    </SidebarProvider>
  );
}
