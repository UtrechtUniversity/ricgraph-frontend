import type {
    AdvancedSearchRequest,
    AdvancedSearchResponse,
    BroadSearchRequest,
    BroadSearchResponse,
    FindNeighborNodesRequest,
    FindNeighborNodesResponse,
    FindPersonRootRequest,
    FindPersonRootResponse,
    InformationRicgraphCacheResponse,
    InformationRicgraphHarvestResponse,
    InformationRicgraphNodeResponse,
    InformationRicgraphRequest,
    InformationRicgraphSystemResponse
} from "../contracts/advancedContract.ts";
import {fetchEndpoint, toSearchParams} from "../general.ts";
import {useQuery} from "@tanstack/react-query";

export async function fetchBroadSearch(request: BroadSearchRequest): Promise<BroadSearchResponse | null> {
    return fetchEndpoint<BroadSearchResponse>("/api/broad_search", toSearchParams(request));
}

export async function fetchAdvancedSearch(request: AdvancedSearchRequest): Promise<AdvancedSearchResponse | null> {
    return fetchEndpoint<AdvancedSearchResponse>("/api/advanced_search", toSearchParams(request));
}

export async function fetchPersonRoot(request: FindPersonRootRequest): Promise<FindPersonRootResponse | null> {
    return fetchEndpoint<FindPersonRootResponse>("/api/get_all_personroot_nodes", toSearchParams(request));
}

export async function fetchAllNeighborNodes(request: FindNeighborNodesRequest): Promise<FindNeighborNodesResponse | null> {
    return fetchEndpoint<FindNeighborNodesResponse>("/api/get_all_neighbor_nodes", toSearchParams(request));
}


async function fetchRicgraphInfo<T>(
    request: InformationRicgraphRequest
): Promise<T | null> {
    return fetchEndpoint<T>(
        "/api/get_ricgraph_info",
        toSearchParams(request)
    );
}

export function getRicgraphCacheInfo() {
    const query = useQuery({
        queryKey: ["ricgraph_info", "cache"],
        queryFn: async () => {
            const response = await fetchRicgraphInfo<InformationRicgraphCacheResponse>({ricgraph_info: "ricgraph_cacheinfo"});
            return response?.results;
        }
    });
    return {data: query.data};
}

export function getRicgraphHarvestInfo() {
    const query = useQuery({
        queryKey: ["ricgraph_info", "harvest"],
        queryFn: async () => {
            const response = await fetchRicgraphInfo<InformationRicgraphHarvestResponse>({ricgraph_info: "ricgraph_harvestinfo"});
            return response?.results;
        }
    });
    return {data: query.data};
}

export function getRicgraphNodeInfo() {
    const query = useQuery({
        queryKey: ["ricgraph_info", "node"],
        queryFn: async () => {
            const response = await fetchRicgraphInfo<InformationRicgraphNodeResponse>({ricgraph_info: "ricgraph_nodeinfo"});
            return response?.results;
        }
    });
    return {data: query.data};
}

// The backend HTML refers to images by the path of the original Ricgraph
// web app ("/static/images/..."). In this frontend those files live in
// public/images/, so rewrite the path.
function fixStaticPaths(html: string | undefined): string {
    return (html ?? "").replace(
        /(["'(])\/?static\/images\//g,
        `$1${import.meta.env.BASE_URL}images/`
    );
}

export function getRicgraphSystemInfo() {
    const query = useQuery({
        queryKey: ["ricgraph_info", "system"],
        queryFn: async () => {
            const response = await fetchRicgraphInfo<InformationRicgraphSystemResponse>({ricgraph_info: "ricgraph_systeminfo"});
            return response?.results;
        },
        select: (results) => results && {
            ...results,
            homepage_intro_html: fixStaticPaths(results.homepage_intro_html),
            homepage_outro_html: fixStaticPaths(results.homepage_outro_html),
        },
    });
    return {data: query.data};
}