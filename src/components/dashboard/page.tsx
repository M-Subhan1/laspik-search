import { Loader } from 'lucide-react';

import { ScrollArea } from '../ui/scroll-area';

type PageProps = {
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
};

export default function Page({
  title,
  toolbar,
  footer,
  children,
  isLoading = false,
}: PageProps) {
  return (
    <div className='absolute inset-12 flex flex-col bg-white'>
      {(title || toolbar) && (
        <div className='flex w-full items-center justify-between border-b border-zinc-200 px-5 py-2 dark:border-zinc-800'>
          <div className='text-2xl font-semibold'>{title}</div>
          {toolbar}
        </div>
      )}
      <div className='flex h-px w-full flex-1 basis-0 overflow-hidden'>
        {isLoading ? (
          <Loader className='mx-auto animate-spin self-center' />
        ) : (
          <ScrollArea className='h-full flex flex-col w-full overflow-hidden'>
            {children}
          </ScrollArea>
        )}
      </div>
      {footer && (
        <div className='justify-self-end border-t border-zinc-200 px-5 py-2 dark:border-zinc-800'>
          {footer}
        </div>
      )}
    </div>
  );
}
