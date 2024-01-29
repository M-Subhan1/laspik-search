'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CommandEmpty } from 'cmdk';
import { CheckIcon, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { useFetchGroups } from '@/hooks/useFetchGroups';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ProfileData, profileSchema } from '@/schema/profile';

const dictionary = {
  create: {
    title: 'Create Profile',
    description: "Add profile details here. Click save when you're done.",
    cta: 'Create Profile',
  },
  update: {
    title: 'Update Profile',
    description: 'Update profile details here. Click save when you are done.',
    cta: 'Update Profile',
  },
};

export const UpsertProfileDialog = ({
  defaultValues,
  open,
  isLoading,
  onClose,
  onSubmit,
}: {
  defaultValues?: ProfileData;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (profile: ProfileData) => void;
}) => {
  const [groupQuery, setGroupQuery] = useState('');
  const getGroups = useFetchGroups();
  const [selected, setSelected] = useState<string | undefined>(
    defaultValues?.group_id
  );

  const groups = Array.from(
    new Set(
      (getGroups.data ?? [])
        .concat(selected ? [{ name: selected, created_at: '' }] : [])
        .map((g) => g.name)
    )
  );

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
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
              name='group_id'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2.5'>
                  <FormLabel>Group</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {selected || 'Select group'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0 self-start'>
                      <Command>
                        <CommandInput
                          onValueChange={setGroupQuery}
                          placeholder='Search Group...'
                        />
                        <CommandEmpty />
                        <CommandGroup>
                          {groups.map((group) => (
                            <CommandItem
                              value={group}
                              key={group}
                              onSelect={() => {
                                form.setValue('group_id', group);
                                setSelected(group);
                              }}
                            >
                              {group}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  group === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                          {!!groupQuery && selected !== groupQuery && (
                            <CommandItem
                              value={groupQuery}
                              key={groupQuery}
                              onSelect={() => {
                                form.setValue('group_id', groupQuery);
                                setSelected(groupQuery);
                              }}
                            >
                              Create {groupQuery}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
