import {DEFAULT_MAX_NR_TABLE_ROWS_STRING} from "../utils/constants.ts";

export interface Meta {
    count?: number;
    page?: number;
    per_page?: number;
    status?: number;
    message?: string;
    // Opaque pagination cursor for the next page ("<cache_key>|<page_size>|<index>").
    // Empty string when there is no next page.
    next_cursor?: string;
}

// Page size to request from a paginated endpoint.
// The backend caps this at 250.
export const MAX_PAGE_SIZE = "250";

// The API-default page size to request from a paginated endpoint.
// This value is only used as a fallback.
// See DEFAULT_MAX_NR_TABLE_ROWS in constants.ts for the preferred front-end default shown to the user.
export const DEFAULT_PAGE_SIZE = "50";

export function clampPageSize(value: string | number | null | undefined): string {
    const n = typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
    // 0 means as many rows as possible on one page
    // With cursor pagination we can't know the total up front, so ask for the largest page.
    if (n === 0) return MAX_PAGE_SIZE;
    if (!Number.isFinite(n) || n < 0) return DEFAULT_PAGE_SIZE;
    return String(Math.min(n, parseInt(MAX_PAGE_SIZE)));
}

// Returns the max_nr_table_rows as a parsed clamped/valid value.
// Falls back to the default when the param is missing or invalid.
export function getTableRowsPerPage(source: { max_nr_table_rows?: string | null }): number {
    return parseInt(clampPageSize(source.max_nr_table_rows ?? DEFAULT_MAX_NR_TABLE_ROWS_STRING), 10);
}

// Decide whether there is a next page. The backend returns an empty
// meta.next_cursor when there are no more results to retrieve.
export function resolveNextCursor(metaNextCursor: string | undefined | null): string | undefined {
    return metaNextCursor || undefined;
}

// A loosely-typed Entry, for when we only have some fields (e.g. from URL params).
export interface UrlEntry {
    _key?: string | null;
    name?: string | null;
    category?: string | null;
    value?: string | null;
    max_nr_table_rows?: string | null;
}

// A single node as the backend returns it (a person, org, research result, etc).
export interface Entry {
    _key: string;
    name: string;
    category: string;
    value: string;
    comment: string;
    year: string;
    license: string;
    access: string;
    url_main: string;
    url_other: string;
    source_event: string;
    history_event: string;
    _source: string[];
    _history: string[];
}

// Renames "_key" to "key" - that's what the backend endpoints actually expect.
export function normalizeParams(searchParams: URLSearchParams): URLSearchParams | null {
    const params = new URLSearchParams(searchParams);

    if (params.size === 0) return null;

    if (params.has("_key") && !params.has("key")) {
        const key = params.get("_key") || "";
        params.set("key", key);
        params.delete("_key");
    }

    return params;
}

// Fetches an endpoint and parses the JSON as T. Throws on network errors or non-2xx status
// instead of swallowing them so react-query can tell "backend is down" apart from
// "backend says there's nothing here".
// Times out after 10 seconds.
export async function fetchEndpoint<T>(path: string, searchParams: URLSearchParams): Promise<T> {
    const params = normalizeParams(searchParams);
    const endpoint = `${path}${params ? `?${params.toString()}` : ""}`;

    let res: Response;
    try {
        res = await fetch(endpoint, {signal: AbortSignal.timeout(10000)});
    } catch (err) {
        throw new Error(`Could not reach the server for ${path}`, {cause: err});
    }

    if (!res.ok) {
        throw new Error(`Server returned ${res.status} ${res.statusText} for ${path}`);
    }

    return await res.json() as T;
}

export function toSearchParams<T extends object>(request: T, additionalParams: Record<string, unknown> = {}): URLSearchParams {
    const params = new URLSearchParams();
    Object.entries(request).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, String(item)));
        } else {
            params.set(key, String(value));
        }
    });
    Object.entries(additionalParams).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        params.set(key, String(value));
    });
    return params;
}

export function toEntry(params: URLSearchParams): UrlEntry {
    return {
        _key: params.get("_key"),
        name: params.get("name"),
        category: params.get("category"),
        value: params.get("value"),
        max_nr_table_rows: params.get("max_nr_table_rows"),
    };
}