import {useSearchParams} from "react-router-dom";
import {Card, Container} from "react-bootstrap";
import TitleCard from "../../../../components/TitleCard.tsx";
import ItemFound from "../../../../components/ItemFound.tsx";
import {fetchPersonResearchRelated} from "../../../../api/endpoints/person.ts";
import {useEntryNavigate} from "../../../../hooks/useEntryNavigate.ts";
import {useSearchResultColumns} from "../../../../hooks/useSearchResultColumns.ts";
import {getDiscovererMode} from "../../../../utils/params.ts";
import CustomTable from "../../../../components/tables/CustomTable.tsx";
import ResultsStatusBar from "../../../../components/tables/ResultsStatusBar.tsx";
import LoadingSpinner from "../../../../components/LoadingSpinner.tsx";
import {useSelectedEntry} from "../../../../hooks/useSelectedEntry.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../../../api/general.ts";
import {usePaginatedQuery} from "../../../../hooks/usePaginatedQuery.ts";

function PersonShareResearchResultsPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();
    const columns = useSearchResultColumns(getDiscovererMode(searchParams));

    const query = useSelectedEntry();
    const entry = query.data;

    const entryKey = entry?._key ?? "";
    const pageSize = getTableRowsPerPage(toEntry(searchParams));

    const {
        data,
        hasMore,
        isComplete,
        isPending,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["person-share-research", entryKey, pageSize],
        async (cursor) => {
            const response = await fetchPersonResearchRelated({
                key: entryKey,
                cursor,
                page_size: String(pageSize),
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(entryKey)},
    );

    if (!entry) {
        return (
            <p>Invalid person!</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Persons that share research results with this person</TitleCard>

            <ItemFound searchParams={searchParams} result={entry}/>

            <Card>
                <Card.Body>
                    {
                        isPending ? (
                            <LoadingSpinner/>
                        ) : (
                            <>
                                <ResultsStatusBar
                                    isComplete={isComplete}
                                    loadedCount={data.length}
                                    isLoadingMore={isFetchingNextPage}
                                    onLoadAll={loadAll}
                                />
                                <CustomTable
                                    header={"These are persons that share a research result type with this person:"}
                                    columns={columns}
                                    data={data}
                                    onClickValue={navigateToEntry}
                                    pageSize={pageSize}
                                    hasMore={hasMore}
                                    isLoadingMore={isFetchingNextPage}
                                    onLoadMore={loadNextPage}
                                />
                            </>
                        )
                    }
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PersonShareResearchResultsPage;
