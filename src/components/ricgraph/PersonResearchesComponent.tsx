import {Card, Stack} from "react-bootstrap";
import RicgraphResultCard from "./RicgraphResultCard.tsx";
import {DEFAULT_RESEARCH_CATEGORIES_ACTIVE, DISCOVERER_MODE_DETAILS,} from "../../utils/constants.ts";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../api/general.ts";
import {getDiscovererMode} from "../../utils/params.ts";
import {useSearchResultColumns} from "../../hooks/useSearchResultColumns.ts";
import {useSearchParams} from "react-router-dom";
import CustomTable from "../tables/CustomTable.tsx";
import ResultsStatusBar from "../tables/ResultsStatusBar.tsx";
import RicgraphHistogram from "./RicgraphHistogram.tsx";
import {useMemo, useState} from "react";
import {fetchAllNeighborNodes, getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import TabbedTable from "../tables/TabbedTable.tsx";
import RicgraphFilter from "./RicgraphFilter.tsx";
import {usePaginatedQuery} from "../../hooks/usePaginatedQuery.ts";
import YearFilterCard from "../YearFilterCard.tsx";
import {getYearRange, getYearRangeText} from "../../utils/years.ts";

interface PersonResearchesComponentProps {
    header?: string;
    person: Entry;
    onClickValue?: (entry: Entry) => void;
}

function PersonResearchesComponent({
                                       header,
                                       person,
                                       onClickValue,
                                   }: PersonResearchesComponentProps) {
    const [searchParams] = useSearchParams();
    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const urlEntry = toEntry(searchParams);
    const pageSize = getTableRowsPerPage(urlEntry);

    // --------------------

    const personKey = person?._key;
    const nodeInfo = getRicgraphNodeInfo().data;
    const researchCategories = nodeInfo?.researchresult_category_active ?? DEFAULT_RESEARCH_CATEGORIES_ACTIVE;
    const {yearOptions, yearMin, yearMax} = getYearRange(nodeInfo);

    const {
        data,
        hasMore,
        isComplete,
        isPending,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["entry-neighbors", personKey, researchCategories.join("|"), pageSize],
        async (cursor) => {
            const response = await fetchAllNeighborNodes({
                key: personKey ?? "",
                category_want: researchCategories,
                cursor,
                page_size: String(pageSize)
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(personKey)}
    );

    // --------------------

    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [yearFirst, setYearFirst] = useState("");
    const [yearLast, setYearLast] = useState("");

    const filteredData = useMemo(() => {
        return data.filter(entry => {
            const name = String(entry.name ?? "Unknown");
            const category = String(entry.category ?? "Unknown");
            const entryYear = Number(entry.year);

            const nameMatches =
                selectedNames.length === 0 || selectedNames.includes(name);

            const categoryMatches =
                selectedCategories.length === 0 || selectedCategories.includes(category);

            const yearMatches =
                (yearFirst === "" && yearLast === "") ||
                (!Number.isNaN(entryYear)
                    && (yearFirst === "" || entryYear >= Number(yearFirst))
                    && (yearLast === "" || entryYear <= Number(yearLast)));

            return nameMatches && categoryMatches && yearMatches;
        });
    }, [data, selectedNames, selectedCategories, yearFirst, yearLast]);

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
                    <YearFilterCard
                        yearFirstDefault={yearFirst}
                        yearLastDefault={yearLast}
                        yearOptions={yearOptions}
                        yearMin={yearMin}
                        yearMax={yearMax}
                        onChange={(first, last) => {
                            setYearFirst(first);
                            setYearLast(last);
                        }}
                    />

                    { // Add a filter component if details_view
                        discovererMode === DISCOVERER_MODE_DETAILS &&
                        (
                            <>
                                <RicgraphFilter
                                    topic="name"
                                    data={data}
                                    selectedValues={selectedNames}
                                    onChange={setSelectedNames}
                                />

                                <RicgraphFilter
                                    topic="category"
                                    data={data}
                                    selectedValues={selectedCategories}
                                    onChange={setSelectedCategories}
                                />
                            </>
                        )
                    }

                    <RicgraphHistogram topic={"name"} data={data}/>
                    <RicgraphHistogram topic={"category"} data={data}/>
                    <RicgraphHistogram topic={"year"} data={data}/>
                    <RicgraphHistogram topic={"license"} data={data}/>
                    <RicgraphHistogram topic={"access"} data={data}/>

                </Stack>

                <Stack gap={4} style={{flex: "1 1 0%", minWidth: 0}}> {/* This stack contains the bigger items on the right (tables, etc) */}
                    <Card>
                        <Card.Body>
                            {
                                discovererMode === DISCOVERER_MODE_DETAILS
                                    ? ( // If details_view, render a regular table
                                        <CustomTable
                                            header={`These are the research results related to this person ${getYearRangeText(yearFirst, yearLast)}:`}
                                            data={filteredData}
                                            columns={columns}
                                            onClickValue={entry => onClickValue && onClickValue(entry as Entry)}
                                            pageSize={pageSize}
                                            hasMore={hasMore}
                                            isLoadingMore={isFetchingNextPage}
                                            onLoadMore={loadNextPage}
                                        />
                                    )
                                    : ( // If person_view, render a tabbed table
                                        <TabbedTable
                                            header={`These are the research results related to this person ${getYearRangeText(yearFirst, yearLast)}:`}
                                            columns={columns}
                                            data={filteredData}
                                            onClickValue={entry => onClickValue && onClickValue(entry as Entry)}
                                            pageSize={pageSize}
                                            hasMore={hasMore}
                                            isLoadingMore={isFetchingNextPage}
                                            onLoadMore={loadNextPage}
                                        />
                                    )
                            }
                        </Card.Body>
                    </Card>

                </Stack>
            </Stack>
        </RicgraphResultCard>
    );
}

export default PersonResearchesComponent;