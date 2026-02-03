import axios from "axios";
import { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

// Отримати нотатки
export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
}): Promise<FetchNotesResponse> {
  const { data } = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    params,
  });
  return data;
}

// Створити нотатку
export async function createNote(params: CreateNoteParams): Promise<Note> {
  const { data } = await axios.post<Note>(`${BASE_URL}/notes`, params, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
}

// Видалити нотатку
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
}
