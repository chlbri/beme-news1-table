import { Article, WithoutID } from 'core';

export type Cache = { query: string; ids: string[] };

export type CqrsContext = {
  currentQuery?: Query;
  items?: Set<Article>;
  itemIDs?: Article['id'][];
  allTotal?: number;
  currentItems?: Article[];
  caches?: Cache[];
};

export type Pagination = {
  more?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
};

export type Env = Record<string, string | undefined>;

export type Context = {
  environment?: Env;
  cqrs?: CqrsContext;
  pagination?: Pagination;
  errors?: string[];
  user?: {
    id?: string;
  };
};

export type UpdateArticle = Required<Pick<Article, 'id'>> &
  WithoutID<Article>;

export type Query = {
  data: Partial<Article>;
  offset?: number;
  limit?: number;
};

export type QueryMore = Omit<Query, 'offset'> &
  Required<Pick<Query, 'offset'>>;

export type CqrsSend =
  | { type: 'CQRS/SEND/CREATE'; data: { create: WithoutID<Article> } }
  | {
      type: 'CQRS/SEND/UPDATE';
      data: { id: Article['id']; update: WithoutID<Partial<Article>> };
    }
  | { type: 'CQRS/SEND/DELETE'; data: { id: Article['id'] } }
  | { type: 'CQRS/SEND/REMOVE'; data: { id: Article['id'] } }
  | { type: 'CQRS/SEND/QUERY'; data: { query: Query } }
  | { type: 'CQRS/SEND/MORE'; data: { query: QueryMore } }
  | { type: 'CQRS/SEND/REFETCH' };

export type CqrsReceive =
  | { type: 'CQRS/RECEIVE/ITEMS'; data?: { items?: Article[] } }
  | { type: 'CQRS/RECEIVE/ALL_TOTAL'; data?: { allTotal?: number } }
  | { type: 'CQRS/RECEIVE/MORE'; data?: { items?: Article[] } };

export type CqrsEvents =
  | CqrsSend
  | CqrsReceive
  | { type: 'CQRS/REVERSE_ORDER' };

export type PaginationEvents =
  | { type: 'PAGINATION/GOTO_NEXT_PAGE' }
  | { type: 'PAGINATION/SET_PAGE_SIZE'; data: { size: number } }
  | { type: 'PAGINATION/GOTO_PREVIOUS_PAGE' }
  | { type: 'PAGINATION/GOTO'; data: { page: number } }
  | { type: 'PAGINATION/GOTO_FIRST_PAGE' }
  | { type: 'PAGINATION/GOTO_LAST_PAGE' };

export type Events = CqrsEvents | PaginationEvents | { type: 'RINIT' };

export type Services = {
  getEnVariables: {
    data: Env;
  };
  cqrs: {
    data: unknown;
  };
  cache: {
    data: { items?: Article[]; query?: Query } | undefined;
  };
  getUser: {
    data: { id?: string };
  };
};
