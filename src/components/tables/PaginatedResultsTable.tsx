import CustomTable from "./CustomTable.tsx";
import ResultsStatusBar from "./ResultsStatusBar.tsx";

interface PaginatedResultsTableProps {
    header?: string;
    tableId?: string;
    columns: string[];
    data: Record<string, any>[];
    onClickValue?: (entry: Record<string, any>) => void;
    pageSize?: number;

    // These match the values returned by usePaginatedQuery
    hasMore?: boolean;
    isComplete: boolean;
    isFetchingNextPage: boolean;
    loadNextPage: () => void;
    loadAll: () => void;
}

// The standard result table: "Complete / Incomplete" status bar on top,
// then a sortable table with a Previous / Next pager that loads more pages on demand.
function PaginatedResultsTable({
                                   header,
                                   tableId,
                                   columns,
                                   data,
                                   onClickValue,
                                   pageSize,
                                   hasMore,
                                   isComplete,
                                   isFetchingNextPage,
                                   loadNextPage,
                                   loadAll,
                               }: PaginatedResultsTableProps) {
    return (
        <>
            {data.length > 0 && (
                <ResultsStatusBar
                    isComplete={isComplete}
                    loadedCount={data.length}
                    isLoadingMore={isFetchingNextPage}
                    onLoadAll={loadAll}
                />
            )}
            <CustomTable
                header={header}
                tableId={tableId}
                columns={columns}
                data={data}
                onClickValue={onClickValue}
                pageSize={pageSize}
                hasMore={hasMore}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={loadNextPage}
            />
        </>
    );
}

export default PaginatedResultsTable;
