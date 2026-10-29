import {QueryCache, QueryClient} from "@tanstack/react-query";

export const queryClient = new QueryClient({
    // Logged here instead of individual pages, so that any failed query gets logged.
    queryCache: new QueryCache({
        onError: (error, query) => {
            console.error(`Query failed [${query.queryKey.join(", ")}]:`, error);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__:
            import('@tanstack/query-core')
                .QueryClient
    }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient