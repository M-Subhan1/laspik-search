'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { UpsertFileData, upsertFileSchema } from '@/schema/file';

const dictionary = {
  create: {
    title: 'Upload File',
    description: "Add file details here. Click save when you're done.",
    cta: 'Upload File',
  },
  update: {
    title: 'Update File',
    description: 'Update file details here. Click save when you are done.',
    cta: 'Update File',
  },
};

export const UpsertFileDialog = ({
  defaultValues,
  open,
  isLoading,
  onClose,
  onSubmit,
}: {
  defaultValues?: UpsertFileData;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (profile: UpsertFileData) => void;
}) => {
  // const [fileList, setFileList] = useState<FileList>();

  const form = useForm<UpsertFileData>({
    resolver: zodResolver(upsertFileSchema),
    defaultValues,
  });

  const content = dictionary[defaultValues ? 'update' : 'create'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-2'
      >
        <DialogContent className='sm:max-w-[425px]'>
          <Form {...form}>
            <DialogHeader>
              <DialogTitle>{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                type='submit'
              >
                {isLoading && <Loader className='mr-2 w-4 h-4 animate-spin' />}
                {content.cta}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
};
