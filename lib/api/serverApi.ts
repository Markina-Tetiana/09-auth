import { cookies } from 'next/headers';
import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
interface CheckSessionResponse {
  success: boolean;
}

export async function fetchNotes({
  page,
  perPage,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();

  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export async function checkSession() {
  const cookieStore = await cookies();

  const response = await api.get<CheckSessionResponse>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}
