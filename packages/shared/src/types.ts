export interface DocumentListItem {
  id: number;
  titleRo: string;
  titleRu?: string;
  type: string;
  number: string;
  emitent: string;
  dateIssued: string;
  datePublished?: string;
  moNumber?: string;
  status: 'in_vigoare' | 'abrogat' | 'suspendat';
  version: number;
}

export interface DocumentDetail extends DocumentListItem {
  bodyRo: string;
  bodyRu?: string;
  amendmentsRo?: string;
  versions: DocumentVersion[];
  isFavorite?: boolean;
  repealedBy?: { id: number; title: string; number: string } | null;
}

export interface DocumentVersion {
  id: number;
  version: number;
  dateIssued: string;
  titleRo: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  errors?: string[];
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'OPERATOR' | 'MODERATOR' | 'ADMIN';
}

export interface SearchParams {
  q?: string;
  tip?: string;
  emitent?: string;
  status?: string;
  an?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
