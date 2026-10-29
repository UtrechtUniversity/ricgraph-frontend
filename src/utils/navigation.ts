import {toSearchParams, type UrlEntry} from "../api/general.ts";
/*
import {ORIGIN_OS_DASHBOARD_BUTTON, ORIGIN_OS_PROFILE_BUTTON, pages} from "./constants.ts";
*/
import {pages} from "./constants.ts";

export function getEntryTargetPage(entry: UrlEntry,
                                   searchParams?: URLSearchParams) {
    let url = "";
    switch (entry.category) {
        /*
        case "organization":
            // A search for an organization started from one of the "open science" buttons
            // goes straight to that result page instead of the generic options page.
            switch (searchParams?.get("origin")) {
                case ORIGIN_OS_PROFILE_BUTTON:
                    url = pages.OS_PROFILE_RESULTS;
                    break;
                case ORIGIN_OS_DASHBOARD_BUTTON:
                    url = pages.OS_DASHBOARD_RESULTS;
                    break;
                default:
                    url = pages.OPTIONS;
                    break;
            }
            break;
        */
        case "organization":
        case "person":
            url += pages.OPTIONS;
            break;
        default:
            url += pages.RESULTS_OTHER;
            break;
    }
    const params = new URLSearchParams(searchParams);
    const newParams = toSearchParams({
        _key: entry._key,
        name: entry.name,
        category: entry.category,
        value: entry.value,
    });
    for (const [key, value] of newParams.entries()) {
        params.set(key, value);
    }

    return `${url}?${params.toString()}`;
}
