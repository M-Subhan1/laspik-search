'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UploadFilesData, uploadFilesSchema } from '@/schema/file';

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

const CreateFileDialog = ({
  open,
  isLoading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: ({
    status,
    files,
  }: {
    status: UploadFilesData['status'];
    files: File[];
  }) => void;
}) => {
  const [files, setFiles] = useState<File[]>();

  const form = useForm<UploadFilesData>({
    resolver: zodResolver(uploadFilesSchema),
    defaultValues: {
      status: 'pending',
      files: [],
    },
  });

  const content = dictionary['create'];

  const handleSubmit = async (fieldValues: UploadFilesData) => {
    files &&
      onSubmit({
        status: fieldValues.status,
        files,
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='pending'>Processing</SelectItem>
                      <SelectItem value='processed'>Processed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='files'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      multiple
                      max={5}
                      accept='application/pdf'
                      onChange={(e) => {
                        if (!e.target.files) return;

                        const files = Array.from(e.target.files);

                        field.onChange(files.map((f) => f.name));
                        setFiles(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                onClick={form.handleSubmit(handleSubmit)}
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

export { CreateFileDialog };
