import {useEffect, useRef, useState} from "react";

interface Options<T> {
    // Every row loaded so far. Grows over time when more pages are fetched (see usePaginatedQuery).
    rows: T[];
    // Rows shown per page
    // 0 or undefined = one page with everything
    pageSize?: number;
    // More rows can still be fetched from the server
    hasMore?: boolean;
    isLoadingMore?: boolean;
    onLoadMore?: () => void;
}

// Pages through an accumulating list. Going past the last loaded page calls onLoadMore() and,
// once that fetch finishes, steps onto the page that just arrived.
export function usePagination<T>({rows, pageSize, hasMore, isLoadingMore, onLoadMore}: Options<T>) {
    const size = pageSize && pageSize > 0 ? pageSize : Math.max(rows.length, 1);
    const totalPages = Math.max(1, Math.ceil(rows.length / size));

    const [requestedPage, setRequestedPage] = useState(0);
    // Clamp every render so a shrinking 'rows' (like a filter above the table)
    // can't strand us on a page that no longer exists.
    const page = Math.min(requestedPage, totalPages - 1);

    const canLoadMore = Boolean(hasMore && onLoadMore);
    const atLoadedEnd = page >= totalPages - 1;

    // When "Next" gives more data, advance onto the new page once loading finishes.
    const advanceAfterLoad = useRef(false);
    useEffect(() => {
        if (!isLoadingMore && advanceAfterLoad.current) {
            advanceAfterLoad.current = false;
            setRequestedPage(p => p + 1);
        }
    }, [isLoadingMore]);

    function goToFirstPage() {
        setRequestedPage(0);
    }

    function goToPreviousPage() {
        setRequestedPage(Math.max(0, page - 1));
    }

    function goToNextPage() {
        if (!atLoadedEnd) {
            setRequestedPage(page + 1);
        } else if (canLoadMore && !isLoadingMore) {
            advanceAfterLoad.current = true;
            onLoadMore!();
        }
    }

    return {
        visibleRows: rows.slice(page * size, page * size + size),
        showPager: totalPages > 1 || canLoadMore || page > 0,
        // Which rows of the loaded list are on this page (pageStart is 0-based, pageEnd is exclusive)
        pageStart: page * size,
        pageEnd: Math.min(page * size + size, rows.length),
        // Props for the pager:
        page,
        totalPages,
        moreToLoad: canLoadMore,
        nextIsLoading: Boolean(isLoadingMore) && atLoadedEnd,
        canGoPrevious: page > 0,
        canGoNext: !atLoadedEnd || (canLoadMore && !isLoadingMore),
        goToFirstPage,
        goToPreviousPage,
        goToNextPage,
    };
}
