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
import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import TitleCard from "../../components/TitleCard.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import Histogram, {type HistogramItem} from "../../components/Histogram.tsx";
import Filter from "../../components/Filter.tsx";
import YearFilterCard from "../../components/YearFilterCard.tsx";
import {getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import {useOrganizationResearchResults} from "../../hooks/useOrganizationResearchResults.ts";
import {useFilterCheckboxes} from "../../hooks/useFilterCheckboxes.ts";
import {getYearRange, getYearRangeText, readYearRange} from "../../utils/years.ts";
import {toSearchParams, type Entry} from "../../api/general.ts";
import {toFilterOptions} from "../../utils/filters.ts";
import {pages} from "../../utils/constants.ts";
import {getDiscovererMode} from "../../utils/params.ts";

function computeCategoryHistogram(entries: Entry[]): HistogramItem[] {
    const counts = new Map<string, number>();
    for (const entry of entries) {
        counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([name, value]) => ({name, value}))
        .sort((a, b) => b.value - a.value);
}

function OSDashboardResultPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nodeInfo = getRicgraphNodeInfo().data;

    const key = searchParams.get("_key") ?? "";
    const value = searchParams.get("value") ?? "";
    const yearFirst = searchParams.get("year_first") ?? "";
    const yearLast = searchParams.get("year_last") ?? "";
    const appliedCategories = searchParams.getAll("category_list");
    const appliedLicenses = searchParams.getAll("license_list");
    const appliedAccesses = searchParams.getAll("access_list");

    const {yearOptions, yearMin, yearMax} = getYearRange(nodeInfo);

    const [categories, setCategories] = useFilterCheckboxes(appliedCategories, nodeInfo?.researchresult_category_active ?? []);
    const [licenses, setLicenses] = useFilterCheckboxes(appliedLicenses, nodeInfo?.license_active ?? []);
    const [accesses, setAccesses] = useFilterCheckboxes(appliedAccesses, nodeInfo?.access_active ?? []);

    const categoryWant = appliedCategories.length > 0
        ? appliedCategories
        : nodeInfo?.researchresult_category_active ?? [];

    const {entries, isPending} = useOrganizationResearchResults({
        key, categoryWant, yearFirst, yearLast,
        licenses: appliedLicenses, accesses: appliedAccesses,
    });

    const categoryHistogramItems = computeCategoryHistogram(entries);
    const categoryHistogramMax = Math.max(...categoryHistogramItems.map(item => item.value), 1);
    const histogramTitle = `Open science dashboard (conforming to the selections at the left) `
        + `${getYearRangeText(yearFirst, yearLast)} for "${value}". `
        + `You can modify the selections at the bottom of this page.`;

    function handleFilterSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const years = readYearRange(event.currentTarget);

        const params = toSearchParams({
            "_key": key,
            "value": value,
            "category_list": categories,
            "license_list": licenses,
            "access_list": accesses,
            "year_first": years.yearFirst,
            "year_last": years.yearLast,
            "max_nr_table_rows": searchParams.get("max_nr_table_rows") ?? undefined,
            "discoverer_mode": getDiscovererMode(searchParams),
        });

        navigate(pages.OS_DASHBOARD_RESULTS + "?" + params.toString(), {replace: true});
    }

    function navigateToCollaborations() {
        const params = toSearchParams({
            "start_org": value,
            "license_list": licenses,
            "access_list": accesses,
            "year_first": yearFirst,
            "year_last": yearLast,
            "max_nr_table_rows": searchParams.get("max_nr_table_rows") ?? undefined,
            "discoverer_mode": getDiscovererMode(searchParams),
        });
        navigate(pages.COLLABS_RESULTS + "?" + params.toString());
    }

    function navigateToCategory(category: string) {
        const params = toSearchParams({
            "_key": key,
            "value": value,
            "category_list": [category],
            "max_nr_table_rows": searchParams.get("max_nr_table_rows") ?? undefined,
            "discoverer_mode": getDiscovererMode(searchParams),
        });
        navigate(pages.RESULTS_ORGANIZATION_ANY_INFO_PERSONS + "?" + params.toString());
    }

    function navigateToProfile() {
        const params = toSearchParams({
            "_key": key,
            "value": value,
            "license_list": licenses,
            "access_list": accesses,
            "year_first": yearFirst,
            "year_last": yearLast,
            "max_nr_table_rows": searchParams.get("max_nr_table_rows") ?? undefined,
            "discoverer_mode": getDiscovererMode(searchParams),
        });
        navigate(pages.OS_PROFILE_RESULTS + "?" + params.toString());
    }

    return (
        <Container fluid>
            <TitleCard>Open science dashboard for "{value}"</TitleCard>

            <Card>
                <Card.Body>
                    {isPending ? <LoadingSpinner/> : (
                        <>
                            <Histogram title={histogramTitle} items={categoryHistogramItems} max={categoryHistogramMax}/>
                            <Stack direction={"horizontal"} gap={2} className={"mt-3 flex-wrap"}>
                                {categoryHistogramItems.map(item => (
                                    <Button key={item.name} size={"sm"} variant={"dark"} className={"uu-yellow"}
                                            onClick={() => navigateToCategory(item.name)}>
                                        show {item.name}
                                    </Button>
                                ))}
                            </Stack>
                        </>
                    )}
                </Card.Body>
            </Card>

            <Card className={"mt-3"}>
                <Card.Body>
                    <h5 className={"mb-4"}>You can modify this dashboard by filtering</h5>
                    <Form onSubmit={handleFilterSubmit}>
                        <Stack direction={"horizontal"} gap={3} className={"align-items-start"}>
                            <Filter title={'Filter on "category"'}
                                    options={toFilterOptions(nodeInfo?.researchresult_category_active ?? [])}
                                    selectedValues={categories}
                                    onChange={setCategories}/>

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
                    <h5 className={"mb-3"}>Other exploration options for this organization</h5>
                    <p>
                        Finding collaborations may take (very) long depending on the number of items involved.
                        It may take anything between 5 seconds and 5 minutes. If there appear to be a huge amount
                        of collaborations (as in {">"} 20000), your browser may become unresponsive due to the
                        huge number of lines that have to be drawn.
                    </p>
                    <Button variant={"dark"} className={"me-2 uu-yellow"} onClick={navigateToCollaborations}>
                        explore collaborations for this organization, may take long
                    </Button>
                    <Button variant={"dark"} className={"uu-yellow"} onClick={navigateToProfile}>
                        get an open science profile for this organization
                    </Button>
                </Card.Body>
            </Card>

            <Card className={"mt-3"}>
                <Card.Body>
                    <h2>What is an open science dashboard in Ricgraph?</h2>
                    <p>
                        The open science dashboard in Ricgraph allows to explore research results for a
                        (sub-)organization. Starting with a (sub-)organization, you can filter its research
                        results based on "category", "year", "license", and "access" values. After clicking
                        "Apply filters", the result of your selection will be shown as a histogram.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OSDashboardResultPage;
*/
