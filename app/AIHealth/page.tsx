'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Bot,
  Brain,
  CircleAlert,
  ClipboardCheck,
  ClipboardPlus,
  Clock,
  Cross,
  Divide,
  Microscope,
  PlusCircle,
  Send,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { markdown } from 'markdown';

export default function AiHealth() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'bot'; text: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen grid grid-rows-[70px_auto]'>
      <nav className='shadow-lg flex flex-row items-center px-5 gap-3 relative sm:px-40'>
        <div className='bg-blue-500 p-2 rounded-2xl'>
          <Brain color='white' size={35} />
        </div>
        <div className='flex flex-col'>
          <div className='text-blue-500 font-bold text-2xl text-nowrap'>
            HealthAI Assistant
          </div>
          <div className='text-blue-400 text-sm text-nowrap'>
            Your 24/7 Health Companion
          </div>
        </div>
        <Link
          href='/'
          className='ml-auto rounded-3xl hover:bg-gray-100 p-3 cursor-pointer'>
          <X size={30} />
        </Link>
      </nav>

      <div className='flex flex-row items-center justify-center bg-blue-50'>
        <div className='ml-3 max-w-[1000px] w-[90%] max-h-[600px] h-[90%] bg-white shadow-lg rounded-3xl flex flex-col overflow-hidden'>
          <div className='bg-blue-400 py-3 items-center flex flex-row px-10 gap-5'>
            <div className='bg-blue-300 p-2 rounded-2xl'>
              <Bot size={30} color='white' />
            </div>
            <div className='flex flex-col'>
              <div className='text-lg font-bold text-white text-nowrap'>
                AI Health Assistant
              </div>
              <div className='flex flex-row items-center gap-2 flex-nowrap'>
                <span className='flex h-2.5 w-2.5 rounded-full bg-green-600 animate-pulse border-1 border-green-800'></span>
                <div className='flex flex-row text-white items-center flex-nowrap'>
                  Online
                  <div className='mx-2 h-1 w-1 bg-white rounded-sm text-nowrap'></div>
                  Ready to help
                </div>
              </div>
            </div>
          </div>

          <div
            className='flex-1 overflow-y-auto p-6 space-y-4'
            style={{ scrollBehavior: 'smooth' }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl max-w-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white self-end ml-auto'
                      : 'bg-gray-200 text-gray-900 self-start mr-auto'
                  }`}>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: markdown.toHTML(msg.text),
                    }}></p>
                </div>
              ))
            ) : (
              <div className='m-auto rounded-xl h-full flex items-center justify-start flex-col'>
                <DotLottieReact
                  src='https://lottie.host/1f71738d-8adc-4255-acfe-f626d62343ae/8xcwvNMhRi.lottie'
                  loop
                  autoplay
                  className='object-cover h-[150px] sm:h-[300px]'
                />
                <div className='text-2xl font-bold text-center text-blue-500 max-w-[400px] w-full'>
                  Your AI Health Assistant is Ready for your Queries
                </div>
              </div>
            )}

            {loading && (
              <div
                className='flex items-center space-x-2 
              place-self-start self-start bg-gray-200 text-gray-900 px-4 py-2 rounded-xl animate-pulse'>
                <span className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'></span>
                <span className='w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100'></span>
                <span className='w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200'></span>
                <span className='text-sm'>AI is typing...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className='border-t border-gray-100 p-4 bg-white/50 backdrop-blur-sm'>
            <div className='flex items-center space-x-4 max-w-4xl mx-auto'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type your health concern...'
                className='flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200/20 bg-white/80 placeholder-gray-400 transition-all duration-200 outline-none'
              />
              <button
                type='submit'
                className='bg-gradient-to-r from-blue-300 to-blue-400 text-white rounded-xl p-3 hover:shadow-lg hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2'>
                <Send className='h-5 w-5' />
              </button>
            </div>
          </form>
        </div>
        <div className='lg:max-w-[400px] max-w-[350px] w-full max-h-[600px] h-[90%] md:flex hidden sm flex-col'>
          <div className='m-3 rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-3'>
            <div className='flex flex-row items-center text-[25px] gap-2'>
              <Clock color='blue' />
              Quick Actions
            </div>
            {[
              {
                icon: <ClipboardPlus color='blue' />,
                text: 'Meal Planner',
                link: '/meal',
              },
              {
                icon: <Microscope color='blue' />,
                text: 'AI-Powered Diagnostics',
                link: '/diagnostics',
              },
              {
                icon: <Bot color='blue' />,
                text: 'Mental Health Support',
                link: '/AI',
              },

              {
                icon: <ClipboardCheck color='blue' />,
                text: 'Daily Health Tracking',
                link: '/dailyhealth',
              },
            ].map((service, index) => (
              <Link
                href={service.link}
                key={index}
                className='bg-blue-50 rounded-xl gap-4 p-3 flex flex-row items-center text-[18px] 
                   hover:bg-blue-100 hover:shadow-lg transition-all duration-200 cursor-pointer 
                   border border-gray-100 hover:border-blue-400'>
                {service.icon}
                {service.text}
              </Link>
            ))}
          </div>
          <Link
            href='/emergency'
            className='mx-3 rounded-2xl bg-red-400 hover:bg-red-500 shadow-xl p-4 flex flex-row transition-all duration-200 cursor-pointer border border-blue-200 hover:border-red-600 text-[18px] gap-4 text-white'>
            <PlusCircle color='white' />
            <div className='flex flex-col'>
              <div className='font-bold'>Emergency Assistance</div>
              <div>Quick access to emergency services</div>
            </div>
          </Link>
          <div className='bg-teal-400 p-4 m-3 rounded-2xl flex flex-row text-[18px] gap-4'>
            <CircleAlert color='white' />
            <div className='text-white'>
              Information and guidance <br /> may not always be accurate <br />{' '}
              or personalized.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
