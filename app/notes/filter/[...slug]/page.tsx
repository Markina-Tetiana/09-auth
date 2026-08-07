import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const currentTag = slug[0] ?? 'all';
  const isAllNotes = currentTag === 'all';

  const title = isAllNotes
    ? 'All notes | NoteHub'
    : `${currentTag} notes | NoteHub`;

  const description = isAllNotes
    ? 'Browse all your notes in NoteHub.'
    : `Browse notes filtered by the ${currentTag} tag.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `https://notehub.com`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${isAllNotes ? 'All' : currentTag} notes in NoteHub`,
        },
      ],
    },
  };
}

const PER_PAGE = 12;

async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const currentTag = slug[0];
  const tag = currentTag === 'all' ? undefined : currentTag;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? 'all'} tag={tag} />
    </HydrationBoundary>
  );
}

export default NotesPage;
