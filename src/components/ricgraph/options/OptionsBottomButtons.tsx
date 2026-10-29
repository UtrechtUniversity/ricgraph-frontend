import {Button, Card, Form, Stack} from "react-bootstrap";
import {pages} from "../../../utils/constants.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getRicgraphHarvestInfo, getRicgraphNodeInfo} from "../../../api/endpoints/advanced.ts";
import {isFirefox} from "../../../utils/format.ts";

interface OptionsBottomButtonsProps {
    category: string;
}

function OptionsButtons({category}: OptionsBottomButtonsProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    function navigateWithParams(route: string) {
        navigate(route + '?' + searchParams.toString());
    }

    const nodeInfo = getRicgraphNodeInfo();
    const researchCategories: string[] = nodeInfo.data?.researchresult_category_active ?? [];
    const nameOptions: string[] = nodeInfo?.data?.name_active ?? [];
    const categoryOptions: string[] = nodeInfo?.data?.category_active ?? [];

    const harvestInfo = getRicgraphHarvestInfo();
    const sourceSystems: string[] = harvestInfo.data?.source_active ?? [];
    return (
        <>
            {category === "person" && (
                <Card>
                    <Card.Body>
                        <h3 className={"mb-4"}>Advanced information related to this person</h3>

                        <Card className={"mb-3"}>
                            <Card.Body>
                                <h5>With whom does this person share research results?</h5>
                                <Button className={"uu-btn mb-3"}
                                        onClick={() => navigateWithParams(pages.RESULTS_PERSON_SHARE_RESEARCH)}>
                                    find persons that share any research result types with this person
                                </Button>
                                <p>By entering a value in the field below, you will get a list of persons who share a
                                    specific research result type with this person (you can also
                                    type <i>publication_all</i> to match any publication research result):</p>
                                <input disabled type="text" className={"form-control mb-2"}/>
                                <Button disabled className={"uu-btn"}>find persons that share the a specific research
                                    result type
                                    with this person</Button>
                            </Card.Body>
                        </Card>

                        <Card className={"mb-3"}>
                            <Card.Body>
                                <h5>With which organizations does this person collaborate?</h5>
                                <p>By clicking the following button, you will get an overview of organizations that his
                                    person collaborates with. A person <i>X</i> from organization <i>A</i> collaborates
                                    with
                                    a person <i>Y</i> from organization <i>B</i> if <i>X</i> and <i>Y</i> have both
                                    contributed to the same
                                    research result.</p>
                                <Button className={"uu-btn"}
                                        onClick={() => navigateWithParams(pages.RESULTS_PERSON_COLLABORATING_ORGANIZATIONS)}>
                                    find organizations that this person collaborates with
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className={"mb-3"}>
                            <Card.Body>
                                <h5>Improve or enhance information in one of your source systems</h5>
                                <p>The process of improving or enhancing information in a source system is called
                                    "enriching" that source system. This is only possible if you have harvested more
                                    than
                                    one source system. By using information found in one or more other harvested
                                    systems,
                                    information in this source system can be improved or enhanced.
                                    Use the field below to enter a name of one of your source systems. Ricgraph Explorer
                                    will show what information can be added to this source system, based on the
                                    information
                                    harvested from other source systems.
                                    The name of the source system you would like to enrich:</p>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    const formData = new FormData(event.currentTarget);
                                    const sourceSystem = String(formData.get("source_system") ?? "").trim();

                                    const params = new URLSearchParams(searchParams);
                                    params.set("source_system", sourceSystem);
                                    navigate(pages.RESULTS_PERSON_ENRICH + "?" + params.toString());
                                }}>
                                    <Form.Control name={"source_system"} type={"text"} autoComplete={"off"}
                                                  className={"mb-2"}
                                                  list={"source_system_datalist"}/>
                                    {
                                        isFirefox() && (
                                            <Form.Label><i>Click twice to get a dropdown list.</i></Form.Label>
                                        )
                                    }
                                    <datalist id="source_system_datalist">
                                        {sourceSystems.map(option => (
                                            <option key={option} value={option}></option>
                                        ))}
                                    </datalist>
                                    <Button type={"submit"} className={"uu-btn"}>find information harvested from
                                        other source systems, not present in this source system</Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <h5>More information about overlap in source systems</h5>
                                <p>In case more than one source systems have been harvested, and the information in
                                    Ricgraph
                                    for the neighbors of this node have originated from more than one source system, you
                                    can
                                    find out from which ones.</p>
                                <Button disabled className={"uu-btn"}>find the overlap in source systems for the
                                    neighbor nodes
                                    of
                                    this node (this may
                                    take some time)</Button>
                            </Card.Body>
                        </Card>

                    </Card.Body>
                </Card>
            )}
            {category === "organization" && (
                <Card>
                    <Card.Body>
                        <h3 className={"mb-4"}>Advanced information related to this organization</h3>

                        <Card className={"mb-3"}>
                            <Card.Body>
                                <h5>More information about persons or their results in this organization</h5>
                                <Stack className={"w-25"}>
                                    <Button className={"uu-btn mb-3"}
                                            onClick={() => navigateWithParams(pages.RESULTS_ORGANIZATION_ANY_INFO_PERSONS)}>
                                        find any information
                                        from all persons in
                                        this organization
                                    </Button>

                                    <Button className={"uu-btn mb-3"}
                                            onClick={() => {
                                                const params = new URLSearchParams();
                                                researchCategories.forEach(category => {
                                                    params.append("category_list", category);
                                                });
                                                for (const [key, value] of searchParams.entries())
                                                    params.set(key, value);
                                                navigate(pages.RESULTS_ORGANIZATION_ANY_INFO_PERSONS + "?" + params.toString());
                                            }}>
                                        find research results
                                        from all persons in
                                        this organization
                                    </Button>

                                </Stack>
                                <p>By using the fields below, you can choose what you would like to see from the persons
                                    or their results in this organization. You can use one or both fields.</p>
                                <Form className={"w-25"}
                                      onSubmit={(event) => {
                                          event.preventDefault();
                                          const formData = new FormData(event.currentTarget);

                                          const nameValue = String(formData.get("name") ?? "").trim();
                                          const categoryValue = String(formData.get("category") ?? "").trim();

                                          const params = new URLSearchParams();
                                          params.append("name_list", nameValue);
                                          params.append("category_list", categoryValue);
                                          for (const [key, value] of searchParams.entries())
                                              params.set(key, value);

                                          navigate(pages.RESULTS_ORGANIZATION_ANY_INFO_PERSONS + "?" + params.toString());
                                      }}>

                                    <Form.Label>Search for persons or results using field <i>name</i>:</Form.Label>
                                    <Form.Control type={"text"} name={"name"}
                                                  list={"name_datalist"}
                                                  autoComplete={"off"}/>
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
                                    <p/>

                                    <Form.Label>Search for persons or results using
                                        field <i>category</i>:</Form.Label>
                                    <Form.Control type={"text"} name={"category"}
                                                  list={"category_datalist"}
                                                  autoComplete={"off"}/>
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
                                    <p/>

                                    <Button type={"submit"} className={"uu-btn"}>find specific
                                        information</Button>
                                </Form>
                            </Card.Body>
                        </Card>

                    </Card.Body>
                </Card>
            )}
        </>
    );
}

export default OptionsButtons;