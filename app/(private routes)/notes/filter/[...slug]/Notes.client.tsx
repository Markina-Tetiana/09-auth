'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import { fetchNotes, type FetchNotesResponse } from '@/lib/api/clientApi';

import css from './NotesPage.module.css';

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: string;
}

function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, 500);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch} />
          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </header>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Something went wrong. Please try again later.</p>}
        {notes.length > 0 && <NoteList notes={notes} />}
      </div>
    </>
  );
}

export default NotesClient;
