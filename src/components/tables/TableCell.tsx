import {extractUrls, formatNameValue, URL_COLUMNS} from "../../utils/format.ts";

interface TableCellProps {
    column: string;
    row: Record<string, any>;
    onClickValue?: (entry: Record<string, any>) => void;
}

// No link: empty cell. One link: "<column> link". More links: a bulleted list with
// "<column>1 link", "<column>2 link", ...
function renderUrlCell(column: string, value: unknown) {
    const urls = extractUrls(value);
    if (urls.length === 0) return null;

    if (urls.length === 1) {
        return (
            <a href={urls[0]} target={"_blank"} rel={"noopener"}>
                {`${column} link`}
            </a>
        );
    }

    return (
        <ul>
            {urls.map((url, idx) => (
                <li key={idx}>
                    <a href={url} target={"_blank"} rel={"noopener"}>
                        {`${column}${idx + 1} link`}
                    </a>
                </li>
            ))}
        </ul>
    );
}

function renderContent({column, row, onClickValue}: TableCellProps) {
    const value = row[column];

    if (URL_COLUMNS.has(column)) {
        // url_main / url_other / url_asset: render as "<column> link" links
        return renderUrlCell(column, value);
    }

    if (column === "_history" && Array.isArray(value)) {
        // The "_history" column is rendered with an Expand thing
        return (
            <details>
                <summary>Expand</summary>
                <ul>
                    {value.map((item: any, idx: number) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </details>
        );
    }

    if (column === "value") {
        if (!onClickValue) {
            // No click action provided: render the value normally
            return formatNameValue(value);
        }
        // Use the click action provided
        return (
            <a
                href={"#"}
                className={"value-link"}
                onClick={e => {
                    e.preventDefault();
                    onClickValue(row);
                }}
            >
                {formatNameValue(value)}
            </a>
        );
    }

    if (Array.isArray(value)) {
        // If the value is an array, render the items as bullet points
        return (
            <ul>
                {value.map((item: any, idx: number) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        );
    }

    if (typeof value === "string" && value.startsWith("http")) {
        // If the value is a link, render it as a clickable link
        return (
            <a href={value} target={"_blank"} rel={"noopener"}>
                {formatNameValue(value)}
            </a>
        );
    }

    // If the value is unknown, render it empty. Otherwise, render the value as regular text
    return value === "unknown" ? "" : value;
}

// One <td> of a result table. All the rules for how a column is displayed live here.
function TableCell(props: TableCellProps) {
        return <td className={`col-${props.column}`}>{renderContent(props)}</td>;
}

export default TableCell;
