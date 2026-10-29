import {Card, Container, Stack} from "react-bootstrap";
import TitleCard from "../../../components/TitleCard.tsx";
import ItemFound from "../../../components/ItemFound.tsx";
import {useSearchParams} from "react-router-dom";
import {getDiscovererMode} from "../../../utils/params.ts";
import {useEntryNavigate} from "../../../hooks/useEntryNavigate.ts";
import {useSearchResultColumns} from "../../../hooks/useSearchResultColumns.ts";
import {useQuery} from "@tanstack/react-query";
import type {OrganizationSearchResponse} from "../../../api/contracts/organizationContract.ts";
import {fetchOrganization, fetchOrganizationPersonsInfo} from "../../../api/endpoints/organization.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import RicgraphHistogram from "../../../components/ricgraph/RicgraphHistogram.tsx";
import TabbedTable from "../../../components/tables/TabbedTable.tsx";
import ResultsStatusBar from "../../../components/tables/ResultsStatusBar.tsx";
import {type Entry, getTableRowsPerPage, resolveNextCursor, toEntry} from "../../../api/general.ts";
import {usePaginatedQuery} from "../../../hooks/usePaginatedQuery.ts";

function OrganizationAnyInformationPersonsPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const urlEntry = toEntry(searchParams);
    const pageSize = getTableRowsPerPage(urlEntry);

    const organizationQuery = useQuery<OrganizationSearchResponse | null>({
        queryKey: ["organization-search", searchParams.toString()],
        queryFn: () => fetchOrganization({value: searchParams.get("value") ?? ""}),
        enabled: searchParams.has("value")
    });
    const organization = organizationQuery.data?.results[0];

    const nameList = searchParams
        .getAll("name_list")
        .map(value => value.trim())
        .filter(Boolean);

    const categoryList = searchParams
        .getAll("category_list")
        .map(value => value.trim())
        .filter(Boolean);

    const organizationKey = searchParams.get("_key") ?? organization?._key ?? "";

    const {
        data,
        hasMore,
        isComplete,
        isPending,
        isFetchingNextPage,
        loadNextPage,
        loadAll,
    } = usePaginatedQuery<Entry>(
        ["organization-information-persons-results", organizationKey, nameList.join("|"), categoryList.join("|"), pageSize],
        async (cursor) => {
            const response = await fetchOrganizationPersonsInfo({
                key: organizationKey,
                name_want: nameList.length > 0 ? nameList : undefined,
                category_want: categoryList.length > 0 ? categoryList : undefined,
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
            <TitleCard>Information about this organization</TitleCard>

            {/*--------------------------------------------------------------------*/}

            {
                organizationQuery.isPending ? (
                        <LoadingSpinner/>
                    )
                    : (
                        <ItemFound searchParams={searchParams}
                                   result={organization}/>
                    )
            }

            {/*--------------------------------------------------------------------*/}

            {
                isPending ? (
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
                            <Stack direction={"horizontal"} gap={4} className={"align-items-start"}>

                                <Stack gap={4}
                                       style={{flex: "0 0 20%"}}> {/* This stack contains the smaller card items on the left (histograms, etc) */}
                                    <RicgraphHistogram topic={"name"} data={data}/>
                                    <RicgraphHistogram topic={"category"} data={data}/>
                                    <RicgraphHistogram topic={"year"} data={data}/>
                                    <RicgraphHistogram topic={"license"} data={data}/>
                                    <RicgraphHistogram topic={"access"} data={data}/>
                                </Stack>

                                <Stack gap={4}
                                       style={{flex: "1 1 0%", minWidth: 0}}> {/* This stack contains the bigger items on the right (tables, etc) */}

                                    <Card>
                                        <Card.Body>
                                            <TabbedTable
                                                header={"These are the requested items of this organization for all years:"}
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

                                </Stack>
                            </Stack>
                        </Card.Body>
                    </Card>
                )
            }

        </Container>
    );
}

export default OrganizationAnyInformationPersonsPage;