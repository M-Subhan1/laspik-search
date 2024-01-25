'use client';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Loader } from 'lucide-react';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';

import { useDeleteFiles } from '@/hooks/useDeleteFiles';
import { useFetchFiles } from '@/hooks/useFetchFiles';
import { useFetchProfile } from '@/hooks/useFetchProfile';

import Page from '@/components/dashboard/page';
import { getColumns } from '@/components/files/columns';
import { DataTableToolbar } from '@/components/files/toolbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table/pagination';

import { File } from '@/types';

type Mode = 'view' | 'create' | 'edit' | 'delete' | 'bulk_delete';

type PageProps = {
  params: {
    profileId: string;
  };
};

export default function ViewFiles({ params }: PageProps) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);

  const [selected, setSelected] = React.useState<File>();
  const [mode, setMode] = React.useState<Mode>('view');
  const [query, setQuery] = React.useState('');
  const [debouncedQuery] = useDebounce(query, 250);
  const profileId = z.coerce.number().int().parse(params.profileId);

  // const upsertProfile = useUpsertProfile();
  const deleteProfiles = useDeleteFiles();
  const fetchProfile = useFetchProfile({
    id: profileId,
  });

  const fetchFiles = useFetchFiles({
    query: debouncedQuery,
    page: pageIndex,
    pageSize,
    profileId,
  });

  const clearSelection = () => {
    setMode('view');
    setSelected(undefined);
    setRowSelection({});
  };

  const handleDelete = (d: File) => {
    setSelected(d);
    setMode('delete');
  };

  const columns = React.useMemo(
    () =>
      getColumns({
        onOpen: (d) => {
          setSelected(d);
          setMode('edit');
        },
        onDelete: handleDelete,
      }),
    []
  );

  const table = useReactTable({
    data:
      fetchFiles.data?.map((f) => ({ ...f, profile: fetchProfile.data })) ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    enableRowSelection: true,
    manualPagination: true,
    pageCount: 1,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const toolbar = (
    <DataTableToolbar
      table={table}
      query={query}
      setQuery={setQuery}
      onCreate={() => setMode('create')}
      onDelete={() => setMode('bulk_delete')}
    />
  );

  const footer = (
    <DataTablePagination
      table={table}
      setPageIndex={setPageIndex}
      setPageSize={setPageSize}
    />
  );

  const deleteModal = (
    <AlertDialog
      open={mode === 'delete' || mode === 'bulk_delete'}
      onOpenChange={(open) => {
        if (!open) clearSelection();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected files(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteProfiles.mutateAsync(
                mode === 'delete' && !!selected
                  ? [selected.id]
                  : table.getSelectedRowModel().rows.map((r) => r.original.id)
              );
              clearSelection();
            }}
          >
            {deleteProfiles.isPending && (
              <Loader className='animte-spin w-4 h-4 mr-2' />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Page
      title='Files'
      isLoading={fetchProfile.isPending}
      toolbar={toolbar}
      footer={footer}
    >
      <DataTable table={table} />
      {/* {((mode === 'edit' && selected) || mode === 'create') && (
        <UpsertProfileDialog
          defaultValues={mode === 'edit' ? selected : undefined}
          open={mode === 'create' || mode === 'edit'}
          onClose={() => setMode('view')}
          isLoading={upsertProfile.isPending}
          onSubmit={async (data) => {
            const created = await upsertProfile.mutateAsync({
              id: selected?.id,
              ...data,
            });
            created && setMode('view');
          }}
        />
      )} */}
      {deleteModal}
    </Page>
  );
}
