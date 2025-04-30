import { IUser } from "@/Interfaces/IUser";
import apiClient from "./apiClient";

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await apiClient.get<IUser[]>("/Users");
  return response.data;
};

export const addUser = async (userData: Omit<IUser, "id" | "books">): Promise<void> => {
  await apiClient.post("/Users", userData);
};

export const borrowBook = async (userId: string, bookId: string): Promise<void> => {
  await apiClient.post("/users/borrow", { userId, bookId });
};

export const returnBook = async (userId: string, bookId: string): Promise<void> => {
  await apiClient.post("/users/return", { userId, bookId });
};