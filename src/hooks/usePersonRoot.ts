import {useQuery} from "@tanstack/react-query";
import {fetchPersonRoot} from "../api/endpoints/advanced.ts";
import type {Entry} from "../api/general.ts";

// Resolves the person-root node for a given _key.
export function usePersonRoot(key: string) {
    return useQuery<Entry | null>({
        queryKey: ["person-root", key],
        queryFn: async () => {
            const response = await fetchPersonRoot({key});
            return response?.results[0] ?? null;
        },
        enabled: Boolean(key),
    });
}
