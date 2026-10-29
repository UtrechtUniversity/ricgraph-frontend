import TitleCard from "../../components/TitleCard.tsx";
import {Button, Card, Container, Form, Table} from "react-bootstrap";
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {pages} from "../../utils/constants.ts";
import {getRicgraphNodeInfo, getRicgraphSystemInfo} from "../../api/endpoints/advanced.ts";
import {toSearchParams} from "../../api/general.ts";

const FORM_START_ORG_INPUT = "start_org";
const FORM_COLLAB_ORG_INPUT = "collab_org";
const FORM_CATEGORY_CHECKS = "check_category";
const FORM_EXPLORE_MODE_RADIO = "explore_mode";

export const COLLABS_EXPLORE_MODES = [
    {
        checked: true,
        value: "return_collab_sankey",
        label: "return the collaborations in a Sankey diagram"
    },
    {
        checked: false,
        value: "return_startorg_persons",
        label: "return the persons from start organizations involved in the collaborations"
    },
    {
        checked: false,
        value: "return_researchresults",
        label: "return the research results that originate from the collaborations"
    },
    {
        checked: false,
        value: "return_collaborg_persons",
        label: "return the persons from collaborating organizations involved in the collaborations"
    }
];

function ExploreCollaborationsPage() {
    const navigate = useNavigate();
    const nodeInfo = getRicgraphNodeInfo().data;
    const researchCategories = nodeInfo?.researchresult_category_active ?? [];

    const systemInfo = getRicgraphSystemInfo().data;
    // Without any organization hierarchies configured, the backend can't figure out what
    // to exclude for "any organization" and just errors out - so require one explicitly.
    const orgsWithHierarchies = systemInfo?.orgs_with_hierarchies ?? [];
    const requireCollabOrg = systemInfo !== undefined && orgsWithHierarchies.length === 0;

    function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const startOrg: string = String(formData.get(FORM_START_ORG_INPUT) ?? "").trim();
        const collabOrg: string = String(formData.get(FORM_COLLAB_ORG_INPUT) ?? "").trim();
        const categories: string[] = formData.getAll(FORM_CATEGORY_CHECKS).map(String);
        const mode: string = String(formData.get(FORM_EXPLORE_MODE_RADIO) ?? COLLABS_EXPLORE_MODES[0].value);

        const params = toSearchParams({
            "start_org": startOrg,
            "collab_org": collabOrg,
            "category_list": categories,
            "collab_mode": mode
        });

        navigate(pages.COLLABS_RESULTS + "?" + params.toString());
    }

    return (
        <Container fluid>
            <TitleCard>Explore collaborations</TitleCard>

            <Card>
                <Card.Body>
                    Using this page, you can explore collaborations between organizations in Ricgraph. You may also be
                    able to explore collaborations between sub-organizations, such as between
                    faculties/departments/chairs of one research organization and (sub-)organizations of other
                    organizations. This depends on whether sub-organizations have been harvested in this instance of
                    Ricgraph.

                    In Ricgraph, collaborations are defined as follows <a href="#ref1">[1]</a>:

                    <Table style={{
                        fontSize: "100%",
                        width: "100%",
                        tableLayout: "fixed",
                        borderCollapse: "collapse",
                        border: "1px solid black"
                    }}>
                        <tbody>
                        <tr>
                            <td style={{width: "35%", border: "1px solid black", padding: "1em"}}>
                                a collaboration between organization <em>start organization</em>
                                and organization <em>collaborating organization</em>
                            </td>
                            <td style={{width: "15%", textAlign: "center", border: "1px solid black", padding: "1em"}}>
                                is defined as
                            </td>
                            <td style={{width: "50%", border: "1px solid black", padding: "1em"}}>
                                a path from organization <em>start organization</em> to
                                organization <em>collaborating organization</em>
                                conforming to both of the following conditions:
                                <ul>
                                    <li>having one research result in common;</li>
                                    <li>having three nodes in between: a person,
                                        a research result, and a person.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className={"mt-3"}>
                <Card.Body>
                    <Form onSubmit={handleSearch}>

                        <Form.Group controlId={"form"}>
                            <Form.Label>Type the name for start organization (or enter text that begins a
                                (sub-)organization name):</Form.Label>
                            <Form.Control name={FORM_START_ORG_INPUT} type={"text"} required/>

                            <p className={"mt-2 mb-4"}>
                                Note. For now, you have to type the exact spelling in this field, including correct
                                upper
                                and lower case. <Link to={pages.SEARCH + "?category=organization"} target={"_blank"}>Click
                                here to
                                search
                                for a
                                (sub-)organization and find this correct
                                spelling.</Link> Then you can copy and paste it in the start organization input field
                                above.
                                This
                                also holds for the collaborating organization input field below. For example, if you
                                have
                                "DUT", you can type e.g. "DUT", "DUT Faculty", or "DUT Faculty: Mechanical Engineering",
                                but
                                not "Faculty", "dut faculty", or "Faculty: Mechanical Engineering" (in fact, you can,
                                but
                                they will not match DUT sub-organizations).
                            </p>

                            <Form.Label>Type the name for collaborating organization (or enter text that begins a
                                (sub-)organization name{
                                    requireCollabOrg
                                        ? ""
                                        : ", or leave it empty to match any organization (if you leave it " +
                                        "empty, only top level organization names will be retrieved)"
                                }):</Form.Label>
                            <Form.Control name={FORM_COLLAB_ORG_INPUT} type={"text"} required={requireCollabOrg}/>
                            {
                                requireCollabOrg && (
                                    <Form.Text className={"text-muted"}>
                                        This Ricgraph instance has no organization hierarchies configured, so a
                                        collaborating organization is required here (matching "any organization" is
                                        not available).
                                    </Form.Text>
                                )
                            }
                        </Form.Group>

                        <Card className={"mt-4"}>
                            <Card.Header>Restrict the collaborations to research results of a specific
                                category:</Card.Header>
                            <Card.Body>
                                <div style={{
                                    display: "grid",
                                    gridAutoFlow: "column",
                                    gridTemplateRows: "repeat(9, auto)",
                                }}>
                                    {
                                        researchCategories.map(category => (
                                            <Form.Check key={category} defaultChecked type={"checkbox"}
                                                        name={FORM_CATEGORY_CHECKS}
                                                        value={category}
                                                        id={category} label={category}/>
                                        ))
                                    }
                                </div>

                                <Button variant={"dark"} className={"mt-3 uu-yellow"} onClick={() => {
                                    document.querySelectorAll<HTMLInputElement>('input[name="' + FORM_CATEGORY_CHECKS + '"]')
                                        .forEach(checkbox => checkbox.checked = !checkbox.checked);
                                }}>invert checkbox selection</Button>
                            </Card.Body>
                        </Card>

                        <Card className={"mt-3"}>
                            <Card.Header>Choose how to explore collaborations:</Card.Header>
                            <Card.Body>
                                <p className={"text-muted"}>
                                    Note. At the moment, only the Sankey diagram can be generated through this
                                    REST API. The other modes below are not yet available.
                                </p>
                                <div>
                                    {
                                        COLLABS_EXPLORE_MODES.map((mode, index) => (
                                            <Form.Check
                                                key={mode.value}
                                                defaultChecked={mode.checked}
                                                disabled={index !== 0}
                                                type="radio"
                                                name={FORM_EXPLORE_MODE_RADIO}
                                                value={mode.value}
                                                id={mode.value}
                                                label={index !== 0 ? `${mode.label} (not available yet)` : mode.label}
                                            />
                                        ))
                                    }
                                </div>
                            </Card.Body>
                        </Card>

                        <p className={"mt-3"}>
                            Finding collaborations may take (very) long depending on the number of items involved. It
                            may take anything between 5 seconds and 5 minutes. If you have chosen to view the Sankey
                            diagram, and there appear to be a huge amount of collaborations (as in {">"} 20000), your
                            browser may become unresponsive due to the huge number of lines that have to be drawn.
                        </p>

                        <Button variant={"dark"} type={"submit"} className={"mt-3 uu-yellow"}>find collaborations, this
                            may take (very) long</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className={"mt-3"}>
                <Card.Body>
                    To read more about collaborations in Ricgraph:
                    <p id="ref1">[1] Rik D.T. Janssen (2025). <em>Utilizing Ricgraph to gain insights into research
                        collaborations across institutions, at every organizational level</em>. [preprint]. <a
                        href="https://doi.org/10.2139/ssrn.5524439"> https://doi.org/10.2139/ssrn.5524439</a>.</p>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ExploreCollaborationsPage;