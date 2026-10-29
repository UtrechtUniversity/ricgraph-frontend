import {Container} from "react-bootstrap";
import ItemFound from "../../../components/ItemFound.tsx";
import {useSearchParams} from "react-router-dom";
import TitleCard from "../../../components/TitleCard.tsx";
import {useEntryNavigate} from "../../../hooks/useEntryNavigate.ts";
import {useSelectedEntry} from "../../../hooks/useSelectedEntry.ts";
import {usePersonRoot} from "../../../hooks/usePersonRoot.ts";
import PersonResearchesComponent from "../../../components/ricgraph/PersonResearchesComponent.tsx";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";

function PersonResearchesPage() {
    const [searchParams] = useSearchParams();
    const navigateToEntry = useEntryNavigate();

    const entryQuery = useSelectedEntry();
    const entry = entryQuery.data;

    const key = searchParams.get("_key") ?? "";
    const personRootQuery = usePersonRoot(key);
    const person = personRootQuery.data;

    if (personRootQuery.isPending) {
        return (
            <LoadingSpinner/>
        );
    }

    if (!person) {
        return (
            <p>Invalid person!</p>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Research results related to this person</TitleCard>

            <ItemFound searchParams={searchParams} result={entry}/>

            <PersonResearchesComponent
                person={person!}
                onClickValue={navigateToEntry}/>
        </Container>
    );
}

export default PersonResearchesPage;
