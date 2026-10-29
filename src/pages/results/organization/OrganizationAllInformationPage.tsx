import {useSearchParams} from "react-router-dom";
import {Card, Container} from "react-bootstrap";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../../api/general.ts";
import {fetchOrganizationAllInformation} from "../../../api/endpoints/organization.ts";
import {getDiscovererMode} from "../../../utils/params.ts";
import {useEntryNavigate} from "../../../hooks/useEntryNavigate.ts";
import {useSearchResultColumns} from "../../../hooks/useSearchResultColumns.ts";
import TitleCard from "../../../components/TitleCard.tsx";
import ItemFound from "../../../components/ItemFound.tsx";
import CustomTable from "../../../components/tables/CustomTable.tsx";
import ResultsStatusBar from "../../../components/tables/ResultsStatusBar.tsx";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import {usePaginatedQuery} from "../../../hooks/usePaginatedQuery.ts";
import {useSelectedEntry} from "../../../hooks/useSelectedEntry.ts";

function OrganizationAllInformationPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const urlEntry = toEntry(searchParams);
    const organizationKey = urlEntry._key ?? "";
    const pageSize = getTableRowsPerPage(urlEntry);

    const entryQuery = useSelectedEntry();
    const entry = entryQuery.data;

    const {
        data,
        hasMore,
        isComplete,
        isPending,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["organization-all-info", organizationKey, pageSize],
        async (cursor) => {
            const response = await fetchOrganizationAllInformation({
                key: organizationKey,
                cursor,
                page_size: String(pageSize)
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(organizationKey)}
    );

    return (
        <Container fluid>
            <TitleCard>All information related to this organization</TitleCard>

            {/*--------------------------------------------------------------------*/}

            {
                entryQuery.isPending ? (
                        <LoadingSpinner/>
                    )
                    : (
                        <ItemFound searchParams={searchParams}
                                   result={entry}/>
                    )
            }

            {/*--------------------------------------------------------------------*/}

            {
                isPending ? (
                        <LoadingSpinner/>
                    )
                    : (
                        <Card>
                            <Card.Body>
                                <ResultsStatusBar
                                    isComplete={isComplete}
                                    loadedCount={data.length}
                                    isLoadingMore={isFetchingNextPage}
                                    onLoadAll={loadAll}
                                />
                                <CustomTable
                                    header={"This is all information related to this organization:"}
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

export default OrganizationAllInformationPage;
