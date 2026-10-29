import {useSearchParams} from "react-router-dom";
import {getDiscovererMode} from "../../utils/params.ts";
import {useEntryNavigate} from "../../hooks/useEntryNavigate.ts";
import {fetchAllNeighborNodes} from "../../api/endpoints/advanced.ts";
import {Card, Container} from "react-bootstrap";
import TitleCard from "../../components/TitleCard.tsx";
import ItemFound from "../../components/ItemFound.tsx";
import PaginatedResultsTable from "../../components/tables/PaginatedResultsTable.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import {useSearchResultColumns} from "../../hooks/useSearchResultColumns.ts";
import {useSelectedEntry} from "../../hooks/useSelectedEntry.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../api/general.ts";
import {usePaginatedQuery} from "../../hooks/usePaginatedQuery.ts";

function OtherInformationPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const entryQuery = useSelectedEntry();
    const entry = entryQuery.data ?? null;

    const entryKey = entry?._key ?? "";
    const pageSize = getTableRowsPerPage(toEntry(searchParams));

    const {
        data: neighborData,
        hasMore,
        isComplete,
        isPending,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["entry-neighbors", entryKey, pageSize],
        async (cursor) => {
            const response = await fetchAllNeighborNodes({
                key: entryKey,
                cursor,
                page_size: String(pageSize),
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(entryKey)},
    );

    if (entry == null) {
        return (
            <p>Entry not found</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>All information related to this {entry.category}</TitleCard>

            {/*--------------------------------------------------------------------*/}

            <ItemFound searchParams={searchParams}
                       result={entry}/>

            {/*--------------------------------------------------------------------*/}

            <Card>
                <Card.Body>
                    <p>This is all information related to this {entry?.category}:</p>
                    {
                        isPending ? (
                            <LoadingSpinner/>
                        ) : (
                            <PaginatedResultsTable
                                data={neighborData}
                                columns={columns}
                                onClickValue={navigateToEntry}
                                pageSize={pageSize}
                                hasMore={hasMore}
                                isComplete={isComplete}
                                isFetchingNextPage={isFetchingNextPage}
                                loadNextPage={loadNextPage}
                                loadAll={loadAll}
                            />
                        )
                    }
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OtherInformationPage;
