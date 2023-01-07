
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.cache": { type: "done.invoke.cache"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.cqrs": { type: "done.invoke.cqrs"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.getEnVariables": { type: "done.invoke.getEnVariables"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.getUser": { type: "done.invoke.getUser"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.optional": { type: "done.invoke.optional"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.cache": { type: "error.platform.cache"; data: unknown };
"error.platform.cqrs": { type: "error.platform.cqrs"; data: unknown };
"error.platform.getEnVariables": { type: "error.platform.getEnVariables"; data: unknown };
"error.platform.getUser": { type: "error.platform.getUser"; data: unknown };
"error.platform.optional": { type: "error.platform.optional"; data: unknown };
"xstate.after(DISPLAY_TIME)#table.work.pagination.busy": { type: "xstate.after(DISPLAY_TIME)#table.work.pagination.busy" };
"xstate.after(THROTTLE_TIME)#table.work.cqrs.busy": { type: "xstate.after(THROTTLE_TIME)#table.work.cqrs.busy" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "cache": "done.invoke.cache";
"cqrs": "done.invoke.cqrs";
"getEnVariables": "done.invoke.getEnVariables";
"getUser": "done.invoke.getUser";
"optional": "done.invoke.optional";
        };
        missingImplementations: {
          actions: "cqrs/addToPreviousQuery" | "cqrs/goto" | "pagination/setCanFetchMoreNext" | "pagination/setCanFetchMorePrevious";
          delays: never;
          guards: never;
          services: "cache" | "cqrs" | "getEnVariables" | "getUser" | "optional";
        };
        eventsCausingActions: {
          "addItems": "CQRS/RECEIVE/MORE";
"addQueryToCache": "done.invoke.cache" | "done.state.table.work.cqrs.cacheMore" | "done.state.table.work.cqrs.cacheQuery";
"buildItems": "done.invoke.cache" | "error.platform.cache" | "xstate.stop";
"cqrs/addToPreviousQuery": "" | "done.state.table.work.cqrs.cacheMore" | "error.platform.cqrs" | "xstate.stop";
"cqrs/create": "CQRS/SEND/CREATE";
"cqrs/delete": "CQRS/SEND/DELETE";
"cqrs/firstPage": "PAGINATION/GOTO_FIRST_PAGE";
"cqrs/goto": "PAGINATION/GOTO";
"cqrs/lastPage": "PAGINATION/GOTO_LAST_PAGE";
"cqrs/more": "";
"cqrs/nextPage": "PAGINATION/GOTO_NEXT_PAGE";
"cqrs/previousPage": "PAGINATION/GOTO_PREVIOUS_PAGE";
"cqrs/query": "";
"cqrs/refetch": "CQRS/SEND/REFETCH";
"cqrs/remove": "CQRS/SEND/REMOVE";
"cqrs/removeLastQuery": "done.state.table.work.cqrs.cacheMore" | "error.platform.cqrs" | "xstate.stop";
"cqrs/resetCache": "";
"cqrs/reverseItemsOrder": "CQRS/REVERSE_ORDER";
"cqrs/update": "CQRS/SEND/UPDATE";
"escalateCacheError": "error.platform.cache";
"escalateConfigError": "error.platform.optional";
"escalateDataError": "error.platform.cqrs";
"escalateEnvError": "error.platform.getEnVariables";
"escalateUserError": "error.platform.getUser";
"pagination/firstPage": "PAGINATION/GOTO_FIRST_PAGE";
"pagination/goto": "PAGINATION/GOTO";
"pagination/lastPage": "PAGINATION/GOTO_LAST_PAGE";
"pagination/nextPage": "PAGINATION/GOTO_NEXT_PAGE";
"pagination/previousPage": "PAGINATION/GOTO_PREVIOUS_PAGE";
"pagination/setCanFetchMoreNext": "" | "PAGINATION/GOTO" | "PAGINATION/GOTO_FIRST_PAGE" | "PAGINATION/GOTO_LAST_PAGE" | "PAGINATION/GOTO_NEXT_PAGE" | "PAGINATION/GOTO_PREVIOUS_PAGE" | "PAGINATION/SET_PAGE_SIZE";
"pagination/setCanFetchMorePrevious": "" | "PAGINATION/GOTO" | "PAGINATION/GOTO_FIRST_PAGE" | "PAGINATION/GOTO_LAST_PAGE" | "PAGINATION/GOTO_NEXT_PAGE" | "PAGINATION/GOTO_PREVIOUS_PAGE" | "PAGINATION/SET_PAGE_SIZE";
"pagination/setDefaultPage": "CQRS/RECEIVE/ALL_TOTAL" | "CQRS/RECEIVE/ITEMS" | "CQRS/RECEIVE/MORE" | "done.invoke.cache" | "error.platform.cache";
"pagination/setDefaultPageSize": "";
"pagination/setHasNextPage": "" | "PAGINATION/GOTO" | "PAGINATION/GOTO_FIRST_PAGE" | "PAGINATION/GOTO_LAST_PAGE" | "PAGINATION/GOTO_NEXT_PAGE" | "PAGINATION/GOTO_PREVIOUS_PAGE" | "PAGINATION/SET_PAGE_SIZE";
"pagination/setHasPreviousPage": "" | "PAGINATION/GOTO" | "PAGINATION/GOTO_FIRST_PAGE" | "PAGINATION/GOTO_LAST_PAGE" | "PAGINATION/GOTO_NEXT_PAGE" | "PAGINATION/GOTO_PREVIOUS_PAGE" | "PAGINATION/SET_PAGE_SIZE";
"pagination/setPageSize": "PAGINATION/SET_PAGE_SIZE";
"pagination/setTotalPages": "CQRS/RECEIVE/ALL_TOTAL" | "CQRS/RECEIVE/ITEMS" | "CQRS/RECEIVE/MORE" | "done.invoke.cache" | "error.platform.cache";
"setAllTotal": "CQRS/RECEIVE/ALL_TOTAL";
"setCurrentItems": "" | "CQRS/RECEIVE/ALL_TOTAL" | "CQRS/RECEIVE/ITEMS" | "CQRS/RECEIVE/MORE" | "xstate.after(DISPLAY_TIME)#table.work.pagination.busy" | "xstate.stop";
"setEnVariables": "done.invoke.getEnVariables";
"setItemIDs": "CQRS/RECEIVE/ITEMS" | "CQRS/RECEIVE/MORE" | "done.invoke.cache";
"setItems": "CQRS/RECEIVE/ITEMS" | "done.invoke.cache";
"setQuery": "CQRS/SEND/MORE" | "CQRS/SEND/QUERY" | "done.invoke.cache";
"setTotal": "CQRS/RECEIVE/ALL_TOTAL" | "CQRS/RECEIVE/ITEMS" | "CQRS/RECEIVE/MORE" | "done.invoke.cache" | "error.platform.cache";
"setUser": "done.invoke.getUser";
        };
        eventsCausingDelays: {
          "DISPLAY_TIME": "" | "PAGINATION/GOTO" | "PAGINATION/GOTO_FIRST_PAGE" | "PAGINATION/GOTO_LAST_PAGE" | "PAGINATION/GOTO_NEXT_PAGE" | "PAGINATION/GOTO_PREVIOUS_PAGE" | "PAGINATION/SET_PAGE_SIZE";
"THROTTLE_TIME": "" | "CQRS/SEND/REFETCH" | "done.invoke.cache" | "done.state.table.work.cqrs.cacheMore" | "done.state.table.work.cqrs.cacheQuery" | "error.platform.cache";
        };
        eventsCausingGuards: {
          "hasPageSize": "";
"itemsAreCached": "";
"queryIsCached": "";
        };
        eventsCausingServices: {
          "cache": "done.invoke.getUser";
"cqrs": "done.invoke.cache" | "error.platform.cache";
"getEnVariables": "RINIT" | "xstate.init";
"getUser": "done.invoke.optional";
"optional": "done.invoke.getEnVariables";
        };
        matchesStates: "cache" | "config" | "config.environment" | "config.optional" | "error" | "user" | "work" | "work.cqrs" | "work.cqrs.busy" | "work.cqrs.cacheMore" | "work.cqrs.cacheMore.check" | "work.cqrs.cacheMore.produce" | "work.cqrs.cacheMore.produce.check" | "work.cqrs.cacheMore.produce.items" | "work.cqrs.cacheMore.produce.send" | "work.cqrs.cacheMore.send" | "work.cqrs.cacheQuery" | "work.cqrs.cacheQuery.check" | "work.cqrs.cacheQuery.produce" | "work.cqrs.cacheQuery.produce.check" | "work.cqrs.cacheQuery.produce.items" | "work.cqrs.cacheQuery.produce.send" | "work.cqrs.cacheQuery.send" | "work.cqrs.ready" | "work.cqrs.resetCache" | "work.pagination" | "work.pagination.busy" | "work.pagination.config" | "work.pagination.ready" | { "config"?: "environment" | "optional";
"work"?: "cqrs" | "pagination" | { "cqrs"?: "busy" | "cacheMore" | "cacheQuery" | "ready" | "resetCache" | { "cacheMore"?: "check" | "produce" | "send" | { "produce"?: "check" | "items" | "send"; };
"cacheQuery"?: "check" | "produce" | "send" | { "produce"?: "check" | "items" | "send"; }; };
"pagination"?: "busy" | "config" | "ready"; }; };
        tags: never;
      }
  