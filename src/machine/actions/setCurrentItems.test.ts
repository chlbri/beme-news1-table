import { interpret } from '@bemedev/fsf';
import { expect, test } from 'vitest';
import {
  DEFAULT_QUERY,
  generateFakeItems,
  generateFakeQuery,
} from '~fixtures';
import { getLasts, getSlice } from '../functions';

import { CqrsContext, Pagination } from '../types';
import { logic, _setCurrentItems } from './setCurrentItems';

test('#00 Acceptance', () => {
  interpret(logic);
});

test('#01: Items are not defined => empty items', () => {
  const result = _setCurrentItems({
    ...DEFAULT_QUERY,
  });
  expect(result).toEqual(getLasts());
});

function generateFakeProps(
  count = 10,
  options?: Pick<Pagination, 'total' | 'pageSize' | 'currentPage'>,
): Required<Pick<Pagination, 'total' | 'pageSize' | 'currentPage'>> &
  Pick<CqrsContext, 'items'> {
  const _options = generateFakeQuery(options);
  return {
    items: generateFakeItems(count),
    ..._options,
  };
}

test('#02: Items are defined => return items', () => {
  const props = generateFakeProps(10);
  const result = _setCurrentItems(props);
  expect(result).toEqual(getLasts(props.items, 10));
});

test('#03: Items are defined, page is overflowed => return empty items', () => {
  const props = generateFakeProps(10, { currentPage: 1 });
  const result = _setCurrentItems(props);
  expect(result).toEqual(getSlice());
});

test('#04: Items are defined, page is not overflowed => return items', () => {
  const props = generateFakeProps(35, { currentPage: 3, total: 35 });
  const result = _setCurrentItems(props);
  expect(result).toEqual(getLasts(props.items, 5));
});
