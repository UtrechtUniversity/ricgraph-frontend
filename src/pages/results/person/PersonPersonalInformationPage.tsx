import {useSearchParams} from "react-router-dom";
import {Card, Container} from "react-bootstrap";
import TitleCard from "../../../components/TitleCard.tsx";
import ItemFound from "../../../components/ItemFound.tsx";
import {getDiscovererMode} from "../../../utils/params.ts";
import {useEntryNavigate} from "../../../hooks/useEntryNavigate.ts";
import {DISCOVERER_MODE_DETAILS} from "../../../utils/constants.ts";
import {useSearchResultColumns} from "../../../hooks/useSearchResultColumns.ts";
import CustomTable from "../../../components/tables/CustomTable.tsx";
import ResultsStatusBar from "../../../components/tables/ResultsStatusBar.tsx";
import {fetchAllNeighborNodes} from "../../../api/endpoints/advanced.ts";
import NameVariantsComponent from "../../../components/ricgraph/NameVariantsComponent.tsx";
import PersonIdentitiesComponent from "../../../components/ricgraph/PersonIdentitiesComponent.tsx";
import {usePaginatedQuery} from "../../../hooks/usePaginatedQuery.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../../api/general.ts";
import {useSelectedEntry} from "../../../hooks/useSelectedEntry.ts";
import {usePersonRoot} from "../../../hooks/usePersonRoot.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";

function PersonPersonalInformationPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const simpleEntry = toEntry(searchParams);
    const pageSize = getTableRowsPerPage(simpleEntry);

    const entryQuery = useSelectedEntry();
    const entry = entryQuery.data;

    const personRootQuery = usePersonRoot(simpleEntry._key ?? "");
    const personEntry = personRootQuery.data;

    const personKey = personEntry?._key;
    const {
        data,
        isPending: isPersonalDataPending,
        hasMore,
        isComplete,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["person-personal-data", personKey, pageSize],
        async (cursor) => {
            const response = await fetchAllNeighborNodes({
                key: personKey ?? "",
                category_want: ["person"],
                cursor,
                page_size: String(pageSize)
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(personKey)}
    );

    if (personRootQuery.isPending) {
        return (
            <LoadingSpinner/>
        );
    }

    if (!personEntry) {
        return (
            <p>Invalid person!</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Personal information related to this person</TitleCard>

            <ItemFound searchParams={searchParams} result={entry}/>

            {
                isPersonalDataPending ? (
                    <LoadingSpinner/>
                ) : discovererMode === DISCOVERER_MODE_DETAILS
                    ? (
                        // details_view
                        <Card>
                            <Card.Body>
                                <ResultsStatusBar
                                    isComplete={isComplete}
                                    loadedCount={data.length}
                                    isLoadingMore={isFetchingNextPage}
                                    onLoadAll={loadAll}
                                />
                                <CustomTable header={"This is personal information related to this person:"}
                                             columns={columns}
                                             data={data}
                                             onClickValue={navigateToEntry}
                                             pageSize={pageSize}
                                             hasMore={hasMore}
                                             isLoadingMore={isFetchingNextPage}
                                             onLoadMore={loadNextPage}
                                />
                            </Card.Body>
                        </Card>
                    )
                    : (
                        // person_view
                        <>
                            <NameVariantsComponent person={personEntry}/>

                            <PersonIdentitiesComponent
                                person={personEntry}
                                onClickValue={navigateToEntry}/>
                        </>
                    )
            }
        </Container>
    );
}

export default PersonPersonalInformationPage;
