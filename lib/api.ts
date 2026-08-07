import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '@/types/note';

const API_URL = 'https://notehub-public.goit.study/api/notes';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export type NoteSortBy = 'created' | 'updated';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
  sortBy?: NoteSortBy;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}
//получаем список заметок с сервера
export const fetchNotes = async ({
  page,
  perPage,
  search = '',
  tag,
  sortBy,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('', {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
      ...(sortBy ? { sortBy } : {}),
    },
  });
  return response.data;
};
//создаем новую заметку на сервере
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post('', noteData);
  return response.data;
};
//удаляем заметку с сервера
export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/${noteId}`);
  return response.data;
};

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/${id}`);
  return response.data;
}
