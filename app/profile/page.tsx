'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { User, Save } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL,
        updatedAt: new Date().toISOString(),
      });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4'>
      <div className='container max-w-2xl mx-auto py-8'>
        <Card className='p-8 space-y-6 bg-white/90 backdrop-blur-sm'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={photoURL || ''} alt={displayName || 'User'} />
              <AvatarFallback>
                <User className='h-10 w-10' />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-2xl font-bold'>
                {displayName || 'Your Profile'}
              </h1>
              <p className='text-gray-500'>{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='displayName'>Display Name</Label>
              <Input
                id='displayName'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Enter your display name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='photoURL'>Profile Photo URL</Label>
              <Input
                id='photoURL'
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder='Enter photo URL'
              />
            </div>

            {error && <p className='text-sm text-red-600'>{error}</p>}
            {success && <p className='text-sm text-green-600'>{success}</p>}

            <Button type='submit' disabled={loading} className='w-full'>
              <Save className='mr-2 h-4 w-4' />
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
