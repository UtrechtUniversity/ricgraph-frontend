import {Button, Card, Container, Form, Stack} from "react-bootstrap";
import React, {useRef, useState} from "react";
import TitleCard from "../../components/TitleCard.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {COLLABS_EXPLORE_MODES} from "./ExploreCollaborationsPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchExploreCollaborations} from "../../api/endpoints/osl.ts";
import {getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import {pages} from "../../utils/constants.ts";
import {toSearchParams} from "../../api/general.ts";
import Filter from "../../components/Filter.tsx";
import {toFilterOptions} from "../../utils/filters.ts";
import {useFilterCheckboxes} from "../../hooks/useFilterCheckboxes.ts";

interface CollabParams {
    startOrg: string,
    collabOrg: string,
    categories: string[],
    mode: string
}

const DEFAULT_DIAGRAM_HEIGHT = 600;

function CollabsResultsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nodeInfo = getRicgraphNodeInfo().data;

    const collabParams: CollabParams = {
        startOrg: searchParams.get("start_org") || "",
        collabOrg: searchParams.get("collab_org") || "",
        categories: searchParams.getAll("category_list"),
        mode: searchParams.get("collab_mode") || COLLABS_EXPLORE_MODES[0].value
    };

    const isSankeyMode = collabParams.mode === COLLABS_EXPLORE_MODES[0].value;

    const query = useQuery({
        queryKey: ["explore-collaborations", collabParams.startOrg, collabParams.collabOrg,
            collabParams.categories],
        queryFn: async () => fetchExploreCollaborations({
            start_organization: collabParams.startOrg,
            collaborating_organization: collabParams.collabOrg,
            researchresult_category: collabParams.categories,
        }),
        enabled: isSankeyMode && Boolean(collabParams.startOrg),
    });

    const diagramHtml = query.data?.results?.[0] ?? "";

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [diagramHeight, setDiagramHeight] = useState(DEFAULT_DIAGRAM_HEIGHT);

    // The diagram is a self-contained HTML page loaded in an iframe, so it has no natural
    // height of its own - grow the iframe to fit its content once it's actually loaded.
    function handleIframeLoad() {
        const iframeBody = iframeRef.current?.contentDocument?.body;
        if (iframeBody) {
            setDiagramHeight(iframeBody.scrollHeight + 40);
        }
    }

    const [categories, setCategories] = useFilterCheckboxes(collabParams.categories, nodeInfo?.researchresult_category_active ?? []);

    function handleFilterSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const params = toSearchParams({
            "start_org": collabParams.startOrg,
            "collab_org": collabParams.collabOrg,
            "category_list": categories,
            "collab_mode": collabParams.mode
        });

        navigate(pages.COLLABS_RESULTS + "?" + params.toString());
    }

    function getModeDescription(mode: string): { text1: string, text2: string } {
        switch (mode) {
            case COLLABS_EXPLORE_MODES[1].value: // return_startorg_persons
                return {
                    text1: `persons that are participating in the collaborations between ${collabParams.startOrg} and ${collabParams.collabOrg}, they are member of the first organization.`,
                    text2: "collaborations",
                };
            case COLLABS_EXPLORE_MODES[2].value: // return_researchresults
                return {
                    text1: `research results that originate from the collaborations between ${collabParams.startOrg} and ${collabParams.collabOrg}.`,
                    text2: "research results",
                };
            case COLLABS_EXPLORE_MODES[3].value: // return_collaborg_persons
                return {
                    text1: `persons that are participating in the collaborations between ${collabParams.startOrg} and ${collabParams.collabOrg}, they are member of the latter organization.`,
                    text2: "collaborations",
                };
            default:
                return {text1: "", text2: ""};
        }
    }

    const {text1, text2} = getModeDescription(collabParams.mode);
    const text3 = collabParams.categories.length === 0
        ? "all categories"
        : "the following categories: " + collabParams.categories.join(", ");

    function renderDiagramContent() {
        if (!isSankeyMode) { // A mode without REST API support was requested (e.g. via a hand-edited URL)
            return (
                <p>
                    This exploration mode is not available yet through the REST API. It would have
                    shown the {text1} It shows {text2} for {text3}. Please go back and choose
                    "{COLLABS_EXPLORE_MODES[0].label}"
                    instead.
                </p>
            );
        }

        if (query.isPending) {
            return <LoadingSpinner/>;
        }

        if (!diagramHtml) {
            return (
                <p>
                    No collaborations were found for this search, or one or more field values
                    were invalid. Please check the spelling of the organization names and try
                    again.
                </p>
            );
        }

        return (
            <>
                <p>
                    This Sankey diagram shows the collaborations between
                    "{collabParams.startOrg}" and
                    "{collabParams.collabOrg || "any organization"}",
                    for all years. It conforms to the selections made on the previous
                    page for {text3}.
                </p>
                <p>
                    If you hover the lines in the diagram, you will get a tooltip.
                </p>
                <iframe
                    ref={iframeRef}
                    title={"Collaborations Sankey diagram"}
                    srcDoc={diagramHtml}
                    onLoad={handleIframeLoad}
                    style={{width: "100%", height: diagramHeight, border: "none"}}
                />
            </>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Collaborations between "{collabParams.startOrg}" and
                "{collabParams.collabOrg || "any organization"}"</TitleCard>
            <Card>
                <Card.Body>
                    {renderDiagramContent()}
                </Card.Body>
            </Card>

            {
                isSankeyMode && (
                    <Card className={"mt-3"}>
                        <Card.Body>
                            <h5 className={"mb-4"}>
                                You can modify this collaboration diagram by filtering
                            </h5>
                            <Form onSubmit={handleFilterSubmit}>
                                <Stack direction={"horizontal"} gap={3} className={"align-items-start"}>

                                    <Filter title={'Filter on "category"'}
                                            options={toFilterOptions(nodeInfo?.researchresult_category_active ?? [])}
                                            selectedValues={categories}
                                            onChange={setCategories}/>
                                </Stack>

                                <Button type={"submit"} variant={"dark"} className={"mt-3 uu-yellow"}>Apply filters</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                )
            }
        </Container>
    );
}

export default CollabsResultsPage;
