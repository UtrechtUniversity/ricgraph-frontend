import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import {toEntry} from "../api/general.ts";
import type {AdvancedSearchRequest} from "../api/contracts/advancedContract.ts";
import {fetchAdvancedSearch} from "../api/endpoints/advanced.ts";
import {queryClient} from "../api/queryClient.ts";

// Resolves the exact node the user clicked, matched by _key/name/value from the URL
// Reuses the "selected-entry" cache entry set by that click (see SearchResultsPage),
// so it's instant when we already know the answer.
export function useSelectedEntry() {
    const [searchParams] = useSearchParams();
    const simpleEntry = toEntry(searchParams);
    const hasRequiredParams = Boolean(simpleEntry._key && simpleEntry.name && simpleEntry.value);

    return useQuery({
        queryKey: ["entry", simpleEntry._key],
        queryFn: async () => {
            const response = await fetchAdvancedSearch(simpleEntry as AdvancedSearchRequest);
            return response?.results[0] ?? null;
        },
        enabled: hasRequiredParams,
        initialData: () => queryClient.getQueryData(["selected-entry", simpleEntry._key]),
    });
}
