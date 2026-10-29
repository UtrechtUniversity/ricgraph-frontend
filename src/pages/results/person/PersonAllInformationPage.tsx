import {useSearchParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import TitleCard from "../../../components/TitleCard.tsx";
import ItemFound from "../../../components/ItemFound.tsx";
import {getDiscovererMode} from "../../../utils/params.ts";
import {useEntryNavigate} from "../../../hooks/useEntryNavigate.ts";
import {DISCOVERER_MODE_PERSON} from "../../../utils/constants.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import PersonIdentitiesComponent from "../../../components/ricgraph/PersonIdentitiesComponent.tsx";
import PersonResearchesComponent from "../../../components/ricgraph/PersonResearchesComponent.tsx";
import PersonOrganizationsComponent from "../../../components/ricgraph/PersonOrganizationsComponent.tsx";
import NameVariantsComponent from "../../../components/ricgraph/NameVariantsComponent.tsx";
import {useSelectedEntry} from "../../../hooks/useSelectedEntry.ts";
import {usePersonRoot} from "../../../hooks/usePersonRoot.ts";

function PersonAllInformationPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();
    const discovererMode = getDiscovererMode(searchParams);

    const query = useSelectedEntry();
    const entry = query.data;

    const key = searchParams.get("_key") ?? "";
    const personRootQuery = usePersonRoot(key);

    const personEntry = personRootQuery.data;

    if (personRootQuery.isPending) {
        return (
            <LoadingSpinner/>
        );
    }

    if (!personEntry) {
        return (
            <p>Invalid person</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>All information related to this person</TitleCard>

            {/*--------------------------------------------------------------------*/}

            <ItemFound searchParams={searchParams}
                       result={entry}/>

            {/*--------------------------------------------------------------------*/}

            { // Show name variants if person_view
                discovererMode === DISCOVERER_MODE_PERSON && (
                    <NameVariantsComponent person={personEntry}
                                           onClickNameEntry={navigateToEntry}/>
                )
            }

            {/*--------------------------------------------------------------------*/}

            {/* Identities */}
            <Container fluid className={"mb-5"}>
                <PersonIdentitiesComponent
                    header={"Identities"}
                    person={personEntry}
                    onClickValue={navigateToEntry}
                />
            </Container>

            {/* Research results */}
            <Container fluid className={"mb-5"}>
                <PersonResearchesComponent
                    header={"Research results"}
                    person={personEntry}
                    onClickValue={navigateToEntry}
                />
            </Container>

            {/* Organizations */}
            <Container fluid>
                <PersonOrganizationsComponent
                    header={"Organizations"}
                    person={personEntry}
                    onClickValue={navigateToEntry}
                />
            </Container>
        </Container>
    );
}

export default PersonAllInformationPage;