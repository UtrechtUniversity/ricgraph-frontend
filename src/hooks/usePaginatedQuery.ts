import {useCallback, useMemo} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";

interface Page<TRow> {
    data: TRow[];
    nextCursor?: string;
}

// loadAll() has no cancel button and no progress indicator other than "still incomplete",
// so if the backend ever fails to end the cursor (a bug, a cursor cycle, or just a huge result set,
// it would fire requests indefinitely with no way to stop it other than leaving the page,
// which since the query cache is memory-only, throws away every page already loaded.
// This caps it at 200 pages regardless of what the backend says, trading "load everything, no matter what"
// for "give up after a bounded amount of work".
// Calling loadAll() again after hitting the cap resumes from where it stopped, so this is not
// a hard ceiling on a table's size, just on one loadAll() call.
const LOAD_ALL_PAGE_CAP = 200;


// Cursor-paginated query that accumulates pages
//
// Every page fetched so far is kept (react-query's useInfiniteQuery cache), so 'data' is the
// union of all pages seen. Tab counts and histograms are built from 'data' therefore only ever
// grow as you page, they never swap out. Navigating away and back re-uses the cached pages.
//
// - fetchPage(cursor): the caller's API call. Returns this page's rows + the cursor for the
//   next page (empty/undefined when there is no next page).
// - loadNextPage(): fetch and append the next page.
// - loadAll(): keep fetching until every page is loaded.
// - isComplete: true once there are no more pages to fetch.
export function usePaginatedQuery<TRow>(
    baseQueryKey: unknown[],
    fetchPage: (cursor: string | undefined) => Promise<Page<TRow>>,
    options?: { enabled?: boolean }
) {
    const query = useInfiniteQuery({
        // Namespaced so these never collide with a plain useQuery that shares a base key
        queryKey: ["paged", ...baseQueryKey],
        queryFn: ({pageParam}) => fetchPage(pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        enabled: options?.enabled,
    });

    const {fetchNextPage, hasNextPage, isFetchingNextPage} = query;

    const data = useMemo<TRow[]>(
        () => (query.data?.pages ?? []).flatMap(page => page.data),
        [query.data],
    );

    const loadNextPage = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const loadAll = useCallback(async () => {
        if (!hasNextPage) return;
        let more = true;
        for (let i = 0; i < LOAD_ALL_PAGE_CAP && more; i++) {
            const result = await fetchNextPage();
            more = !result.isError && (result.hasNextPage ?? false);
        }
    }, [hasNextPage, fetchNextPage]);

    return {
        data,
        isPending: query.isPending,
        isFetching: query.isFetching,
        isFetchingNextPage,
        hasMore: hasNextPage,
        isComplete: query.isSuccess && !hasNextPage,
        loadedPageCount: query.data?.pages.length ?? 0,
        loadNextPage,
        loadAll,
        error: query.error,
    };
}
