import { createLogic, interpret } from '@bemedev/fsf';
import { CqrsContext } from '../types';

type Events = Pick<CqrsContext, 'currentQuery' | 'caches'>;
type Context = {
  currentQuery?: string;
  caches?: string[];
};

export const logic = createLogic({
  context: {},
  initial: 'checkQuery',
  schema: {
    data: {} as boolean,
    context: {} as Context,
    events: {} as Events | null,
  },
  states: {
    checkQuery: {
      always: [
        {
          cond: 'currentQueryIsNotDefined',
          target: 'error',
        },
        'checkCaches',
      ],
    },
    checkCaches: {
      always: [
        {
          cond: 'cachesExist',
          target: 'error',
        },
        'transformQuery',
      ],
    },
    transformQuery: {
      always: {
        target: 'transformCaches',
        actions: 'transformQuery',
      },
    },
    transformCaches: {
      always: {
        target: 'caching',
        actions: 'transformCaches',
      },
    },
    caching: {
      always: [
        {
          cond: 'queryIsCached',
          target: 'success',
        },
        'error',
      ],
    },
    success: {
      data: 'returnTrue',
    },
    error: {
      data: 'returnFalse',
    },
  },
}).withOptions({
  guards: {
    currentQueryIsNotDefined: (_, event) => !event || !event.currentQuery,
    cachesExist: (_, event) => !event || !event.caches,
    queryIsCached: ({ caches, currentQuery }) => {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion*/
      return caches!.includes(currentQuery!);
    },
  },
  actions: {
    transformQuery: (context, event) => {
      context.currentQuery = JSON.stringify(event?.currentQuery);
    },
    transformCaches: (context, event) => {
      context.caches = event?.caches?.map(cache => cache.query);
    },
  },
  datas: {
    returnTrue: () => true,
    returnFalse: () => false,
  },
});

export const _queryIsCached = interpret(logic);
