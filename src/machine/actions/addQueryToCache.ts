/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createLogic, interpret } from '@bemedev/fsf';
import { CqrsContext } from '../types';

export type Events = Pick<CqrsContext, 'itemIDs' | 'caches'> &
  Required<Pick<CqrsContext, 'currentQuery'>>;

export type Context = Pick<CqrsContext, 'caches'> & {
  query?: string;
};

export const logic = createLogic({
  context: {},
  initial: 'caches',
  schema: {
    data: {} as Required<CqrsContext>['caches'],
    context: {} as Context,
    events: {} as Events,
  },
  states: {
    caches: {
      always: [
        {
          cond: 'cachesExist',
          target: 'ids',
          actions: 'assignCaches',
        },
        {
          target: 'ids',
          actions: 'createCaches',
        },
      ],
    },
    ids: {
      always: [
        {
          cond: 'idsExist',
          target: 'string',
        },
        'error',
      ],
    },
    string: {
      always: {
        target: 'push',
        actions: 'stringify',
      },
    },
    push: {
      entry: 'push',
      data: 'caches',
    },
    error: {
      data: 'caches',
    },
  },
}).withOptions({
  guards: {
    cachesExist: (_, events) => {
      return events.caches !== undefined;
    },
    idsExist: (_, events) => {
      return events.itemIDs !== undefined;
    },
  },
  actions: {
    assignCaches: (context, events) => {
      context.caches = events.caches;
    },
    createCaches: context => {
      context.caches = [];
    },
    stringify: (context, events) => {
      context.query = JSON.stringify(events.currentQuery);
    },
    push: (context, { itemIDs }) => {
      const query = context.query!;
      context.caches?.push({ ids: itemIDs!, query });
    },
  },
  datas: {
    caches: context => {
      return context.caches!;
    },
  },
});

export const _addQueryToCache = interpret(logic);
