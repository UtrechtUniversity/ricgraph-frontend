import {Button, Card, Stack} from "react-bootstrap";
import {pages} from "../../../utils/constants.ts";
import {useNavigate, useSearchParams} from "react-router-dom";

interface OptionsTopButtonsProps {
    category: string;
}

function OptionsTopButtons({category}: OptionsTopButtonsProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    function navigateWithParams(route: string) {
        navigate(route + '?' + searchParams.toString());
    }

    function clickAction(page: string) {
        navigateWithParams(page);
    }

    return (
        <Card className={"mb-3"}>
            <Card.Body>
                {category === "person" ? (
                    <>
                        <h3>What would you like to see from this person?</h3>
                        <Stack className={"w-25"} gap={2}>
                            <Button className={"uu-btn mb-2"}
                                    onClick={() => clickAction(pages.RESULTS_PERSON_ALL)}>
                                show all information related to this person
                            </Button>
                            <Button className={"uu-btn mb-2"}
                                    onClick={() => clickAction(pages.RESULTS_PERSON_PERSONAL)}>
                                show personal information related to this person
                            </Button>
                            <Button className={"uu-btn mb-2"}
                                    onClick={() => clickAction(pages.RESULTS_PERSON_ORGANIZATION)}>
                                show organizations related to this person
                            </Button>
                            <Button className={"uu-btn"}
                                    onClick={() => clickAction(pages.RESULTS_PERSON_RESEARCH)}>
                                show research results related to this person
                            </Button>
                        </Stack>
                    </>
                ) : category === "organization" ? (
                    <>
                        <h3>What would you like to see from this organization?</h3>
                        <Stack className={"w-25"} gap={2}>
                            <Button className={"uu-btn mb-2"}
                                    onClick={() => clickAction(pages.RESULTS_ORGANIZATION_ALL)}>
                                show all information related to this organization
                            </Button>
                            <Button className={"uu-btn mb-2"}
                                    onClick={() => clickAction(pages.RESULTS_ORGANIZATION_PERSONS)}>
                                show persons related to this organization
                            </Button>
                            <Button disabled className={"uu-btn mb-2"}
                                    onClick={() => clickAction('#')}>
                                explore collaborations for this organization
                            </Button>
                            {/* TODO: implement the open science profile, then remove "disabled" and add an onClick */}
                            <Button disabled className={"uu-btn mb-2"}>
                                get an open science profile for this organization
                            </Button>
                            {/* TODO: implement the open science dashboard, then remove "disabled" and add an onClick */}
                            <Button disabled className={"uu-btn mb-2"}>
                                get an open science dashboard for this organization
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <></>
                )}
            </Card.Body>
        </Card>
    );
}

export default OptionsTopButtons;