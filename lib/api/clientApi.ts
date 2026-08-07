'use client';

import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
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
interface RegisterRequest {
  email: string;
  password: string;
}
interface LoginRequest {
  email: string;
  password: string;
}
interface CheckSessionResponse {
  success: boolean;
}
interface UpdateMeRequest {
  username: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};
export const login = async (data: LoginRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);

  return response.data;
};
export const checkSession = async (): Promise<boolean> => {
  const response = await api.get<CheckSessionResponse>('/auth/session');

  return response.data.success;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);

  return response.data;
};

//получаем список заметок с сервера
export const fetchNotes = async ({
  page,
  perPage,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
  });
  return response.data;
};
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}
//создаем новую заметку на сервере
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};
//удаляем заметку с сервера
export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
