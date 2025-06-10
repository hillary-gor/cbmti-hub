'use client';

import { useState } from 'react';
import { sendResetPasswordEmail } from './actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await sendResetPasswordEmail(formData);

    setStatus(result.success ? 'sent' : 'error');
    setMessage(result.message);
    setShowDialog(true);
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400"
          />
          <Button type="submit" className="w-full bg-[#329EE8] text-white">
            Send Reset Link
          </Button>
        </form>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {status === 'sent' ? 'Success' : 'Something went wrong'}
            </DialogTitle>
            <DialogDescription className={status === 'sent' ? 'text-green-600' : 'text-red-600'}>
              {message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
