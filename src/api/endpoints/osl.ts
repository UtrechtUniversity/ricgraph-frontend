import {fetchEndpoint, toSearchParams} from "../general.ts";
import type {ExploreCollaborationsRequest, ExploreCollaborationsResponse} from "../contracts/oslContract.ts";

export async function fetchExploreCollaborations(request: ExploreCollaborationsRequest): Promise<ExploreCollaborationsResponse | null> {
    return fetchEndpoint<ExploreCollaborationsResponse>("/api/opensciencelandscape/explorecollaborations", toSearchParams(request));
}
