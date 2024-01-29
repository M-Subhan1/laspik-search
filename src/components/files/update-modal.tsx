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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UpdateFileData, updateFileSchema } from '@/schema/file';

const UpdateFileModal = ({
  open,
  isLoading,
  defaultValues,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isLoading: boolean;
  defaultValues: UpdateFileData;
  onClose: () => void;
  onSubmit: (data: UpdateFileData) => void;
}) => {
  const form = useForm<UpdateFileData>({
    resolver: zodResolver(updateFileSchema),
    defaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-2'
      >
        <DialogContent className='sm:max-w-[425px]'>
          <Form {...form}>
            <DialogHeader>
              <DialogTitle>Update File</DialogTitle>
              <DialogDescription>
                Update File Details here. Click Update when done.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                type='submit'
              >
                {isLoading && <Loader className='mr-2 w-4 h-4 animate-spin' />}
                Update
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export { UpdateFileModal };
