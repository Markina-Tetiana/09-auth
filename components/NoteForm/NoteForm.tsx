'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote, type CreateNoteData } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

const TAG_OPTIONS: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      router.push('/notes/filter/all');
    },
  });

  const formAction = (formData: FormData): void => {
    const titleValue = formData.get('title');
    const contentValue = formData.get('content');
    const tagValue = formData.get('tag');

    if (
      typeof titleValue !== 'string' ||
      typeof contentValue !== 'string' ||
      typeof tagValue !== 'string'
    ) {
      return;
    }

    const normalizedTitle = titleValue.trim();
    const normalizedContent = contentValue.trim();

    if (!normalizedTitle || !normalizedContent) {
      return;
    }

    if (!TAG_OPTIONS.includes(tagValue as NoteTag)) {
      return;
    }

    const newNote: CreateNoteData = {
      title: normalizedTitle,
      content: normalizedContent,
      tag: tagValue as NoteTag,
    };

    createMutation.mutate(newNote);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          defaultValue={draft.title}
          onChange={event => setDraft({ title: event.target.value })}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={event => setDraft({ content: event.target.value })}
          maxLength={500}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={event => setDraft({ tag: event.target.value as NoteTag })}
        >
          {TAG_OPTIONS.map(currentTag => (
            <option key={currentTag} value={currentTag}>
              {currentTag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>

      {createMutation.isError && (
        <p className={css.error}>Failed to create note. Please try again.</p>
      )}
    </form>
  );
}

export default NoteForm;
