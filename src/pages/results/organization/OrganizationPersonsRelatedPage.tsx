import {useSearchParams} from "react-router-dom";
import {Card, Container} from "react-bootstrap";
import {getDiscovererMode} from "../../../utils/params.ts";
import {useEntryNavigate} from "../../../hooks/useEntryNavigate.ts";
import {useSearchResultColumns} from "../../../hooks/useSearchResultColumns.ts";
import TitleCard from "../../../components/TitleCard.tsx";
import ItemFound from "../../../components/ItemFound.tsx";
import CustomTable from "../../../components/tables/CustomTable.tsx";
import ResultsStatusBar from "../../../components/tables/ResultsStatusBar.tsx";
import {fetchAllNeighborNodes} from "../../../api/endpoints/advanced.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import {useSelectedEntry} from "../../../hooks/useSelectedEntry.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../../api/general.ts";
import {usePaginatedQuery} from "../../../hooks/usePaginatedQuery.ts";

function OrganizationPersonsRelatedPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const entryQuery = useSelectedEntry();
    const entry = entryQuery.data;

    const organizationKey = searchParams.get("_key") ?? "";
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
        ["organization-related-persons", organizationKey, pageSize],
        async (cursor) => {
            const response = await fetchAllNeighborNodes({
                key: organizationKey,
                category_want: ["person"],
                cursor,
                page_size: String(pageSize),
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(organizationKey)},
    );

    return (
        <Container fluid>
            <TitleCard>Persons related to this organization</TitleCard>

            {/*--------------------------------------------------------------------*/}

            {
                entryQuery.isPending ?
                    (
                        <LoadingSpinner/>
                    )
                    : (
                        <ItemFound searchParams={searchParams}
                                   result={entry}/>
                    )
            }

            {/*--------------------------------------------------------------------*/}

            {
                isPending ?
                    (
                        <LoadingSpinner/>
                    ) : (
                        <Card>
                            <Card.Body>
                                <ResultsStatusBar
                                    isComplete={isComplete}
                                    loadedCount={data.length}
                                    isLoadingMore={isFetchingNextPage}
                                    onLoadAll={loadAll}
                                />
                                <CustomTable
                                    header={"These are persons related to this organization:"}
                                    data={data}
                                    columns={columns}
                                    onClickValue={navigateToEntry}
                                    pageSize={pageSize}
                                    hasMore={hasMore}
                                    isLoadingMore={isFetchingNextPage}
                                    onLoadMore={loadNextPage}
                                />
                            </Card.Body>
                        </Card>
                    )
            }
        </Container>
    );
}

export default OrganizationPersonsRelatedPage;
