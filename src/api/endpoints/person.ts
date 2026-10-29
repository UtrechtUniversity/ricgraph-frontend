import type {
    PersonAllInformationRequest,
    PersonAllInformationResponse,
    PersonOrganizationRequest,
    PersonOrganizationResponse,
    PersonOtherSourceInfoRequest,
    PersonOtherSourceInfoResponse,
    PersonSearchRequest,
    PersonSearchResponse,
    PersonShareResearchRequest,
    PersonShareResearchResponse
} from "../contracts/personContract.ts";
import {fetchEndpoint, toSearchParams} from "../general.ts";

export async function fetchPerson(request: PersonSearchRequest): Promise<PersonSearchResponse | null> {
    return fetchEndpoint<PersonSearchResponse>("/api/person/search", toSearchParams(request));
}

export async function fetchPersonAllInformation(request: PersonAllInformationRequest): Promise<PersonAllInformationResponse | null> {
    return fetchEndpoint<PersonAllInformationResponse>("/api/person/all_information", toSearchParams(request));
}

export async function fetchPersonOrganizationsCollabs(request: PersonOrganizationRequest): Promise<PersonOrganizationResponse | null> {
    return fetchEndpoint<PersonOrganizationResponse>("/api/person/collaborating_organizations", toSearchParams(request));
}

export async function fetchPersonResearchRelated(request: PersonShareResearchRequest): Promise<PersonShareResearchResponse | null> {
    return fetchEndpoint<PersonShareResearchResponse>("/api/person/share_researchresults", toSearchParams(request));
}

export async function fetchPersonOtherSourceInfo(request: PersonOtherSourceInfoRequest): Promise<PersonOtherSourceInfoResponse | null> {
    return fetchEndpoint<PersonOtherSourceInfoResponse>("/api/person/enrich", toSearchParams(request));
}