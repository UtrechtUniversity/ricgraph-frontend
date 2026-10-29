import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Button, Card, Container, Form, Stack} from "react-bootstrap";
import TitleCard from "../../../../components/TitleCard.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchPersonOtherSourceInfo} from "../../../../api/endpoints/person.ts";
import {getRicgraphNodeInfo} from "../../../../api/endpoints/advanced.ts";
import {useEntryNavigate} from "../../../../hooks/useEntryNavigate.ts";
import {useSearchResultColumns} from "../../../../hooks/useSearchResultColumns.ts";
import {usePersonRoot} from "../../../../hooks/usePersonRoot.ts";
import {getDiscovererMode} from "../../../../utils/params.ts";
import {getYearRange, getYearRangeText, readYearRange} from "../../../../utils/years.ts";
import {getTableRowsPerPage} from "../../../../api/general.ts";
import {pages} from "../../../../utils/constants.ts";
import CustomTable from "../../../../components/tables/CustomTable.tsx";
import TabbedTable from "../../../../components/tables/TabbedTable.tsx";
import LoadingSpinner from "../../../../components/LoadingSpinner.tsx";
import YearFilterCard from "../../../../components/YearFilterCard.tsx";
import RicgraphHistogram from "../../../../components/ricgraph/RicgraphHistogram.tsx";

function PersonEnrichPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();
    const columns = useSearchResultColumns(getDiscovererMode(searchParams));

    const key = searchParams.get("_key") ?? "";
    const personRootQuery = usePersonRoot(key);
    const personEntry = personRootQuery.data;

    const sourceSystem = searchParams.get("source_system") ?? "";
    const yearFirst = searchParams.get("year_first") ?? "";
    const yearLast = searchParams.get("year_last") ?? "";

    // This endpoint isn't cursor-paginated (it returns two nested lists),
    // so the tables below page through the fetched result client-side.
    const pageSize = getTableRowsPerPage({max_nr_table_rows: searchParams.get("max_nr_table_rows")});

    const nodeInfo = getRicgraphNodeInfo().data;
    const {yearOptions, yearMin, yearMax} = getYearRange(nodeInfo);

    const dataQuery = useQuery({
        queryKey: ["person-enrich", personEntry?._key, sourceSystem, yearFirst, yearLast],
        queryFn: () => fetchPersonOtherSourceInfo({
            key: personEntry?._key ?? "",
            source_system: sourceSystem,
            year_first: yearFirst,
            year_last: yearLast,
        }),
        enabled: Boolean(personEntry) && Boolean(sourceSystem),
    });
    // The API only sends back a "results" entry if it actually found enrich candidates,
    // so an empty list here means there's nothing to enrich this source system with.
    const nothingFound = dataQuery.isSuccess && dataQuery.data?.results.length === 0;
    const result = dataQuery.data?.results[0];
    const identifyingNodes = result?.person_identifying_nodes ?? [];
    const enrichNodes = result?.person_enrich_nodes ?? [];

    function handleFilterSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const years = readYearRange(event.currentTarget);

        const params = new URLSearchParams(searchParams);
        params.set("year_first", years.yearFirst);
        params.set("year_last", years.yearLast);
        navigate(pages.RESULTS_PERSON_ENRICH + "?" + params.toString());
    }

    if (!personEntry) {
        return (
            <p>Invalid person!</p>
        );
    }

    if (!sourceSystem) {
        return (
            <p>You have not specified a source system to enrich.</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Information harvested from other source systems, not present in this source
                system</TitleCard>

            <Card>
                <Card.Body>
                    <CustomTable
                        header={`This item is used to determine possible enrichments of source system "${sourceSystem}":`}
                        exportName={"ricgraph-item"}
                        columns={columns}
                        data={[personEntry]}
                        onClickValue={navigateToEntry}
                    />

                    <hr style={{borderWidth: "3px"}}/>

                    {
                        dataQuery.isPending ? (
                            <LoadingSpinner/>
                        ) : nothingFound ? (
                            <p>
                                Ricgraph could not find any information in other source systems to enrich
                                source system "{sourceSystem}".
                            </p>
                        ) : (
                            <>
                                {
                                    identifyingNodes.length === 0 ? (
                                        <p>
                                            There are enrich candidates to enrich source system "{sourceSystem}",
                                            but there are no "person" nodes to identify this item in
                                            "{sourceSystem}".
                                        </p>
                                    ) : (
                                        <CustomTable
                                            header={`You can use the information in this table to find this item in source system "${sourceSystem}":`}
                                            columns={columns}
                                            data={identifyingNodes}
                                            onClickValue={navigateToEntry}
                                            pageSize={pageSize}
                                        />
                                    )
                                }

                                <hr style={{borderWidth: "3px"}}/>

                                <Stack direction={"horizontal"} gap={4} className={"align-items-start"}>
                                    <Stack gap={4} style={{flex: "0 0 20%"}}>
                                        <div>Now showing {getYearRangeText(yearFirst, yearLast)}.</div>
                                        <Form onSubmit={handleFilterSubmit}>
                                            <YearFilterCard
                                                yearFirstDefault={yearFirst}
                                                yearLastDefault={yearLast}
                                                yearOptions={yearOptions}
                                                yearMin={yearMin}
                                                yearMax={yearMax}/>
                                            <Button type={"submit"} variant={"dark"} className={"uu-yellow mt-2"}>
                                                refresh
                                            </Button>
                                        </Form>

                                        <RicgraphHistogram topic={"name"} data={enrichNodes}/>
                                        <RicgraphHistogram topic={"category"} data={enrichNodes}/>
                                        <RicgraphHistogram topic={"year"} data={enrichNodes}/>
                                        <RicgraphHistogram topic={"license"} data={enrichNodes}/>
                                        <RicgraphHistogram topic={"access"} data={enrichNodes}/>
                                    </Stack>

                                    <div style={{flex: "1 1 0%", minWidth: 0}}>
                                        <TabbedTable
                                            header={`You could enrich source system "${sourceSystem}" by using this information harvested from other source systems ${getYearRangeText(yearFirst, yearLast)}. This information is not in source system "${sourceSystem}":`}
                                            columns={columns}
                                            data={enrichNodes}
                                            onClickValue={navigateToEntry}
                                            pageSize={pageSize}
                                        />
                                    </div>
                                </Stack>
                            </>
                        )
                    }
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PersonEnrichPage;
