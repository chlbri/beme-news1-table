import { Pagination } from 'src/machine/types';
import { DEFAULT_QUERY } from './constants';

export function generateFakeQuery(
  options?: Pick<Pagination, 'total' | 'pageSize' | 'currentPage'>,
) {
  const _options = {
    total: options?.total ?? DEFAULT_QUERY.total,
    pageSize: options?.pageSize ?? DEFAULT_QUERY.pageSize,
    currentPage: options?.currentPage ?? DEFAULT_QUERY.currentPage,
  };
  return _options;
}
