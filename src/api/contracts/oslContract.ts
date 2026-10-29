import type {Meta} from "../general.ts";

// Explore collaborations
// ---
// Explore collaborations between (sub-)organizations.
// This function will return a full HTML page in the 'results' field of the response.
// If this 'results' field is empty, there were either no collaborations, or one or more invalid field values have been entered.
// Unfortunately, at the moment, there is no way to return error messages for the latter case.
// The REST API includes the text of the following four D3 JavaScript libraries in its response.
// These libraries can be found at https://github.com/UtrechtUniversity/ricgraph/tree/main/ricgraph_explorer/static.
//
// d3.v7.min.js
// d3-chord.v3.min.js
// d3-scale-chromatic.v1.min.js
// d3-sankey.v0.12.3.min.js
// ---
export interface ExploreCollaborationsRequest {
    start_organization: string; // Type the name for start_organization. This field may either be a full (sub-)organization name, or a prefix of a (sub-)organization.
    collaborating_organization?: string; // Type the name for collaborating_organization. This field may either be a full (sub-)organization name, or a prefix of a (sub-)organization. It may also be empty, in that case the collaborations from start_organization to any (sub-)organization will be found.
    researchresult_category?: string[]; // Restrict the collaborations to research results of a specific category. You can enter one or more categories. If you leave it empty, collaborations having any research result type will be found.
}

export interface ExploreCollaborationsResponse {
    meta: Meta;
    results: string[]; // Single-element array containing the full HTML page that renders the Sankey diagram
}
