import type {RicgraphNodeInfo} from "../api/contracts/advancedContract.ts";
import {FORM_YEAR_FIRST_INPUT, FORM_YEAR_LAST_INPUT} from "./constants.ts";

export interface YearRange {
    yearFirst: string;
    yearLast: string;
}

// Reads the "From" and "To" year values out of the form that a <YearFilterCard> lives in.
// Call it from that form's onSubmit handler and pass event.currentTarget (the form element).
export function readYearRange(form: HTMLFormElement): YearRange {
    const formData = new FormData(form);
    return {
        yearFirst: String(formData.get(FORM_YEAR_FIRST_INPUT) ?? "").trim(),
        yearLast: String(formData.get(FORM_YEAR_LAST_INPUT) ?? "").trim(),
    };
}

// Used when the graph hasn't reported which years are actually present in the data.
export const FALLBACK_YEAR_MIN = new Date().getFullYear() - 200;
export const FALLBACK_YEAR_MAX = new Date().getFullYear();

export function getYearRange(nodeInfo?: RicgraphNodeInfo) {
    const yearOptions = (nodeInfo?.year_active ?? []).slice().sort((a, b) => Number(a) - Number(b));
    const yearMin = yearOptions.length > 0 ? Number(yearOptions[0]) : FALLBACK_YEAR_MIN;
    const yearMax = yearOptions.length > 0 ? Number(yearOptions[yearOptions.length - 1]) : FALLBACK_YEAR_MAX;
    return {yearOptions, yearMin, yearMax};
}

// Mirrors the backend's get_year_range_text(): "for all years", "from 2020 onwards",
// "up to 2025", or "from 2020 to 2025".
export function getYearRangeText(yearFirst: string, yearLast: string): string {
    if (yearFirst === "" && yearLast === "") return "for all years";

    const from = yearFirst === "" ? "up" : `from ${yearFirst}`;
    const to = yearLast === "" ? "onwards" : `to ${yearLast}`;
    return `${from} ${to}`;
}
