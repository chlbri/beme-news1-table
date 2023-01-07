import { interpret } from '@bemedev/fsf';
import { expect, test } from 'vitest';
import { Events, logic, _addQueryToCache } from './addQueryToCache';

test('#00: Acceptance', () => {
  interpret(logic);
});

test('#01: Caches are not defined => create caches', () => {
  const events: Events = {
    currentQuery: { data: { author: 'BBC' } },
    itemIDs: ['1', '2'],
  };
  const result = _addQueryToCache(events);
  expect(result).toEqual([
    { query: JSON.stringify(events.currentQuery), ids: events.itemIDs },
  ]);
});

test('#02: Caches are defined => push to caches', () => {
  const events: Events = {
    currentQuery: { data: { author: 'BBC' } },
    itemIDs: ['1', '2'],
    caches: [{ query: '1', ids: ['1'] }],
  };
  const result = _addQueryToCache(events);
  expect(result).toEqual([
    { query: '1', ids: ['1'] },
    { query: JSON.stringify(events.currentQuery), ids: events.itemIDs },
  ]);
});

test('#03: itemIDs are not defined => empty caches', () => {
  const events: Events = {
    currentQuery: { data: { author: 'BBC' } },
  };
  const result = _addQueryToCache(events);
  expect(result).toEqual([]);
});
