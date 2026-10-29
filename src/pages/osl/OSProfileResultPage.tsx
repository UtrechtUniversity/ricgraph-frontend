// October 10, 2026.
// Only use this code as an example how to get the Open science dashboard
// in the frontend. The implementation of this dashboard below is wrong
// (it does not produce a correct dashboard).
// However, it may help how to hook up this to the frontend.
// In a number of other files, commands related to this file have
// been disabled (commented). These may need to be restored to let this work.
// Feel free to abandon this code and write your own.
/*
import {Button, Card, Container, Form, Stack} from "react-bootstrap";
import React, {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import TitleCard from "../../components/TitleCard.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import Histogram, {type HistogramItem} from "../../components/Histogram.tsx";
import Filter from "../../components/Filter.tsx";
import YearFilterCard from "../../components/YearFilterCard.tsx";
import {getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import {useOrganizationResearchResults} from "../../hooks/useOrganizationResearchResults.ts";
import {useFilterCheckboxes} from "../../hooks/useFilterCheckboxes.ts";
import {getYearRange, readYearRange} from "../../utils/years.ts";
import {toFilterOptions} from "../../utils/filters.ts";
import {pages} from "../../utils/constants.ts";
import {toSearchParams} from "../../api/general.ts";
import {getDiscovererMode} from "../../utils/params.ts";

const MATERIAL_GROUPS = [
    {name: "research material", nodeInfoKey: "researchresult_category_research_material" as const},
    {name: "reporting material", nodeInfoKey: "researchresult_category_reporting_material" as const},
    {name: "engagement material", nodeInfoKey: "researchresult_category_engagement_material" as const},
];

function OSProfileResultPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nodeInfo = getRicgraphNodeInfo().data;

    const key = searchParams.get("_key") ?? "";
    const value = searchParams.get("value") ?? "";
    const yearFirst = searchParams.get("year_first") ?? "";
    const yearLast = searchParams.get("year_last") ?? "";
    const appliedLicenses = searchParams.getAll("license_list");
    const appliedAccesses = searchParams.getAll("access_list");

    const {yearOptions, yearMin, yearMax} = getYearRange(nodeInfo);

    // The material groups are a fixed taxonomy that may list categories this Ricgraph
    // instance never harvested, and the endpoint would reject those - so drop them here too.
    const activeResearchCategories = nodeInfo?.researchresult_category_active ?? [];
    const materialGroups = MATERIAL_GROUPS.map(group => ({
        name: group.name,
        categories: (nodeInfo?.[group.nodeInfoKey] ?? []).filter(category => activeResearchCategories.includes(category)),
    }));
    const categoryWant = materialGroups.flatMap(group => group.categories);

    const {entries, isPending} = useOrganizationResearchResults({
        key, categoryWant, yearFirst, yearLast,
        licenses: appliedLicenses, accesses: appliedAccesses,
    });

    const materialGroupCounts = materialGroups.map(group => ({
        ...group,
        count: entries.filter(entry => group.categories.includes(entry.category)).length,
    }));
    const histogramItems: HistogramItem[] = materialGroupCounts.map(({name, count}) => ({name, value: count}));
    const histogramMax = Math.max(...histogramItems.map(item => item.value), 1);

    const [histogramMode, setHistogramMode] = useState<"counts" | "percentages">("percentages");

    const [licenses, setLicenses] = useFilterCheckboxes(appliedLicenses, nodeInfo?.license_active ?? []);
    const [accesses, setAccesses] = useFilterCheckboxes(appliedAccesses, nodeInfo?.access_active ?? []);

    function handleFilterSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const years = readYearRange(event.currentTarget);

        const params = toSearchParams({
            "_key": key,
            "value": value,
            "license_list": licenses,
            "access_list": accesses,
            "year_first": years.yearFirst,
            "year_last": years.yearLast,
            "max_nr_table_rows": searchParams.get("max_nr_table_rows") ?? undefined,
            "discoverer_mode": getDiscovererMode(searchParams),
        });

        navigate(pages.OS_PROFILE_RESULTS + "?" + params.toString(), {replace: true});
    }

    function navigateToMaterialGroup(categories: string[]) {
        const params = toSearchParams({
            "_key": key,
            "value": value,
            "category_list": categories,
            "max_nr_table_rows": searchParams.get("max_nr_table_rows") ?? undefined,
            "discoverer_mode": getDiscovererMode(searchParams),
        });
        navigate(pages.RESULTS_ORGANIZATION_ANY_INFO_PERSONS + "?" + params.toString());
    }

    const otherHistogramMode = histogramMode === "percentages" ? "counts" : "percentages";

    return (
        <Container fluid>
            <TitleCard>Open science profile for "{value}"</TitleCard>

            <Card>
                <Card.Body>
                    {isPending ? <LoadingSpinner/> : (
                        <>
                            <Histogram
                                title={`Open science profile (${histogramMode}, conforming to the selections at the left)`}
                                items={histogramItems}
                                max={histogramMax}
                                mode={histogramMode}/>
                            <Stack direction={"horizontal"} gap={2} className={"mt-3"}>
                                <Button size={"sm"} variant={"dark"} className={"uu-yellow"}
                                        onClick={() => setHistogramMode(otherHistogramMode)}>
                                    toggle to show {otherHistogramMode}
                                </Button>
                                {materialGroupCounts.filter(group => group.count > 0).map(group => (
                                    <Button key={group.name} size={"sm"} variant={"dark"} className={"uu-yellow"}
                                            onClick={() => navigateToMaterialGroup(group.categories)}>
                                        show {group.name}
                                    </Button>
                                ))}
                            </Stack>
                        </>
                    )}
                </Card.Body>
            </Card>

            <Card className={"mt-3"}>
                <Card.Body>
                    <h5 className={"mb-4"}>You can modify this profile by filtering</h5>
                    <Form onSubmit={handleFilterSubmit}>
                        <Stack direction={"horizontal"} gap={3} className={"align-items-start"}>
                            <YearFilterCard
                                yearFirstDefault={yearFirst}
                                yearLastDefault={yearLast}
                                yearOptions={yearOptions}
                                yearMin={yearMin}
                                yearMax={yearMax}/>

                            <Filter title={'Filter on "license"'}
                                    options={toFilterOptions(nodeInfo?.license_active ?? [])}
                                    selectedValues={licenses}
                                    onChange={setLicenses}/>

                            <Filter title={'Filter on "access"'}
                                    options={toFilterOptions(nodeInfo?.access_active ?? [])}
                                    selectedValues={accesses}
                                    onChange={setAccesses}/>
                        </Stack>

                        <Button type={"submit"} variant={"dark"} className={"mt-3 uu-yellow"}>Apply filters</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className={"mt-3"}>
                <Card.Body>
                    <h2>What is an open science profile in Ricgraph?</h2>
                    <p>
                        In Ricgraph, an <em>open science profile</em> relates to the distribution of research
                        results for a certain (sub-)organization, in the three groups <em>research
                        material</em>, <em>reporting material</em>, and <em>engagement material</em>. It is said
                        that the form of this distribution may be characteristic for such a (sub-)organization.
                        You can use this page to check this for yourself. Also, you can choose whether you would
                        like to see percentages in the histogram, or rather prefer to see counts. There are
                        additional filters on <em>year</em>, <em>license</em>, and <em>access</em>.
                    </p>
                    <p>
                        The three groups research material, reporting material, and engagement material are
                        defined in Ricgraph as:
                    </p>
                    <ol>
                        <li>
                            <em>Research material</em>: input/output and supporting material of the analysis.
                            These are the result categories {materialGroups[0].categories.join(", ")}.
                        </li>
                        <li>
                            <em>Reporting material</em>: documents reporting on process and results of analysis.
                            These are the result categories {materialGroups[1].categories.join(", ")}.
                        </li>
                        <li>
                            <em>Engagement material</em>: everything used to involve stakeholders and wider
                            audiences into influencing the research and using or implementing its results.
                            These are the result categories {materialGroups[2].categories.join(", ")}.
                        </li>
                    </ol>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OSProfileResultPage;
*/