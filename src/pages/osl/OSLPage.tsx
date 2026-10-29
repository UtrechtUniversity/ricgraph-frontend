import {Button, Card, Container, Stack} from "react-bootstrap";
import TitleCard from "../../components/TitleCard.tsx";
import {useNavigate} from "react-router-dom";
import {pages} from "../../utils/constants.ts";

function OSLPage() {
    const navigate = useNavigate();

    return (
        <Container fluid>
            <TitleCard>Explore open science monitoring</TitleCard>

            <Card>
                <Card.Body>
                    There are various methods to start exploring open science landscaping:
                    <Stack style={{maxWidth: "400px"}}>
                        <Button variant={"dark"} className={"mt-3 uu-yellow"}
                                onClick={() => navigate(pages.EXPLORE_COLLABORATIONS)}>explore collaborations</Button>

                        {/* TODO: implement the open science profile, then remove "disabled" and add an onClick */}
                        <Button disabled variant={"dark"} className={"mt-3 uu-yellow"}>
                            get an open science profile for a (sub-)organization</Button>

                        {/* TODO: implement the open science dashboard, then remove "disabled" and add an onClick */}
                        <Button disabled variant={"dark"} className={"mt-3 uu-yellow"}>
                            get an open science dashboard for a (sub-)organization</Button>
                    </Stack>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OSLPage;