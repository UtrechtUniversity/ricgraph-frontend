import {Card, Container, Form} from "react-bootstrap";
import React from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import DiscovererModeFields from "../../components/search/DiscovererModeFields";
import SearchLimitsFields from "../../components/search/SearchLimitsFields";
import TitleCard from "../../components/TitleCard.tsx";
import {DEFAULT_MAX_NR_TABLE_ROWS_STRING, pages} from "../../utils/constants.ts";
import {getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import SearchButton from "../../components/search/SearchButton.tsx";
import {isFirefox} from "../../utils/format.ts";

const SEARCH_TYPE = "search_type";
const SEARCH_FIELD_NAME = "name";
const SEARCH_FIELD_CATEGORY = "category";
const SEARCH_FIELD_VALUE = "value";
const SEARCH_FIELD_DISCOVERER_MODE = "discoverer_mode";
const SEARCH_FIELD_MAX_NR_TABLE_ROWS = "max_nr_table_rows";

function AdvancedSearchPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const nodeInfo = getRicgraphNodeInfo().data;

    const nameOptions: string[] = nodeInfo?.name_active ?? [];
    const categoryOptions: string[] = nodeInfo?.category_active ?? [];

    const nameDefault = searchParams.get(SEARCH_FIELD_NAME) ?? "";
    const categoryDefault = searchParams.get(SEARCH_FIELD_CATEGORY) ?? "";
    const valueDefault = searchParams.get(SEARCH_FIELD_VALUE) ?? "";
    const discovererModeDefault = searchParams.get(SEARCH_FIELD_DISCOVERER_MODE) ?? undefined;
    const maxRowsDefault = searchParams.get(SEARCH_FIELD_MAX_NR_TABLE_ROWS) ?? DEFAULT_MAX_NR_TABLE_ROWS_STRING;

    function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const nameInput = String(formData.get(SEARCH_FIELD_NAME)).trim();
        const categoryInput = String(formData.get(SEARCH_FIELD_CATEGORY));
        const valueInput = String(formData.get(SEARCH_FIELD_VALUE)).trim();
        const resultViewOption = String(formData.get(SEARCH_FIELD_DISCOVERER_MODE));
        const maxRows = String(formData.get(SEARCH_FIELD_MAX_NR_TABLE_ROWS)).trim();

        const params = new URLSearchParams({
            [SEARCH_TYPE]: "advanced",
            [SEARCH_FIELD_NAME]: nameInput,
            [SEARCH_FIELD_CATEGORY]: categoryInput,
            [SEARCH_FIELD_VALUE]: valueInput,
            [SEARCH_FIELD_DISCOVERER_MODE]: resultViewOption,
            [SEARCH_FIELD_MAX_NR_TABLE_ROWS]: maxRows
        });
        const queryString = params.toString();

        navigate({pathname: location.pathname, search: `?${queryString}`}, {replace: true});
        navigate(pages.SEARCH_RESULTS + "?" + queryString);
    }

    return (
        <Container fluid>
            <TitleCard>Advanced search page</TitleCard>

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSearch}>

                        <Card className={"mb-3"}>
                            <Card.Body>
                                <Form.Group controlId={"formSearchString"}>
                                    <Form.Label>Search for a value in Ricgraph field <i>name</i>:</Form.Label>
                                    <Form.Control name={"name"} type={"text"} autoComplete={"off"}
                                                  defaultValue={nameDefault}
                                                  list={"name_datalist"}/>
                                    {
                                        isFirefox() && (
                                            <Form.Text>Click twice to get a dropdown list.</Form.Text>
                                        )
                                    }
                                    <datalist id="name_datalist">
                                        {nameOptions.map(option => (
                                            <option key={option} value={option}></option>
                                        ))}
                                        <div></div>
                                    </datalist>
                                </Form.Group>
                                <Form.Group className={"mt-3"} controlId={"formSearchString"}>
                                    <Form.Label>Search for a value in Ricgraph field <i>category</i>:</Form.Label>
                                    <Form.Control name={"category"} type={"text"} autoComplete={"off"}
                                                  defaultValue={categoryDefault}
                                                  list={"category_datalist"}/>
                                    {
                                        isFirefox() && (
                                            <Form.Text>Click twice to get a dropdown list.</Form.Text>
                                        )
                                    }
                                    <datalist id="category_datalist">
                                        {categoryOptions.map(option => (
                                            <option key={option} value={option}></option>
                                        ))}
                                        <div></div>
                                    </datalist>
                                </Form.Group>
                                <Form.Group className={"mt-3"} controlId={"formSearchString"}>
                                    <Form.Label>Search for a value in Ricgraph field <i>value</i>:</Form.Label>
                                    <Form.Control name={"value"} type={"text"} defaultValue={valueDefault}/>
                                    <Form.Text>These fields are case-sensitive and use exact match search. If you
                                        enter values in more than one field, these fields are combined using
                                        AND.</Form.Text>
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <DiscovererModeFields defaultValue={discovererModeDefault}/>

                        <SearchLimitsFields defaultValue={maxRowsDefault}/>

                        <SearchButton/>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdvancedSearchPage;