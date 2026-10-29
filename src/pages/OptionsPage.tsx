import {Card, Container} from "react-bootstrap";
import {useNavigate, useSearchParams} from "react-router-dom";
import ItemFound from "../components/ItemFound.tsx";
import TitleCard from "../components/TitleCard.tsx";
import {toEntry} from "../api/general.ts";
import {useEffect} from "react";
import {pages} from "../utils/constants.ts";
import {useSearchResultColumns} from "../hooks/useSearchResultColumns.ts";
import CustomTable from "../components/tables/CustomTable.tsx";
import {getDiscovererMode} from "../utils/params.ts";
import OptionsTopButtons from "../components/ricgraph/options/OptionsTopButtons.tsx";
import OptionsBottomButtons from "../components/ricgraph/options/OptionsBottomButtons.tsx";
import {useSelectedEntry} from "../hooks/useSelectedEntry.ts";

function OptionsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const simpleEntry = toEntry(searchParams);
    const hasRequiredParams = Boolean(simpleEntry._key && simpleEntry.name && simpleEntry.value);

    const query = useSelectedEntry();
    const entry = query.data ?? null;
    const columns = useSearchResultColumns(getDiscovererMode(searchParams));

    useEffect(() => {
        if (!hasRequiredParams) {
            navigate(pages.SEARCH_RESULTS + "?" + searchParams);
        }
    }, [hasRequiredParams, searchParams]);

    useEffect(() => {
        if (entry && entry.category !== "person" && entry.category !== "organization") {
            navigate(pages.RESULTS_OTHER + "?" + searchParams);
        }
    }, [entry, searchParams]);

    if (!entry) {
        return (
            <Container fluid>
                <TitleCard>Options Page</TitleCard>
                <p>No item found.</p>
            </Container>
        );
    }

    return (
        <Container fluid>
            <TitleCard>Options Page</TitleCard>

            <ItemFound searchParams={searchParams} result={entry}/>

            <OptionsTopButtons category={entry.category}/>

            <OptionsBottomButtons category={entry.category}/>

            {entry.category !== "person" && entry.category !== "organization" && (
                <Card>
                    <Card.Body>
                        <p>This is all information related to this {entry.category}:</p>
                        <CustomTable
                            data={[]}
                            columns={columns}
                        />
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default OptionsPage;
