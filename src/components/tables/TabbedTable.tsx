import {Card, Container, Tab, Tabs} from "react-bootstrap";
import CustomTable from "./CustomTable.tsx";
import "./TabbedTable.css";
import type {Entry} from "../../api/general.ts";

interface TabbedTableProps {
    tableId?: string;

    header?: string;

    columns: string[];

    // Everything loaded so far. Tabs and their counts are derived from this,
    // so they grow as more pages load instead of being replaced page by page.
    data: Entry[];

    // Which property to group tabs by. Defaults to "category"
    groupBy?: "category" | "name";

    onClickValue?: (entry: Record<string, any>) => void;

    // Rows per page inside each tab's table.
    pageSize?: number;

    // Progressive loading, forwarded to each tab's table (see CustomTable).
    hasMore?: boolean;
    isLoadingMore?: boolean;
    onLoadMore?: () => void;
}

function TabbedTable({
                         tableId,
                         header,
                         columns,
                         data,
                         groupBy = "category",
                         onClickValue,
                         pageSize,
                         hasMore,
                         isLoadingMore,
                         onLoadMore,
                     }: TabbedTableProps) {
    const groupedData: Record<string, Entry[]> = {};

    data.forEach(item => {
        const group = item[groupBy] ?? "unknown";

        if (!groupedData[group]) groupedData[group] = [];
        groupedData[group].push(item);
    });

    const tabs = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));

    /*
    if (tabs.length === 0) {
        return (
            <Container fluid>
                {header && <p>{header}</p>}
                <p>{hasMore ? "No data loaded yet." : "No data available."}</p>
            </Container>
        );
    }
    */
    // No rows means no tabs: show nothing at all
    if (tabs.length === 0) return null;

    return (
        <Container fluid>
            {header && <p>{header}</p>}
            <Tabs className={"tabbed-table uu-yellow"} defaultActiveKey={tabs[0]} id={tableId}>
                {tabs.map(tab => (
                    <Tab
                        eventKey={tab}
                        title={`${tab} (${groupedData[tab].length})`}
                        key={tab}
                    >
                        <Card>
                            <Card.Body>
                                <CustomTable
                                    tableId={tableId ? `${tableId}-${tab}` : undefined}
                                    exportName={tab}
                                    header={`List of '${tab}':`}
                                    columns={columns}
                                    data={groupedData[tab]}
                                    onClickValue={onClickValue}
                                    pageSize={pageSize}
                                    hasMore={hasMore}
                                    isLoadingMore={isLoadingMore}
                                    onLoadMore={onLoadMore}
                                />
                            </Card.Body>
                        </Card>
                    </Tab>
                ))}
            </Tabs>
            <div className={"mt-2"}>
                {data.length} row{data.length === 1 ? "" : "s"} across {tabs.length} tab{tabs.length === 1 ? "" : "s"}
                {hasMore ? " loaded so far" : ""}.
            </div>
        </Container>
    );
}

export default TabbedTable;
