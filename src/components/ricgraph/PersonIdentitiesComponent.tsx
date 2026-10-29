import {Card, Stack} from "react-bootstrap";
import RicgraphResultCard from "./RicgraphResultCard.tsx";
import TabbedTable from "../tables/TabbedTable.tsx";
import ResultsStatusBar from "../tables/ResultsStatusBar.tsx";
import {DEFAULT_PERSON_CATEGORIES_ACTIVE, PERSON_IDENTITY_EXCLUDED_NAMES} from "../../utils/constants.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../api/general.ts";
import {getDiscovererMode} from "../../utils/params.ts";
import {useSearchResultColumns} from "../../hooks/useSearchResultColumns.ts";
import {useSearchParams} from "react-router-dom";
import RicgraphHistogram from "./RicgraphHistogram.tsx";
import {fetchAllNeighborNodes, getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import {usePaginatedQuery} from "../../hooks/usePaginatedQuery.ts";

interface PersonIdentitiesComponentProps {
    header?: string;
    person: Entry;
    onClickValue?: (entry: Entry) => void;
}

function PersonIdentitiesComponent({
                                       header,
                                       person,
                                       onClickValue
                                   }: PersonIdentitiesComponentProps) {
    const [searchParams] = useSearchParams();
    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const urlEntry = toEntry(searchParams);
    const pageSize = getTableRowsPerPage(urlEntry);

    const nodeInfo = getRicgraphNodeInfo().data;
    const personCategories = nodeInfo?.person_category_active ?? DEFAULT_PERSON_CATEGORIES_ACTIVE;
    const personKey = person._key;

    const {
        data,
        hasMore,
        isComplete,
        isPending,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["entry-neighbors", personKey, personCategories.join("|"), pageSize],
        async (cursor) => {
            const response = await fetchAllNeighborNodes({
                key: personKey ?? "",
                category_want: personCategories,
                cursor,
                page_size: String(pageSize)
            });
            const results: Entry[] = (response?.results ?? [])
                .filter(entry => !PERSON_IDENTITY_EXCLUDED_NAMES.includes(entry.name));
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(personKey)}
    );

    return (
        <RicgraphResultCard header={header} loading={isPending} bodyClassName={"p-4"}>
            <ResultsStatusBar
                isComplete={isComplete}
                loadedCount={data.length}
                isLoadingMore={isFetchingNextPage}
                onLoadAll={loadAll}
            />
            <Stack direction={"horizontal"} gap={4} className={"align-items-start"}>

                <Stack gap={4} style={{flex: "0 0 20%"}}> {/* This stack contains the smaller card items on the left (histograms, etc) */}
                    <RicgraphHistogram topic={"name"} data={data}/>
                    <RicgraphHistogram topic={"category"} data={data}/>
                </Stack>

                <Stack gap={4} style={{flex: "1 1 0%", minWidth: 0}}>  {/* This stack contains the bigger items on the right (tables, etc) */}
                    <Card>
                        <Card.Body>
                            <TabbedTable
                                header={"These are the identities related to this person:"}
                                columns={columns}
                                data={data}
                                groupBy={"name"}
                                onClickValue={entry => onClickValue && onClickValue(entry as Entry)}
                                pageSize={pageSize}
                                hasMore={hasMore}
                                isLoadingMore={isFetchingNextPage}
                                onLoadMore={loadNextPage}
                            />
                        </Card.Body>
                    </Card>

                </Stack>
            </Stack>
        </RicgraphResultCard>
    );
}

export default PersonIdentitiesComponent;