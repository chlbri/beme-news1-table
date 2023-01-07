export function getSlice<T>(items?: Iterable<T>, offset = 0, count = 0) {
  const _items = Array.from(items ?? []);
  const end = offset + count;
  return _items.slice(offset, end);
}

export function getLasts<T>(items?: Iterable<T>, count = 0) {
  const __items = Array.from(items ?? []);
  const offset = __items.length - count;
  return getSlice(__items, offset, count);
}

export function getFirsts<T>(items?: Iterable<T>, count = 0) {
  return getSlice(items, 0, count);
}
