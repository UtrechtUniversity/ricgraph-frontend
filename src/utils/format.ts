import type {Entry} from "../api/general.ts";

export function getNames(data: Entry[]): Entry[] {
    const list: Entry[] = [];
    for (const entry of data ?? []) {
        if (entry == undefined) continue;
        if (entry.name === "FULL_NAME")
            list.push(entry)
    }
    return list;
}

export function formatNameValue(string: string, nameOnly?: boolean, idOnly?: boolean) {
    if (string && string.includes("#")) {
        const [name, id] = string.split("#");
        if (nameOnly)
            return `${name}`;
        else if (idOnly)
            return `${id}`;
        else
            return `${name} [${id}]`;
    }
    return string;
}

export function getRandomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ---------------------------------------------------------------------------
// URL columns
// ---------------------------------------------------------------------------

// Columns that contain hyperlinks. The backend delivers these three.
export const URL_COLUMNS = new Set(["url_main", "url_other", "url_asset"]);

// Returns every http(s) URL in a cell. The backend delivers a single URL as a string and
// multiple values as a JSON list. The list is normally already parsed into an array by
// res.json(), but a JSON list that arrives as a string ('["https://a", "https://b"]') is handled too.
// URLs are never split on separators, since URLs can legitimately contain commas.
export function extractUrls(value: unknown): string[] {
    let items: unknown[];

    if (Array.isArray(value)) {
        items = value;
    } else if (typeof value === "string" && value.trim().startsWith("[")) {
        try {
            const parsed = JSON.parse(value);
            items = Array.isArray(parsed) ? parsed : [value];
        } catch {
            items = [value];
        }
    } else {
        items = [value];
    }

    return items
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(item => /^https?:\/\//i.test(item));
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

// The text of one cell as it should appear in the CSV file.
// Mirrors what the table shows, except that URL columns contain the real URLs.
function cellToCsvText(column: string, value: unknown): string {
    if (value === undefined || value === null || value === "unknown") return "";
    if (URL_COLUMNS.has(column)) return extractUrls(value).join(",");
    if (Array.isArray(value)) return value.map(item => String(item)).join(" | ");
    if (typeof value === "string") return column === "value" ? formatNameValue(value) : value;
    return String(value);
}

function toCsvField(text: string): string {
    // A field starting with = + - @ (or a tab / carriage return) can be run as a formula by
    // spreadsheet programs. A leading apostrophe makes them treat it as plain text.
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
}

// Writes the given rows to a CSV file and starts the download.
// This works from the data itself (not from the rendered <table>), so it exports
// every row passed in, in that order, not only the rows on the current page.
// maxRows <= 0 means: export all rows.
export function exportRowsToCSV(
    rows: Record<string, any>[],
    columns: string[],
    fileName: string,
    maxRows: number,
): void {
    const exportRows = maxRows > 0 ? rows.slice(0, maxRows) : rows;

    const lines = [
        columns.map(column => toCsvField(column)).join(","),
        ...exportRows.map(row =>
            columns.map(column => toCsvField(cellToCsvText(column, row[column]))).join(",")
        ),
    ];

    // The BOM at the start makes Excel read the file as UTF-8 (names with accents, etc.).
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {type: "text/csv;charset=utf-8;"});
    const safeFileName = fileName.replace(/[^\w.-]+/g, "_") || "ricgraph-export";

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${safeFileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
}

export function isFirefox(): boolean {
    return navigator.userAgent.includes("Firefox");
}
