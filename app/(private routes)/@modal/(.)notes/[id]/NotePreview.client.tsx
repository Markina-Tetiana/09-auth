'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const closeModal = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={closeModal}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={closeModal}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={closeModal}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        <p className={css.tag}>{note.tag}</p>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Modal>
  );
}

export default NotePreviewClient;
