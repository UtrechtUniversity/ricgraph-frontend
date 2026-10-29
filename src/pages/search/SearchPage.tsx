import {Card, Container, Form} from "react-bootstrap";
import React from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import DiscovererModeFields from "../../components/search/DiscovererModeFields";
import SearchLimitsFields from "../../components/search/SearchLimitsFields";
import TitleCard from "../../components/TitleCard.tsx";
import {DEFAULT_MAX_NR_TABLE_ROWS_STRING, pages} from "../../utils/constants.ts";
import ValueField from "../../components/search/ValueField.tsx";
import SearchButton from "../../components/search/SearchButton.tsx";

const SEARCH_TYPE = "search_type";
const SEARCH_FIELD_VALUE = "value";
const SEARCH_FIELD_DISCOVERER_MODE = "discoverer_mode";
const SEARCH_FIELD_MAX_NR_TABLE_ROWS = "max_nr_table_rows";

function SearchPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category") ?? ""; // Empty for broad search

    const valueDefault = searchParams.get(SEARCH_FIELD_VALUE) ?? "";
    const discovererModeDefault = searchParams.get(SEARCH_FIELD_DISCOVERER_MODE) ?? undefined;
    const maxRowsDefault = searchParams.get(SEARCH_FIELD_MAX_NR_TABLE_ROWS) ?? DEFAULT_MAX_NR_TABLE_ROWS_STRING;

    if (category.length > 0 && category !== "person" && category !== "organization") {
        return (
            <Container fluid>
                <p>Invalid category.</p>
            </Container>
        );
    }

    function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const searchInput = String(formData.get(SEARCH_FIELD_VALUE) ?? "").trim();
        const resultViewOption = String(formData.get(SEARCH_FIELD_DISCOVERER_MODE));
        const maxRows = String(formData.get(SEARCH_FIELD_MAX_NR_TABLE_ROWS)).trim();

        const params = new URLSearchParams({
            [SEARCH_TYPE]: category,
            "category": category,
            [SEARCH_FIELD_VALUE]: searchInput,
            [SEARCH_FIELD_DISCOVERER_MODE]: resultViewOption,
            [SEARCH_FIELD_MAX_NR_TABLE_ROWS]: maxRows
        });
        if (category === "person")
            params.set("name", "FULL_NAME");

        /*
        // Carry the "origin" a search was started from (e.g. one of the open science buttons)
        // through to the results page, so picking an entry there can route
        // straight to the corresponding result page instead of the generic options page.
        const origin = searchParams.get("origin");
        if (origin) params.set("origin", origin);
        */

        const queryString = params.toString();

        navigate({pathname: location.pathname, search: `?${queryString}`}, {replace: true});
        navigate(pages.SEARCH_RESULTS + "?" + queryString);
    }

    return (
        <Container fluid>
            <TitleCard>Search page for {category.length === 0 ? "anything" : category}</TitleCard>

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSearch}>

                        <ValueField defaultValue={valueDefault}/>

                        <DiscovererModeFields defaultValue={discovererModeDefault}/>

                        <SearchLimitsFields defaultValue={maxRowsDefault}/>

                        <SearchButton/>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SearchPage;