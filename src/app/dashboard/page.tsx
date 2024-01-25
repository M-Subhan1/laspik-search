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

import { useDeleteProfiles } from '@/hooks/useDeleteProfiles';
import { useFetchProfiles } from '@/hooks/useFetchProfiles';
import { useUpsertProfile } from '@/hooks/useUpsertProfile';

import Page from '@/components/dashboard/page';
import { getColumns } from '@/components/profiles/columns';
import { DataTableToolbar } from '@/components/profiles/toolbar';
import { UpsertProfileDialog } from '@/components/profiles/upsert-dialog';
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

import { Profile } from '@/types';

type Mode = 'view' | 'create' | 'edit' | 'delete' | 'bulk_delete';

export default function DashboardHome() {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);

  const [selected, setSelected] = React.useState<Profile>();
  const [mode, setMode] = React.useState<Mode>('view');
  const [query, setQuery] = React.useState('');
  const [debouncedQuery] = useDebounce(query, 250);

  const upsertProfile = useUpsertProfile();
  const deleteProfiles = useDeleteProfiles();
  const fetchProfiles = useFetchProfiles({
    query: debouncedQuery,
    page: pageIndex,
    pageSize,
  });

  const clearSelection = () => {
    setMode('view');
    setSelected(undefined);
    setRowSelection({});
  };

  const handleDelete = (d: Profile) => {
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

  const table = useReactTable<Profile>({
    data: fetchProfiles.data ?? [],
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
            selected exams(s).
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
      title='Profiles'
      isLoading={fetchProfiles.isPaused}
      toolbar={toolbar}
      footer={footer}
    >
      <DataTable table={table} />
      {((mode === 'edit' && selected) || mode === 'create') && (
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
      )}
      {deleteModal}
    </Page>
  );
}
