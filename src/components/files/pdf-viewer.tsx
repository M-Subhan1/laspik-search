'use client';

import { ChevronLeftIcon, ChevronRightIcon, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import useResizeObserver from '@/hooks/useResizeOberserver';

import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  fileUrl: string;
};

const maxWidth = 1200;

export default function PdfViwer({ fileUrl }: Props) {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const router = useRouter();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, {}, onResize);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setTotalPages(numPages);
  }

  function handleNext() {
    setPageNumber((pageNumber) => Math.min(totalPages, pageNumber + 1));
  }

  function handlePrevious() {
    setPageNumber((pageNumber) => Math.max(1, pageNumber - 1));
  }

  return (
    <main className='relative flex flex-wrap w-full h-full p-5 items-start'>
      <div className='w-full h-12 left-1/2 flex gap-2 items-center justify-center'>
        <Button
          className='justify-self-start mr-auto'
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button onClick={handlePrevious} disabled={pageNumber === 1}>
          <ChevronLeftIcon className='h-5 w-5' /> Prev
        </Button>
        <div>
          Page {pageNumber} of {totalPages}
        </div>
        <Button
          className='mr-auto'
          onClick={handleNext}
          disabled={pageNumber === totalPages}
        >
          Next
          <ChevronRightIcon className='h-5 w-5' />
        </Button>
      </div>
      <div className='w-full mt-5' ref={setContainerRef}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className='w-full h-full flex items-center justify-center'>
              <Loader className='w-6 h-6 animate-spin' />
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            width={
              containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
            }
          />
        </Document>
      </div>
    </main>
  );
}
