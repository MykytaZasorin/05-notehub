import axios, { AxiosResponse } from "axios";
import { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error("VITE_NOTEHUB_TOKEN is not set in environment variables");
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export interface DeleteNoteResponse {
  message: string;
  deletedId: string;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
  });
  return response.data;
};

export const createNote = async ({
  title,
  content,
  tag,
}: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", {
    title,
    content,
    tag,
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await api.delete(
    `/notes/${id}`,
  );
  return response.data;
};
