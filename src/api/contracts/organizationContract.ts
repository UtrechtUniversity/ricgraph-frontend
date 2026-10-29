import type {Entry, Meta} from "../general.ts";


// Search for a (sub-)organization
export interface OrganizationSearchRequest {
    value: string; // Search for a value in Ricgraph field value.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface OrganizationSearchResponse {
    meta: Meta;
    results: Entry[];
}

// Show all information related to this organization
export interface OrganizationAllInformationRequest {
    key: string; // Search for a value in Ricgraph field _key.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface OrganizationAllInformationResponse {
    meta: Meta;
    results: Entry[];
}

// Find any information from persons or their results in this organization
export interface OrganizationPersonsInfoRequest {
    key: string; // Search for a value in Ricgraph field _key.
    name_want?: string[]; // Return only neighbor nodes whose field name matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field name.
    category_want?: string[]; // Return only neighbor nodes whose field category matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field category.
    year_first?: string; // Search for a research result from year >= year_first. If you include this field, only research results will be returned.
    year_last?: string; // Search for a research result from year <= year_last. If you include this field, only research results will be returned.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface OrganizationPersonsInfoResponse {
    meta: Meta;
    results: Entry[];
}

// Find information harvested from other source systems, not present in this source system
// ---
// The process of improving or enhancing information in a source system is called enriching that source system.
// This is only possible if you have harvested more than one source system.
// By using information found in one or more other harvested systems, information in this source system can be improved or enhanced.
// With this call you can enter a name of one of your source systems.
// Ricgraph will show what information can be added to this source system, based on the information harvested from other source systems.
// This call enriches organizations.
// It is different compared to the REST API call /person/enrich, since that call also returns information that allows to you find the node to enrich in the source system you specify.
// The REST API call /organization/enrich does NOT returns that information (yet).
// ---
export interface OrganizationOtherSourceInfoRequest {
    key: string; // Search for a value in Ricgraph field _key.
    name_want?: string[]; // Return only neighbor nodes whose field name matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field name.
    category_want?: string[]; // Return only neighbor nodes whose field category matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field category.
    source_system: string; // The name of the source system you would like to enrich.
    year_first?: string; // Search for a research result from year >= year_first. If you include this field, only research results will be returned.
    year_last?: string; // Search for a research result from year <= year_last. If you include this field, only research results will be returned.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface OrganizationOtherSourceInfoResponse {
    meta: Meta;
    results: Entry[];
}