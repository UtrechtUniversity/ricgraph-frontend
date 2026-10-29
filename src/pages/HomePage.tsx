import {Button, Card, Container, Stack} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import './HomePage.css'
import {
    getRicgraphCacheInfo,
    getRicgraphHarvestInfo,
    getRicgraphNodeInfo,
    getRicgraphSystemInfo
} from "../api/endpoints/advanced.ts";
import {pages} from "../utils/constants.ts";

function HomePage() {
    const navigate = useNavigate();

    const navigateWithParams = (page: string, params: URLSearchParams) => {
        navigate(page + "?" + params.toString());
    }

    const systemInfo = getRicgraphSystemInfo().data;
    const harvestInfo = getRicgraphHarvestInfo().data;
    const nodeInfo = getRicgraphNodeInfo().data;
    const cacheInfo = getRicgraphCacheInfo().data;

    const intro = systemInfo?.homepage_intro_html;
    const outro = systemInfo?.homepage_outro_html;
    const sourceActive = harvestInfo?.source_active;
    const nameActive = nodeInfo?.name_active;
    const personNameActive = nodeInfo?.person_name_active;
    const nrNodes = harvestInfo?.nr_nodes;
    const nrEdges = harvestInfo?.nr_edges;
    const harvestDate = harvestInfo?.harvest_date;
    const cacheName = cacheInfo?.cache_name;
    const nrItems = cacheInfo?.nr_items;
    const sizeKb = cacheInfo?.size_kb;

    return (
        <>
            <Container fluid className={"mt-3"}>
                <Card>
                    <Card.Body>
                        <h1 className={"mb-0"}>Ricgraph - Research in context graph</h1>
                        <em>This is a Proof of Concept frontend for Ricgraph.
                            It does not implement all features
                            as in the backend user interface of Ricgraph.
                        </em>
                    </Card.Body>
                </Card>
            </Container>

            <Container fluid className={"mt-3"}>
                <Card>
                    <Card.Body>
                        <p>
                            Ricgraph, also known as Research in context graph, enables the exploration of persons,
                            teams, their
                            results, (sub-)organizations, collaborations, skills, projects, and the relations between
                            these
                            items. Ricgraph can store many types of items into a single graph (network). These items can
                            be
                            obtained from various systems and from multiple organizations.
                        </p>

                        <p>
                            Ricgraph facilitates
                            reasoning about
                            these items because it infers new relations between items, relations that are not present in
                            any of
                            the separate source systems. It is flexible and extensible, and can be adapted to new
                            application
                            areas. Persons are only included in Ricgraph if they have at least one person identifier
                            (such as
                            ORCID, ISNI, or a source system identifier) in the source systems harvested.
                        </p>

                        <div dangerouslySetInnerHTML={{__html: intro ?? ''}}/>

                        <h1 className={"mt-4"}>Start exploring</h1>

                        <p>
                        <em>This is a Proof of Concept frontend for Ricgraph.
                            It does not implement all features
                            as in the backend user interface of Ricgraph.
                        </em>
                        </p>

                        <p>
                            You can use Ricgraph Explorer to explore Ricgraph. There are various methods to start
                            exploring:
                        </p>

                        <Stack direction={"horizontal"} gap={3}>
                            <Stack gap={3}>
                                <Button className={"uu-btn"}
                                        onClick={() => navigateWithParams(pages.SEARCH, new URLSearchParams({category: "person"}))}>
                                    search for a person
                                </Button>

                                <Button className={"uu-btn"} onClick={() => navigate(pages.EXPLORE_COLLABORATIONS)}>
                                    explore collaborations
                                </Button>

                                <Button className={"uu-btn"}
                                        onClick={() => navigate(pages.SEARCH_BROAD)}>
                                    search
                                    for
                                    anything (broad search)
                                </Button>

                            </Stack>
                            <Stack gap={3}>
                                <Button className={"uu-btn"}
                                        onClick={() => navigateWithParams(pages.SEARCH, new URLSearchParams({category: "organization"}))}>
                                    search for a (sub-)organization
                                </Button>

                                <Button className={"uu-btn"} onClick={() => navigate(pages.OPEN_SCIENCE_LANDSCAPE)}>
                                    explore the open science landscape
                                </Button>

                                <Button className={"uu-btn"}
                                        onClick={() => navigate(pages.SEARCH_ADVANCED)}>
                                    advanced
                                    search
                                </Button>

                            </Stack>
                            <Stack gap={3}></Stack>
                            <Stack gap={3}></Stack>
                        </Stack>
                    </Card.Body>
                </Card>
            </Container>

            <Container fluid className={"mt-3 mb-5"}>
                <Card>
                    <Card.Body>
                        <h1>About Ricgraph</h1>

                        <p>More information:</p>
                        <ul>
                            <li>For a gentle introduction in Ricgraph, please read the reference publication: Rik D.T.
                                Janssen (2024). Ricgraph: A flexible and extensible graph to explore research in context
                                from various systems. SoftwareX, 26(101736). <a
                                    href="https://doi.org/10.1016/j.softx.2024.101736"
                                    target="_blank" rel={"noopener"}>doi.org/10.1016/j.softx.2024.101736</a>.
                            </li>
                            <li>To read more about visualizing collaborations between (sub-)organizations in Ricgraph,
                                please read Rik D.T. Janssen (2025). Utilizing Ricgraph to gain insights into research
                                collaborations across institutions, at every organizational level. [preprint].
                                <a href="https://doi.org/10.2139/ssrn.5524439"
                                   rel={"noopener"}>https://doi.org/10.2139/ssrn.5524439</a>.
                            </li>
                            <li>Extensive documentation, publications, videos and source code can be found in the GitHub
                                repository <a href="https://github.com/UtrechtUniversity/ricgraph"
                                              target="_blank" rel={"noopener"}>github.com/UtrechtUniversity/ricgraph</a>.
                            </li>
                            <li>If you use or refer to Ricgraph, please cite both the reference publication
                                (<a href="https://doi.org/10.1016/j.softx.2024.101736"
                                    target="_blank" rel={"noopener"}>doi.org/10.1016/j.softx.2024.101736</a>), and the
                                software
                                (<a href="https://doi.org/10.5281/zenodo.7524314"
                                    target="_blank" rel={"noopener"}>doi.org/10.5281/zenodo.7524314</a>).
                            </li>
                        </ul>
                        <p>What to find in this instance of Ricgraph:</p>
                        <ul>
                            <li>Items from the following source systems: {
                                sourceActive && sourceActive.length > 0
                                    ? sourceActive.join(", ")
                                    : "[no source systems harvested yet]"
                            }.
                            </li>
                            <li>Types of items: {
                                nameActive && nameActive.length > 0
                                    ? nameActive.join(", ")
                                    : "[no items yet]"
                            }.
                            </li>
                            <li>Types of items that contain personal data: {
                                personNameActive && personNameActive.length > 0
                                    ? personNameActive.join(", ")
                                    : "[no items that contain personal data yet]"
                            }.
                            </li>
                            <li>{nrNodes} nodes and {nrEdges} edges, {
                                harvestDate
                                    ? "harvested on " + harvestDate
                                    : "nothing has been harvested yet."
                            }.
                            </li>
                            <li>Ricgraph uses {cacheName} as cache. This cache
                                has {nrItems} elements, and its
                                size is {sizeKb} kB.
                            </li>
                        </ul>

                        <div dangerouslySetInnerHTML={{__html: outro ?? ''}}/>

                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default HomePage;