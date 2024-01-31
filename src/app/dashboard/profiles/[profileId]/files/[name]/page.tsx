import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import PdfViewer from '@/components/files/pdf-viewer';

type Props = {
  params: {
    name: string;
    profileId: number;
  };
};

export default async function FilePreviewPage({ params }: Props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.storage
    .from('files')
    .createSignedUrl(`/${params.profileId}/${params.name}`, 3600);

  if (error) {
    throw error;
  }

  return <PdfViewer fileUrl={data.signedUrl} />;
}
