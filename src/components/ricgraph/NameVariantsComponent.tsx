import {Button} from "react-bootstrap";
import {formatNameValue, getNames} from "../../utils/format.ts";
import {type Entry} from "../../api/general.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchAllNeighborNodes, getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import {DEFAULT_PERSON_CATEGORIES_ACTIVE} from "../../utils/constants.ts";
import RicgraphResultCard from "./RicgraphResultCard.tsx";

interface NameVariantsComponentProps {
    person: Entry;
    onClickNameEntry?: (entry: Entry) => void;
}

function NameVariantsComponent({person, onClickNameEntry}: NameVariantsComponentProps) {
    const personKey = person._key;
    const nodeInfo = getRicgraphNodeInfo().data;
    const personCategories = nodeInfo?.person_category_active ?? DEFAULT_PERSON_CATEGORIES_ACTIVE;
    const personDataQuery = useQuery({
        queryKey: ["entry-neighbors", personKey, personCategories.join("|")],
        queryFn: async () => {
            return await fetchAllNeighborNodes({
                key: personKey ?? "",
                category_want: personCategories
            });
        },
        enabled: Boolean(personKey),
    });
    const data = personDataQuery.data?.results ?? [];
    const names = getNames(data);

    if (!personDataQuery.isLoading && names.length < 1)
        return null;

    return (
        <RicgraphResultCard loading={personDataQuery.isLoading} className={"mb-3"}>
            This person has {names.length} name variants: {names.map((entry, index) =>
            (
                <Button
                    key={entry._key ?? index}
                    variant={"link"}
                    onClick={() => onClickNameEntry && onClickNameEntry(entry)}
                    className={"p-0 me-2 align-baseline"}
                >
                    {formatNameValue(entry.value ?? "", true)}
                </Button>
            )
        )}
        </RicgraphResultCard>
    );
}

export default NameVariantsComponent;