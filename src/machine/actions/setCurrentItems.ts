/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createLogic, interpret } from '@bemedev/fsf';
import type { Article } from 'core';
import { getSlice } from '../functions';
import { CqrsContext, Pagination } from '../types';

type Events = Pick<CqrsContext, 'items'> &
  Required<Pick<Pagination, 'total' | 'pageSize' | 'currentPage'>>;

type Context = Pick<CqrsContext, 'currentItems' | 'items'> & {
  offset?: number;
  lastPageFirstIndex?: number;
};

export const logic = createLogic({
  context: {},
  initial: 'items',
  schema: {
    data: {} as Article[],
    context: {} as Context,
    events: {} as Events,
  },
  states: {
    items: {
      always: [
        {
          cond: 'itemsNotExist',
          target: 'offset',
          actions: 'createItems',
        },
        { target: 'offset', actions: 'assignItems' },
      ],
    },
    offset: {
      always: {
        target: 'lastPage',
        actions: 'calculateOffset',
      },
    },
    lastPage: {
      always: {
        target: 'checkOffset',
        actions: 'calculateLastPageFirstIndex',
      },
    },
    checkOffset: {
      always: [
        {
          cond: 'compare',
          target: 'last',
        },
        'slice',
      ],
    },
    last: {
      entry: 'calculateLastPage',
      data: 'items',
    },
    slice: {
      entry: 'slice',
      data: 'items',
    },
  },
}).withOptions({
  guards: {
    compare: ({ offset, lastPageFirstIndex }) =>
      offset! > lastPageFirstIndex! - 1,
    itemsNotExist: (_, { items }) => !items,
  },
  actions: {
    createItems: context => {
      context.items = new Set();
    },
    assignItems: (context, { items }) => {
      context.items = items;
    },
    calculateOffset: (context, { currentPage, pageSize }) => {
      context.offset = currentPage * pageSize;
    },
    calculateLastPageFirstIndex: (context, { total, pageSize }) => {
      context.lastPageFirstIndex = total - (total % pageSize);
    },
    calculateLastPage: context => {
      context.currentItems = Array.from(context.items!).slice(
        context.lastPageFirstIndex!,
      );
    },
    slice: (context, { pageSize }) => {
      context.currentItems = getSlice(
        context.items,
        context.offset,
        pageSize,
      );
    },
  },
  datas: {
    items: ({ currentItems }) => currentItems!,
  },
});

export const _setCurrentItems = interpret(logic);
