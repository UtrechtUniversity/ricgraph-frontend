// How many rows a result table shows per page.
// For server-cursor tables this is the page size requested from the API.
// For the few tables whose endpoint can't be cursored it is applied client-side.
// 0 = ask for as many rows as the server allows per page (MAX_PAGE_SIZE).
// Mirrors the original Ricgraph default.
export const DEFAULT_MAX_NR_TABLE_ROWS = 50;
export const DEFAULT_MAX_NR_TABLE_ROWS_STRING = "50";

export const DISCOVERER_MODE_DETAILS = "details_view";
export const DISCOVERER_MODE_PERSON = "person_view";
export const DISCOVERER_MODE_DESCRIPTIONS: Record<string, string> = {
    [DISCOVERER_MODE_PERSON]: "Only show relevant columns, results are presented in a tabbed format. Tables have fewer columns to reduce information overload.",
    [DISCOVERER_MODE_DETAILS]: "Show all columns, research results are presented in a table with facets. This view shows all columns in Ricgraph.",
};

export const pages = {
    SEARCH_BROAD: "/search-broad",
    SEARCH_ADVANCED: "/search-advanced",
    SEARCH: "/search",

    SEARCH_RESULTS: "/search/results",

    OPTIONS: "/options",

    RESULTS_PERSON_ALL: "/results-person-all",
    RESULTS_PERSON_PERSONAL: "/results-person-personal",
    RESULTS_PERSON_ORGANIZATION: "/results-person-organization",
    RESULTS_PERSON_RESEARCH: "/results-person-research",
    RESULTS_PERSON_SHARE_RESEARCH: "/results-person-share-research",
    RESULTS_PERSON_COLLABORATING_ORGANIZATIONS: "/results-person-collaborating-organizations",
    RESULTS_PERSON_ENRICH: "/results-person-enrich",

    RESULTS_ORGANIZATION_ALL: "/results-organization-all",
    RESULTS_ORGANIZATION_PERSONS: "/results-organization-persons",
    RESULTS_OTHER: "/results-other",

    EXPLORE_COLLABORATIONS: "/collabspage",
    COLLABS_RESULTS: "/results-collabs",
    OPEN_SCIENCE_LANDSCAPE: "/oslpage",
    RESULTS_ORGANIZATION_ANY_INFO_PERSONS: "/results-organization-any-info-persons",
    /*
    OS_PROFILE_RESULTS: "/results-os-profile",
    OS_DASHBOARD_RESULTS: "/results-os-dashboard",
    */
};

export const DEFAULT_PERSON_CATEGORIES_ACTIVE = ["person"];
export const DEFAULT_RESEARCH_CATEGORIES_ACTIVE = ["data set", "method description", "model", "other contribution", "software"];

// Some "name" fields are omitted in the identities component in the original Ricgraph Explorer, so we'll exclude them here too.
export const PERSON_IDENTITY_EXCLUDED_NAMES = ["FULL_NAME", "FULL_NAME_ASCII", "person-root", "PHOTO_ID"];

// Shared by every page with a "year" filter card (CollabsResultsPage, OSProfileResultPage, OSDashboardResultPage).
export const FORM_YEAR_FIRST_INPUT = "year_first";
export const FORM_YEAR_LAST_INPUT = "year_last";
export const YEAR_DATALIST_ID = "year_datalist";

/*
// Marks that an organization search started from an "open science" button, so picking a
// result routes straight to the profile/dashboard page instead of the generic options page.
// Set in OpenScienceLandscapePage, read in utils/navigation.ts.
export const ORIGIN_OS_PROFILE_BUTTON = "osprofile_button";
export const ORIGIN_OS_DASHBOARD_BUTTON = "osdashboard_button";
*/
