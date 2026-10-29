import type {Entry, Meta} from "../general.ts";


// Search for a person
export interface PersonSearchRequest {
    value: string; // Search for a value in Ricgraph field value.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface PersonSearchResponse {
    meta: Meta;
    results: Entry[];
}

// Show all information related to this person
export interface PersonAllInformationRequest {
    key: string; // Search for a value in Ricgraph field _key.
    year_first?: string; // Search for a research result from year >= year_first. If you include this field, only research results will be returned.
    year_last?: string; // Search for a research result from year <= year_last. If you include this field, only research results will be returned.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface PersonAllInformationResponse {
    meta: Meta;
    results: Entry[];
}

// Find persons that share any research result types with this person
export interface PersonShareResearchRequest {
    key: string; // Search for a value in Ricgraph field _key.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface PersonShareResearchResponse {
    meta: Meta;
    results: Entry[];
}

// Find organizations that this person collaborates with.
// --
// With this call you will get an overview of organizations that his person collaborates with.
// A person X from organization A collaborates with a person Y from organization B if X and Y have both contributed to the same research result.
// ---
// Note: this endpoint does not have cursor pagination because it returns two lists.
export interface PersonOrganizationRequest {
    key: string; // Search for a value in Ricgraph field _key.
    max_nr_items?: string; // The maximum number of items to return, or 0 to return all items. Default = 250
}

export interface PersonOrganizationResponse {
    meta: Meta;
    results: {
        meta: Meta;
        person_works_at: Entry[];
        person_collaborates_with: Entry[];
    }[];
}

// Find information harvested from other source systems, not present in this source system
// ---
// The process of improving or enhancing information in a source system is called enriching that source system.
// This is only possible if you have harvested more than one source system.
// By using information found in one or more other harvested systems, information in this source system can be improved or enhanced.
// With this call you can enter a name of one of your source systems. Ricgraph will show what information can be added to this source system, based on the information harvested from other source systems.
// This call enriches persons.
// Note that if you specify category_want, you will need to add category person too, since otherwise you will not be able to find person_identifying_nodes (the nodes to add the newly found information to).
// ---
// Note: this endpoint does not have cursor pagination because it returns two lists nested.
export interface PersonOtherSourceInfoRequest {
    key: string; // Search for a value in Ricgraph field _key.
    name_want?: string[]; // Return only neighbor nodes whose field name matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field name.
    category_want?: string[]; // Return only neighbor nodes whose field category matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field category.
    source_system: string; // The name of the source system you would like to enrich.
    year_first?: string; // Search for a research result from year >= year_first. If you include this field, only research results will be returned.
    year_last?: string; // Search for a research result from year <= year_last. If you include this field, only research results will be returned.
    max_nr_items?: string; // The maximum number of items to return, or 0 to return all items. Default = 250
}

export interface PersonOtherSourceInfoResponse {
    meta: Meta;
    results: {
        meta: Meta;
        person_identifying_nodes: Entry[];
        person_enrich_nodes: Entry[];
    }[];
}