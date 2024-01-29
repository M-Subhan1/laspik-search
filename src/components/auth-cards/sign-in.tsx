'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useSignIn } from '@/hooks/useSignIn';

import NextImage from '@/components/NextImage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { SignInFormValues, signInSchema } from '@/schema/auth';

import Logo from '~/logo.png';

export default function SignInCard() {
  const router = useRouter();
  const signIn = useSignIn();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (fieldValues: SignInFormValues) => {
    const { data, error } = await signIn.mutateAsync(fieldValues);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      toast.success('Signed in successfully. Redirecting...');
      router.push('/dashboard');
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-sm flex flex-col gap-3 items-start justify-center w-full'
      >
        <div className='rounded-lg self-center w-full px-4 bg-black flex items-center justify-center'>
          <NextImage width={200} height={100} src={Logo} alt='Logo' />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='self-end items-center'
          disabled={signIn.isPending}
        >
          {signIn.isPending && (
            <Loader width={16} height={16} className='animate-spin mr-1' />
          )}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
