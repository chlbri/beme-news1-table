import { interpret } from '@bemedev/fsf';
import { expect, test } from 'vitest';
import { logic, _queryIsCached } from './queryIsCached';

test('#00: Acceptance', () => {
  interpret(logic);
});

test('#01: Query is not defined => false', () => {
  const result = _queryIsCached({
    currentQuery: undefined,
  });
  expect(result).toBe(false);
});

test('#02: Caches are not defined => false', () => {
  const result = _queryIsCached({
    currentQuery: { data: {} },
  });
  expect(result).toBe(false);
});

test('#03: Query is not cached => false', () => {
  const query = JSON.stringify({ data: { author: 'BBC' } });
  const result = _queryIsCached({
    currentQuery: { data: { author: 'CNN' } },
    caches: [{ query, ids: [] }],
  });
  expect(result).toBe(false);
});

test('#04: Query is  cached => true', () => {
  const currentQuery = { data: { author: 'BBC' } };
  const query = JSON.stringify(currentQuery);
  const result = _queryIsCached({
    currentQuery,
    caches: [{ query, ids: [] }],
  });
  expect(result).toBe(true);
});
