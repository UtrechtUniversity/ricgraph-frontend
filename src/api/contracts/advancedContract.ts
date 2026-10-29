import type {Entry, Meta} from "../general.ts";

// Search for anything (broad search)
export interface BroadSearchRequest {
    value: string; // Search for a value in Ricgraph field value.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface BroadSearchResponse {
    meta: Meta;
    results: Entry[];
}

// Advanced search
// ---
// The fields you enter are case-sensitive and use exact match search.
// If you enter values in more than one field, these fields are combined using AND.
// ---
export interface AdvancedSearchRequest {
    name?: string; // Search for a value in Ricgraph field name.
    category?: string; // Search for a value in Ricgraph field category.
    value?: string; // Search for a value in Ricgraph field value.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface AdvancedSearchResponse {
    meta: Meta;
    results: Entry[];
}

// Find all person-root nodes of this node
export interface FindPersonRootRequest {
    key: string; // Search for a value in Ricgraph field _key.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface FindPersonRootResponse {
    meta: Meta;
    results: Entry[];
}

// Find all neighbor nodes of this node
export interface FindNeighborNodesRequest {
    key: string; // Search for a value in Ricgraph field _key.
    name_want?: string[]; // Return only neighbor nodes whose field name matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field name.
    name_dontwant?: string[]; // Return only neighbor nodes whose field name does not match any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field name.
    category_want?: string[]; // Return only neighbor nodes whose field category matches any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field category.
    category_dontwant?: string[]; // Return only neighbor nodes whose field category does not match any value in the provided list; if the list is empty, return all neighbor nodes regardless of their field category.
    page_size?: string; // The number of items to return for one page (at most 250 items). To get the following page, you need to use the cursor that is returned in the REST API reply. Default = 50
    cursor?: string; // The cursor for the graph query. If you change the parameters for this query, you should empty the cursor.
}

export interface FindNeighborNodesResponse {
    meta: Meta;
    results: Entry[];
}

// Get information about Ricgraph
// ---
// Get information about Ricgraph.
// Some of this information is dependent on the data in your Ricgraph instance and on the systems you have harvested, and some of it is not.
// There are four types of information that you can retrieve, as indicated in the list below.
// Each information type has its own fields.
// You can query an item to find out what fields it contains.
//
// ricgraph_cacheinfo: information about the cache Ricgraph uses, and the size of that cache.
// ricgraph_harvestinfo: information about the sources that Ricgraph has harvested, and the number of nodes and edges.
// ricgraph_nodeinfo: information about nodes in Ricgraph, and their fields and field values.
// ricgraph_systeminfo: information about Ricgraph and Ricgraph Explorer.
// ---

export type RicgraphInfoType =
    "ricgraph_cacheinfo"
    | "ricgraph_harvestinfo"
    | "ricgraph_nodeinfo"
    | "ricgraph_systeminfo";

export interface InformationRicgraphRequest {
    ricgraph_info: RicgraphInfoType | RicgraphInfoType[];
}

export interface InformationRicgraphCacheResponse {
    meta: Meta;
    results: RicgraphCacheInfo;
}

export interface InformationRicgraphHarvestResponse {
    meta: Meta;
    results: RicgraphHarvestInfo;
}

export interface InformationRicgraphNodeResponse {
    meta: Meta;
    results: RicgraphNodeInfo;
}

export interface InformationRicgraphSystemResponse {
    meta: Meta;
    results: RicgraphSystemInfo;
}

export interface RicgraphCacheInfo {
    cache_name: string;
    nr_items: string;
    size_kb: string;
    last_update: string;
}

export interface RicgraphHarvestInfo {
    harvest_date: string;
    nr_edges: string;
    nr_nodes: string;
    source_active: string[];
    last_update: string;
}

export interface RicgraphNodeInfo {
    access_active: string[];
    access_all: string[];
    category_active: string[];
    competence_category_all: string[];
    name_active: string[];
    license_active: string[];
    license_all: string[];
    organization_category_all: string[];
    person_category_active: string[];
    person_category_all: string[];
    person_name_active: string[];
    person_name_person_root_list: string[];
    project_category_all: string[];
    non_person_category_active: string[];
    researchresult_category_active: string[];
    researchresult_category_all: string[];
    researchresult_category_publication_active: string[];
    researchresult_category_publication_all: string[];
    researchresult_category_research_material: string[];
    researchresult_category_reporting_material: string[];
    researchresult_category_engagement_material: string[];
    ricgraph_node_all_properties: string[];
    year_active: string[];
    last_update: string;
}

export interface RicgraphSystemInfo {
    access_all: string[];
    collaboration_modes_all: string[];
    discoverer_mode_all: string[];
    discoverer_mode_default: string;
    histogram_mode_all: string[];
    homepage_intro_html: string;
    homepage_outro_html: string;
    max_items_to_return_restapi: number;
    orgs_with_hierarchies: any[];
    origin_button_all: string[];
    osl_profile_mode_all: string[];
    overlap_mode: string;
    page_footer: string;
    ricgraph_explorer_runmode: string;
    ricgraph_version: string;
    search_mode_all: string[];
    search_mode_default: string;
    table_detail_columns: string[];
    table_id_columns: string[];
    table_organization_columns: string[];
    table_research_output_columns: string[];
    view_mode_all: string[];
    last_update: string;
}