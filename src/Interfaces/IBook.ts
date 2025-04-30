export interface IBook {
    id: string;
    title: string;
    author: string;
    isAvailable: boolean;
    publicationYear: number;
    isbn: string;
  }

  export interface INewData {
    title?: string;
    author?: string;
    isbn?: string;
    name?: string;
    publicationYear?: number;
  }

  export type LibraryTab = "books" | "users";