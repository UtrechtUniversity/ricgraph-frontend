import {Card, Container} from "react-bootstrap";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import './SearchResultsPage.css'
import PaginatedResultsTable from "../../components/tables/PaginatedResultsTable.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import {useSearchResultColumns} from "../../hooks/useSearchResultColumns.ts";
import TitleCard from "../../components/TitleCard.tsx";
import {getDiscovererMode, getParamOrEmpty} from "../../utils/params.ts";
import {useEntryNavigate} from "../../hooks/useEntryNavigate.ts";
import {getEntryTargetPage} from "../../utils/navigation.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, type UrlEntry} from "../../api/general.ts";
import {fetchAdvancedSearch, fetchBroadSearch} from "../../api/endpoints/advanced.ts";
import {fetchPerson} from "../../api/endpoints/person.ts";
import {fetchOrganization} from "../../api/endpoints/organization.ts";
import {queryClient} from "../../api/queryClient.ts";
import {usePaginatedQuery} from "../../hooks/usePaginatedQuery.ts";

type SearchType = "broad" | "advanced" | "person" | "organization";

const SEARCH_TYPE_CONFIG: Record<SearchType, { fetch: (request: any) => Promise<any> }> = {
    broad: {fetch: fetchBroadSearch},
    advanced: {fetch: fetchAdvancedSearch},
    person: {fetch: fetchPerson},
    organization: {fetch: fetchOrganization}
};

function SearchResultsPage() {
    const navigate = useNavigate();
    const navigateToEntry = useEntryNavigate();
    const [searchParams] = useSearchParams();

    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const searchType: SearchType = (searchParams.get("search_type") ?? "broad") as SearchType;
    const name = getParamOrEmpty(searchParams, "name");
    const category = getParamOrEmpty(searchParams, "category");
    const value = getParamOrEmpty(searchParams, "value");

    const maxNrTableRowsParam = searchParams.get("max_nr_table_rows");
    const pageSize = getTableRowsPerPage({max_nr_table_rows: maxNrTableRowsParam});

    const {
        data: results,
        isPending,
        isFetchingNextPage,
        hasMore,
        isComplete,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["search-results", searchType, name, category, value, pageSize],
        async (cursor) => {
            const fetcher = SEARCH_TYPE_CONFIG[searchType]?.fetch ?? fetchBroadSearch;
            const response = await fetcher({
                name,
                category,
                value,
                page_size: String(pageSize),
                cursor,
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta?.next_cursor)};
        }
    );

    useEffect(() => {
        // If the whole result set is a single item, go straight to its target page
        if (isComplete && results.length === 1) {
            const entry = results[0] as UrlEntry;
            queryClient.setQueryData(["selected-entry", entry._key], entry);
            navigate(getEntryTargetPage(entry, searchParams));
        }
    }, [navigate, results, isComplete, searchParams]);

    if (isPending) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Selection page</TitleCard>

            <Card>
                <Card.Body>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        {
                            results.length === 0 ? (
                                <p>Your search resulted in no items.</p>
                            ) : (
                                <p>Please choose an item to continue:</p>
                            )
                        }
                        <p>Showing {results.length} result{results.length === 1 ? "" : "s"}{hasMore ? " so far" : ""}.</p>
                    </div>

                    { /* Results table */}

                    <PaginatedResultsTable
                        data={results}
                        columns={columns}
                        onClickValue={(entry) => navigateToEntry(entry as UrlEntry)}
                        pageSize={pageSize}
                        hasMore={hasMore}
                        isComplete={isComplete}
                        isFetchingNextPage={isFetchingNextPage}
                        loadNextPage={loadNextPage}
                        loadAll={loadAll}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SearchResultsPage;

