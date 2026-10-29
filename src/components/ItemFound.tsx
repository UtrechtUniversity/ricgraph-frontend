import {useSearchResultColumns} from "../hooks/useSearchResultColumns.ts";
import {getDiscovererMode} from "../utils/params.ts";
import {Card} from "react-bootstrap";
import type {UrlEntry} from "../api/general.ts";
import CustomTable from "./tables/CustomTable.tsx";
import {useEntryNavigate} from "../hooks/useEntryNavigate.ts";

interface Props {
    header?: string;
    searchParams: URLSearchParams;
    result?: UrlEntry | null;
    results?: UrlEntry[];
}

function ItemFound({header, searchParams, result, results}: Props) {
    const entries = results ?? (result ? [result] : []);
    const columns = useSearchResultColumns(getDiscovererMode(searchParams));
    const navigateToEntry = useEntryNavigate();

    if (entries.length === 0) {
        return null;
    }

    return (
        <Card className={"mb-3"}>
            <Card.Body>
                <CustomTable header={header ?? "Ricgraph Explorer found item:"}
                             exportName={"ricgraph-item"}
                             columns={columns}
                             data={entries}
                             onClickValue={entry => navigateToEntry(entry as UrlEntry)}/>
            </Card.Body>
        </Card>
    );
}

export default ItemFound;