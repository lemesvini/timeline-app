export type BaseEntity = {
  id: number;
  _id: string;
  createdAt: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  page: string;
  total: number;
  limit: string;
};

export type FilterOperators<T> = {
  eq?: T;
  ne?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  in?: T[];
  nin?: T[];
  $regex?: string;
  $options?: string;
};

export type FilterValue = string | number | boolean;

export type AuthResponse = {
  message: string;
  data?: Data;
  error?: string;
  statusCode?: number;
};

export type Data = {
  accessToken: string;
  user: User;
};

export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  USER = 'USER',
}

export type User = Entity<{
  fullName: string;
  email: string;
  emailConfirmed: boolean;
  role: Role;
  failedLoginAttempts: number;
  lastLogin?: Date;
  lockUntil?: Date;
  avatarUrl?: string;
}>;

export type Movie = Entity<{
  name: string;
  description: string;
  movieGenre: string;
  trailerLink: string;
  releaseDate: string;
  director: User;
}>;
