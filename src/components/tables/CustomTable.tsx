import {Button, Stack, Table} from "react-bootstrap";
import {useMemo, useState} from "react";
import "./CustomTable.css";
import TableCell from "./TableCell.tsx";
import {usePagination} from "./usePagination.ts";
import {exportRowsToCSV} from "../../utils/format.ts";
import {DEFAULT_MAX_NR_TABLE_ROWS, DEFAULT_MAX_NR_TABLE_ROWS_STRING} from "../../utils/constants.ts";

interface CustomTableProps {
    // Optional DOM id of the <table>
    tableId?: string;

    // Base name of the CSV file (without ".csv"). Defaults to tableId, then to "ricgraph-export"
    exportName?: string;

    header?: string;

    columns: string[];

    // The full set of rows loaded (so far)
    data: Record<string, any>[];

    onClickValue?: (entry: Record<string, any>) => void;

    // Rows shown per page
    // 0 or undefined = everything on one page
    pageSize?: number;

    // Progressive loading: there are more rows on the server that can be appended to data
    // Paging past the last loaded page fetches the next batch and advances onto it
    hasMore?: boolean;
    isLoadingMore?: boolean;
    onLoadMore?: () => void;

    // Show the row count and the "Export table to CSV" link below the table. Default: true
    showFooter?: boolean;
}

// One complete result table: header text, sortable table, row count + CSV export, Previous / Next pager.
//
// Sorting, paging, the row count and the export all work on the full list of loaded rows (data):
// the rows are sorted first and then cut into pages, so a sort applies to everything loaded
// and not only to the rows on the current page.
function CustomTable({
                         tableId,
                         exportName,
                         header,
                         columns,
                         data,
                         onClickValue,
                         pageSize,
                         hasMore,
                         isLoadingMore,
                         onLoadMore,
                         showFooter = true,
                     }: CustomTableProps) {
    const [sort, setSort] = useState<{ key: string; asc: boolean } | null>(null);

    // Sorts all loaded rows alphabetically, based on the column selected.
    const sortedData = useMemo(() => {
        if (!sort) return data;

        return [...data].sort((a, b) => {
            const get = (row: Record<string, any>): string => {
                const value = row[sort.key];
                return Array.isArray(value) ? value.join(", ") : value || "";
            };

            const result = get(a).localeCompare(get(b), navigator.language, {
                sensitivity: "base",
                numeric: true
            });

            return sort.asc ? result : -result;
        });
    }, [data, sort]);

    const {
        visibleRows,
        showPager,
        page,
        totalPages,
        pageStart,
        pageEnd,
        moreToLoad,
        nextIsLoading,
        canGoPrevious,
        canGoNext,
        goToFirstPage,
        goToPreviousPage,
        goToNextPage,
    } = usePagination({
        rows: sortedData,
        pageSize,
        hasMore,
        isLoadingMore,
        onLoadMore,
    });

    function onSortColumn(key: string) {
        setSort(prev =>
            prev?.key === key
                ? {key, asc: !prev.asc}
                : {key, asc: true});
        goToFirstPage();
    }

    // A table without rows is not shown at all (no header, no column titles, no footer).
    // This check comes after all hooks on purpose: hooks may not be skipped by an early return.
    if (data.length === 0) return null;

    const total = data.length;
    let summary: string;
    if (total === 1 && !hasMore) {
        summary = "There is 1 row in this table.";
    } else if (totalPages > 1) {
        summary = `Showing rows ${pageStart + 1}-${pageEnd} of ${total}${hasMore ? "+ (loaded so far)" : ""}.`;
    } else if (hasMore) {
        summary = `${total} row${total === 1 ? "" : "s"} loaded so far.`;
    } else {
        summary = `There are ${total} rows in this table.`;
    }

    return (
        <>
            {header && <p>{header}</p>}
            <Table id={tableId} bordered hover responsive className={"custom-table"}>
                <thead>
                <tr>
                    {columns.map(column => (
                        <th key={column}>
                            <button
                                type="button"
                                className="sort-header-btn"
                                onClick={() => onSortColumn(column)}
                            >
                                {column}
                                {sort?.key === column && (sort.asc ? " ▴" : " ▾")}
                            </button>
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {visibleRows.map((row, index) => (
                    <tr key={row.value + "-" + index}>
                        {columns.map(column => (
                            <TableCell key={column} column={column} row={row} onClickValue={onClickValue}/>
                        ))}
                    </tr>
                ))}
                </tbody>
            </Table>

            {showFooter && (
                <Stack direction={"horizontal"} className={"justify-content-between align-items-center"}>
                    <p>{summary}</p>

                    <Button
                        variant={"link"}
                        onClick={() => exportRowsToCSV(
                            sortedData,
                            columns,
                            exportName ?? tableId ?? "ricgraph-export",
                            DEFAULT_MAX_NR_TABLE_ROWS,
                        )}
                        className={"p-0 align-baseline"}
                    >
                        Export table to CSV file, at most {DEFAULT_MAX_NR_TABLE_ROWS_STRING} rows.
                    </Button>
                </Stack>
            )}

            {showPager && (
                <Stack direction={"horizontal"} gap={2} className={"justify-content-center align-items-center"}>
                    <Button className={"uu-yellow"} disabled={!canGoPrevious} onClick={goToPreviousPage}>
                        Previous
                    </Button>
                    <span>
                        Page {page + 1} of {totalPages}{moreToLoad ? "+" : ""}
                    </span>
                    <Button className={"uu-yellow"} disabled={!canGoNext} onClick={goToNextPage}>
                        {nextIsLoading ? "Loading…" : "Next"}
                    </Button>
                </Stack>
            )}
        </>
    );
}

export default CustomTable;
