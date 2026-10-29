import {useSearchParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import TitleCard from "../../../../components/TitleCard.tsx";
import ItemFound from "../../../../components/ItemFound.tsx";
import {useEntryNavigate} from "../../../../hooks/useEntryNavigate.ts";
import {useSelectedEntry} from "../../../../hooks/useSelectedEntry.ts";
import {usePersonRoot} from "../../../../hooks/usePersonRoot.ts";
import PersonOrganizationsComponent from "../../../../components/ricgraph/PersonOrganizationsComponent.tsx";

function PersonCollaboratingOrganizationsPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const entryQuery = useSelectedEntry();
    const entry = entryQuery.data;

    const key = searchParams.get("_key") ?? "";
    const personRootQuery = usePersonRoot(key);
    const personEntry = personRootQuery.data;

    if (!personEntry) {
        return (
            <p>Invalid person!</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Organizations that this person collaborates with</TitleCard>

            <ItemFound header={"This is the person we start with:"} searchParams={searchParams} result={entry}/>

            <PersonOrganizationsComponent person={personEntry}
                                          showCollaboratingOrganizations
                                          onClickValue={navigateToEntry}/>
        </Container>
    );
}

export default PersonCollaboratingOrganizationsPage;
