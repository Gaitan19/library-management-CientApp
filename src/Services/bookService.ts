import { IBook } from "@/Interfaces/IBook";
import apiClient from "./apiClient";

export const fetchBooks = async (): Promise<IBook[]> => {
  const response = await apiClient.get<IBook[]>("/Books");
  return response.data;
};

export const addBook = async (bookData: Omit<IBook, "id" | "isAvailable">): Promise<void> => {
  await apiClient.post("/Books", bookData);
};
