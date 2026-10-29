import {fetchEndpoint, toSearchParams} from "../general.ts";
import type {
    OrganizationAllInformationRequest,
    OrganizationAllInformationResponse,
    OrganizationOtherSourceInfoRequest,
    OrganizationOtherSourceInfoResponse,
    OrganizationPersonsInfoRequest,
    OrganizationPersonsInfoResponse,
    OrganizationSearchRequest,
    OrganizationSearchResponse
} from "../contracts/organizationContract.ts";

export async function fetchOrganization(request: OrganizationSearchRequest): Promise<OrganizationSearchResponse | null> {
    return fetchEndpoint<OrganizationSearchResponse>("/api/organization/search", toSearchParams(request));
}

export async function fetchOrganizationAllInformation(request: OrganizationAllInformationRequest): Promise<OrganizationAllInformationResponse | null> {
    return fetchEndpoint<OrganizationAllInformationResponse>("/api/organization/all_information", toSearchParams(request));
}

export async function fetchOrganizationPersonsInfo(request: OrganizationPersonsInfoRequest): Promise<OrganizationPersonsInfoResponse | null> {
    return fetchEndpoint<OrganizationPersonsInfoResponse>("/api/organization/information_persons_results", toSearchParams(request));
}

export async function fetchOrganizationOtherSourceInfo(request: OrganizationOtherSourceInfoRequest): Promise<OrganizationOtherSourceInfoResponse | null> {
    return fetchEndpoint<OrganizationOtherSourceInfoResponse>("/api/organization/enrich", toSearchParams(request));
}