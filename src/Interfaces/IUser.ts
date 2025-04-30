import { IBook } from "./IBook";

export interface IUser {
    id: string;
    name: string;
    books: IBook[];
  }