/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { assign } from '@xstate/immer';
import { assignObject } from 'core';
import { createMachine, send } from 'xstate';
import { escalate } from 'xstate/lib/actions';
import { NUMBERS } from '~constants';
import { _addQueryToCache, _setCurrentItems } from './actions';
import { getFirsts, getLasts } from './functions';
import { _queryIsCached } from './guards';
import { Context, Events, Services } from './types';

export const machine = createMachine(
  {
    tsTypes: {} as import('./machine.typegen').Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,
    schema: {
      // TODO: Make items by pages Record<number, Article[]>
      // TODO: Stringify items
      // TODO: add needToFetchPrevious
      // TODO: add needToFetchNext
      // TODO: possibilité d'ajouter des pages en amont avec fetch
      context: {} as Context,
      events: {} as Events,
      services: {} as Services,
    },
    context: {},

    id: 'table',
    initial: 'config',
    states: {
      cache: {
        exit: 'buildItems',
        invoke: {
          src: 'cache',
          id: 'cache',
          onDone: [
            {
              target: 'work',
              actions: [
                'setItems',
                'setItemIDs',
                'setQuery',
                'addQueryToCache',
              ],
            },
          ],
          onError: [
            {
              target: 'work',
              actions: 'escalateCacheError',
            },
          ],
        },
      },
      config: {
        description:
          'Everything you need to configure before running anything',
        initial: 'environment',
        states: {
          optional: {
            description: 'A specific config (optional) you want to add',
            invoke: {
              src: 'optional',
              id: 'optional',
              onError: [
                {
                  target: '#table.error',
                  actions: 'escalateConfigError',
                },
              ],
              onDone: [
                {
                  target: '#table.user',
                },
              ],
            },
          },
          environment: {
            invoke: {
              src: 'getEnVariables',
              id: 'getEnVariables',
              onDone: [
                {
                  target: 'optional',
                  actions: 'setEnVariables',
                },
              ],
              onError: [
                {
                  target: '#table.error',
                  actions: 'escalateEnvError',
                },
              ],
            },
          },
        },
      },
      work: {
        states: {
          cqrs: {
            invoke: {
              src: 'cqrs',
              id: 'cqrs',
              onError: [
                {
                  target: '#table.error',
                  actions: 'escalateDataError',
                },
              ],
            },
            initial: 'busy',
            states: {
              busy: {
                after: {
                  THROTTLE_TIME: {
                    target: '#table.work.cqrs.ready',
                    actions: [],
                    internal: false,
                  },
                },
              },
              ready: {
                description: 'Ready for commands',
                on: {
                  'CQRS/SEND/CREATE': {
                    target: 'resetCache',
                    actions: 'cqrs/create',
                  },
                  'CQRS/SEND/UPDATE': {
                    target: 'resetCache',
                    actions: 'cqrs/update',
                  },
                  'CQRS/SEND/QUERY': {
                    target: 'cacheQuery',
                    actions: 'setQuery',
                  },
                  'CQRS/SEND/REMOVE': {
                    target: 'resetCache',
                    actions: 'cqrs/remove',
                  },
                  'CQRS/SEND/DELETE': {
                    target: 'resetCache',
                    actions: 'cqrs/delete',
                  },
                  'CQRS/SEND/MORE': {
                    target: 'cacheMore',
                    actions: 'setQuery',
                  },
                  'CQRS/SEND/REFETCH': {
                    target: 'busy',
                    actions: 'cqrs/refetch',
                  },
                },
              },
              resetCache: {
                always: {
                  target: 'busy',
                  actions: 'cqrs/resetCache',
                },
              },
              cacheQuery: {
                initial: 'check',
                states: {
                  check: {
                    always: [
                      {
                        target: 'produce',
                        cond: 'queryIsCached',
                      },
                      {
                        target: 'send',
                      },
                    ],
                  },
                  produce: {
                    initial: 'check',
                    states: {
                      check: {
                        always: [
                          {
                            target: 'items',
                            cond: 'itemsAreCached',
                          },
                          {
                            target: 'send',
                          },
                        ],
                      },
                      send: {
                        entry: 'cqrs/query',
                        type: 'final',
                      },
                      items: {
                        entry: 'setCurrentItems',
                        type: 'final',
                      },
                    },
                    type: 'final',
                  },
                  send: {
                    entry: 'cqrs/query',
                    type: 'final',
                  },
                },
                onDone: {
                  target: 'busy',
                  actions: 'addQueryToCache',
                },
              },
              cacheMore: {
                exit: 'cqrs/removeLastQuery',
                initial: 'check',
                states: {
                  check: {
                    exit: 'cqrs/addToPreviousQuery',
                    always: [
                      {
                        target: 'produce',
                        cond: 'queryIsCached',
                      },
                      {
                        target: 'send',
                      },
                    ],
                  },
                  produce: {
                    initial: 'check',
                    states: {
                      check: {
                        always: [
                          {
                            target: 'items',
                            cond: 'itemsAreCached',
                          },
                          {
                            target: 'send',
                          },
                        ],
                      },
                      send: {
                        entry: 'cqrs/more',
                        type: 'final',
                      },
                      items: {
                        entry: 'setCurrentItems',
                        type: 'final',
                      },
                    },
                    type: 'final',
                  },
                  send: {
                    entry: 'cqrs/more',
                    type: 'final',
                  },
                },
                onDone: {
                  target: 'busy',
                  actions: 'addQueryToCache',
                },
              },
            },
            on: {
              'CQRS/REVERSE_ORDER': {
                actions: 'cqrs/reverseItemsOrder',
              },
            },
          },
          pagination: {
            entry: [
              'setTotal',
              'pagination/setTotalPages',
              'pagination/setDefaultPage',
            ],
            initial: 'config',
            states: {
              busy: {
                entry: [
                  'pagination/setHasNextPage',
                  'pagination/setHasPreviousPage',
                  'pagination/setCanFetchMoreNext',
                  'pagination/setCanFetchMorePrevious',
                ],
                exit: 'setCurrentItems',
                after: {
                  DISPLAY_TIME: {
                    target: '#table.work.pagination.ready',
                    actions: [],
                    internal: false,
                  },
                },
              },
              ready: {
                on: {
                  'PAGINATION/GOTO_NEXT_PAGE': {
                    target: 'busy',
                    actions: ['pagination/nextPage', 'cqrs/nextPage'],
                  },
                  'PAGINATION/GOTO_PREVIOUS_PAGE': {
                    target: 'busy',
                    actions: [
                      'pagination/previousPage',
                      'cqrs/previousPage',
                    ],
                  },
                  'PAGINATION/GOTO': {
                    target: 'busy',
                    actions: ['pagination/goto', 'cqrs/goto'],
                  },
                  'PAGINATION/GOTO_FIRST_PAGE': {
                    target: 'busy',
                    actions: ['pagination/firstPage', 'cqrs/firstPage'],
                  },
                  'PAGINATION/GOTO_LAST_PAGE': {
                    target: 'busy',
                    actions: ['pagination/lastPage', 'cqrs/lastPage'],
                  },
                  'PAGINATION/SET_PAGE_SIZE': {
                    target: 'busy',
                    actions: 'pagination/setPageSize',
                  },
                },
              },
              config: {
                always: [
                  {
                    target: 'busy',
                    cond: 'hasPageSize',
                  },
                  {
                    target: 'busy',
                    actions: 'pagination/setDefaultPageSize',
                  },
                ],
              },
            },
            on: {
              'CQRS/RECEIVE/ITEMS': {
                target: 'pagination',
                actions: ['setItems', 'setItemIDs'],
                internal: false,
              },
              'CQRS/RECEIVE/ALL_TOTAL': {
                target: 'pagination',
                actions: 'setAllTotal',
                internal: false,
              },
              'CQRS/RECEIVE/MORE': {
                target: 'pagination',
                actions: ['addItems', 'setItemIDs'],
                internal: false,
              },
            },
          },
        },
        type: 'parallel',
      },
      user: {
        invoke: {
          src: 'getUser',
          id: 'getUser',
          onDone: [
            {
              target: 'cache',
              actions: 'setUser',
            },
          ],
          onError: [
            {
              target: 'error',
              actions: 'escalateUserError',
            },
          ],
        },
      },
      error: {
        on: {
          RINIT: {
            target: 'config',
          },
        },
      },
    },
  },
  {
    guards: {
      itemsAreCached: context => {
        // TODO: fsf it !
        const itemIDs = context.cqrs?.itemIDs;
        const items = context.cqrs?.items?.values();
        if (!items || !itemIDs) return false;
        const ids = Array.from(items).map(item => item.id);
        const check = itemIDs.every(id => ids.includes(id));
        return check;
      },
      queryIsCached: ({ cqrs }) => _queryIsCached(cqrs),
      hasPageSize: context => !!context.pagination?.pageSize,
    },
    actions: {
      // #region Errors
      escalateEnvError: escalate('ENVIRONMENT_ERROR'),
      escalateConfigError: escalate('CONFIG_ERROR'),
      escalateCacheError: escalate((_, { data }) => data),
      escalateUserError: escalate('USER_ERROR'),
      escalateDataError: escalate('DATA_ERROR'),
      // #endregion

      setEnVariables: assign((context, { data }) => {
        context.environment = data;
      }),

      setUser: assign((context, { data }) => {
        context.user = data;
      }),

      setQuery: assign((context, event) => {
        const currentQuery = event.data?.query;
        context.cqrs = {
          ...context.cqrs,
          currentQuery,
        };
      }),

      addQueryToCache: assign(context => {
        const currentQuery = context.cqrs?.currentQuery!;
        const { itemIDs, caches } = context.cqrs!;
        const events = { currentQuery, itemIDs, caches };
        assignObject(context.cqrs?.caches, _addQueryToCache(events));
      }),

      setTotal: assign(context => {
        const total = context.cqrs?.items?.size;
        assignObject(context.pagination, { total });
      }),

      setAllTotal: assign((context, event) => {
        const allTotal = event.data?.allTotal;
        assignObject(context.cqrs, { allTotal });
      }),

      // #region Items
      buildItems: assign(context => {
        assignObject(context.cqrs?.items, new Set());
      }),

      setItems: assign((context, event) => {
        const items = new Set(event.data?.items);
        assignObject(context.cqrs?.items, items);
      }),

      addItems: assign((context, event) => {
        const items = event.data?.items ?? [];
        const _items = context.cqrs?.items;
        items.forEach(item => _items?.add(item));
      }),

      setItemIDs: assign(context => {
        const items = context.cqrs?.items?.values();
        const itemIDs = Array.from(items!).map(item => item.id);
        context.cqrs = {
          ...context.cqrs,
          itemIDs,
        };
      }),

      setCurrentItems: assign(context => {
        const items = context.cqrs?.items;
        const total = context.pagination?.total!;
        const currentPage = context.pagination?.currentPage!;
        const pageSize = context.pagination?.pageSize!;
        const _items = _setCurrentItems({
          items,
          total,
          currentPage,
          pageSize,
        });
        assignObject(context.cqrs?.currentItems, _items);
      }),
      // #endregion

      // #region CQRS
      'cqrs/query': send(
        context => {
          const data = context.cqrs?.currentQuery;
          return { type: 'QUERY', data };
        },
        { to: 'cqrs' },
      ),

      'cqrs/refetch': send(
        context => {
          const data = context.cqrs?.currentQuery;
          return { type: 'REFETCH', data };
        },
        { to: 'cqrs' },
      ),

      'cqrs/more': send(
        context => {
          const data = context.cqrs?.currentQuery;
          return { type: 'MORE', data };
        },
        { to: 'cqrs' },
      ),

      'cqrs/create': send((_, { data }) => ({ type: 'CREATE', data }), {
        to: 'cqrs',
      }),

      'cqrs/update': send((_, { data }) => ({ type: 'UPDATE', data }), {
        to: 'cqrs',
      }),

      'cqrs/delete': send((_, { data }) => ({ type: 'DELETE', data }), {
        to: 'cqrs',
      }),

      'cqrs/remove': send((_, { data }) => ({ type: 'REMOVE', data }), {
        to: 'cqrs',
      }),

      'cqrs/firstPage': assign(context => {
        const items = context.cqrs?.items;
        const pageSize = context.pagination?.pageSize!;
        const currentItems = getFirsts(items, pageSize);

        assignObject(context.cqrs?.currentItems, currentItems);
      }),

      'cqrs/lastPage': assign(context => {
        // TODO: fsf it !
        const items = context.cqrs?.items;
        const pageSize = context.pagination?.pageSize!;
        const total = context.pagination?.total!;
        const rest = total % pageSize;
        const last = rest === 0 ? pageSize : rest;
        const currentItems = getLasts(items, last);

        assignObject(context.cqrs?.currentItems, currentItems);
      }),

      'cqrs/nextPage': assign(context => {
        const items = context.cqrs?.items;
        const total = context.pagination?.total!;
        const currentPage = context.pagination?.currentPage! + 1;
        const pageSize = context.pagination?.pageSize!;
        const _items = _setCurrentItems({
          items,
          total,
          currentPage,
          pageSize,
        });
        assignObject(context.cqrs?.currentItems, _items);
      }),

      'cqrs/previousPage': assign(context => {
        const items = context.cqrs?.items;
        const total = context.pagination?.total!;
        const currentPage = context.pagination?.currentPage! - 1;
        const pageSize = context.pagination?.pageSize!;
        const _items = _setCurrentItems({
          items,
          total,
          currentPage,
          pageSize,
        });
        assignObject(context.cqrs?.currentItems, _items);
      }),

      'cqrs/reverseItemsOrder': assign(context => {
        const __items = Array.from(context.cqrs?.items!).reverse();
        const items = new Set(__items);
        assignObject(context.cqrs?.items, items);
      }),

      'cqrs/resetCache': assign(context => {
        assignObject(context.cqrs?.caches, []);
      }),

      'cqrs/removeLastQuery': assign(context => {
        context.cqrs?.caches?.pop();
      }),
      // #endregion

      // #region Pagination
      'pagination/firstPage': assign(context => {
        assignObject(context.pagination, { currentPage: 0 });
      }),

      'pagination/lastPage': assign(context => {
        const currentPage = (context.pagination?.totalPages ?? 1) - 1;
        assignObject(context.pagination, { currentPage });
      }),

      'pagination/nextPage': assign(context => {
        const currentPage = (context.pagination?.currentPage ?? -1) + 1;
        assignObject(context.pagination, { currentPage });
      }),

      'pagination/previousPage': assign(context => {
        const currentPage = (context.pagination?.currentPage ?? 1) - 1;
        assignObject(context.pagination, { currentPage });
      }),

      'pagination/goto': assign((context, event) => {
        const currentPage = event.data.page;
        assignObject(context.pagination, { currentPage });
      }),

      'pagination/setPageSize': assign((context, event) => {
        const pageSize = event.data.size;
        assignObject(context.pagination, { pageSize });
      }),

      'pagination/setDefaultPageSize': assign(context => {
        const pageSize = NUMBERS.DEFAULT_PAGE_SIZE;
        assignObject(context.pagination, { pageSize });
      }),

      'pagination/setTotalPages': assign(context => {
        //TODO : fsf it !
        const total = context.pagination?.total!;
        const pageSize = context.pagination?.pageSize!;
        const __totalPages = total / pageSize;
        const totalPages = Math.floor(__totalPages);
        assignObject(context.pagination, { totalPages });
      }),

      'pagination/setDefaultPage': assign(context => {
        const currentPage = 0;
        assignObject(context.pagination, { currentPage });
      }),

      'pagination/setHasPreviousPage': assign(context => {
        const currentPage = context.pagination?.currentPage!;
        const hasPreviousPage = currentPage > 0;

        assignObject(context.pagination, { hasPreviousPage });
      }),
      'pagination/setHasNextPage': assign(context => {
        const currentPage = context.pagination?.currentPage!;
        const totalPages = context.pagination?.totalPages!;
        const hasNextPage = currentPage < totalPages - 1;

        assignObject(context.pagination, { hasNextPage });
      }),
      // #endregion
    },
    delays: {
      DISPLAY_TIME: NUMBERS.DEFAULT_DISPLAY_TIME,
      THROTTLE_TIME: NUMBERS.DEFAULT_THROTLLE_TIME,
    },
  },
).withConfig({
  actions: {},
});
