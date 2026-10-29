import {Card} from "react-bootstrap";
import RicgraphResultCard from "./RicgraphResultCard.tsx";
import {type Entry, getTableRowsPerPage, resolveNextCursor} from "../../api/general.ts";
import PaginatedResultsTable from "../tables/PaginatedResultsTable.tsx";
import {getDiscovererMode} from "../../utils/params.ts";
import {useSearchResultColumns} from "../../hooks/useSearchResultColumns.ts";
import {usePaginatedQuery} from "../../hooks/usePaginatedQuery.ts";
import {useSearchParams} from "react-router-dom";
import {fetchAllNeighborNodes, getRicgraphNodeInfo} from "../../api/endpoints/advanced.ts";
import {fetchPersonOrganizationsCollabs} from "../../api/endpoints/person.ts";

// Used when the backend does not tell which categories are organizations.
const DEFAULT_ORGANIZATION_CATEGORIES = ["organization"];

interface PersonOrganizationsComponentProps {
    header?: string;
    person: Entry;
    onClickValue?: (entry: Entry) => void;
    // Also show the organizations this person collaborates with.
    // These can only come from /person/collaborating_organizations.
    showCollaboratingOrganizations?: boolean;
}

// The organizations this person collaborates with are derived (via shared research results),
// so there is no way to get them from the neighbor nodes of the person.
// /person/collaborating_organizations has no cursor: it returns two lists, and the only
// thing it accepts is max_nr_items (the maximum number of items to return).
// To still load page by page, the cursor is the number of rows we already have ("offset"):
//   - Ask for offset + pageSize + 1 items, so we can tell whether there is a next page.
//   - Keep only the rows from offset to offset + pageSize.
//   - If the list had more than that, the cursor for the next page is the new offset.
function useCollaboratingOrganizations(personKey: string | undefined,
                                       pageSize: number,
                                       enabled: boolean) {
    return usePaginatedQuery<Entry>(
        ["person-collaborating-organizations", personKey, pageSize],
        async (cursor) => {
            const offset = cursor ? parseInt(cursor, 10) : 0;
            const response = await fetchPersonOrganizationsCollabs({
                key: personKey ?? "",
                max_nr_items: String(offset + pageSize + 1),
            });
            const rows: Entry[] = response?.results[0]?.person_collaborates_with ?? [];
            const nextOffset = offset + pageSize;
            return {
                data: rows.slice(offset, nextOffset),
                nextCursor: rows.length > nextOffset ? String(nextOffset) : undefined,
            };
        },
        {enabled: enabled && Boolean(personKey)}
    );
}

function PersonOrganizationsComponent({
                                          header,
                                          person,
                                          onClickValue,
                                          showCollaboratingOrganizations = false,
                                      }: PersonOrganizationsComponentProps) {
    const [searchParams] = useSearchParams();
    const discovererMode = getDiscovererMode(searchParams);
    const columns = useSearchResultColumns(discovererMode);

    const personKey = person._key;
    const pageSize = getTableRowsPerPage({max_nr_table_rows: searchParams.get("max_nr_table_rows")});

    const nodeInfo = getRicgraphNodeInfo().data;
    const organizationCategories = nodeInfo?.organization_category_all ?? DEFAULT_ORGANIZATION_CATEGORIES;

    // The organizations related to this person: the neighbor nodes of the person
    // that are organizations. Cursor-paginated, like the identities and research results.
    const worksAt = usePaginatedQuery<Entry>(
        ["entry-neighbors", personKey, organizationCategories.join("|"), pageSize],
        async (cursor) => {
            const response = await fetchAllNeighborNodes({
                key: personKey ?? "",
                category_want: organizationCategories,
                cursor,
                page_size: String(pageSize)
            });
            const results: Entry[] = response?.results ?? [];
            return {data: results, nextCursor: resolveNextCursor(response?.meta.next_cursor)};
        },
        {enabled: Boolean(personKey)}
    );

    const collaboratesWith = useCollaboratingOrganizations(personKey, pageSize, showCollaboratingOrganizations);

    function handleClickValue(entry: Record<string, any>) {
        if (onClickValue) onClickValue(entry as Entry);
    }

    const isPending = worksAt.isPending || (showCollaboratingOrganizations && collaboratesWith.isPending);

    return (
        <RicgraphResultCard header={header} loading={isPending} bodyClassName={"p-4"}>
            {worksAt.data.length > 0 && (
                <Card>
                    <Card.Body>
                        <PaginatedResultsTable
                            header={"These are organizations related to this person:"}
                            columns={columns}
                            data={worksAt.data}
                            onClickValue={handleClickValue}
                            pageSize={pageSize}
                            hasMore={worksAt.hasMore}
                            isComplete={worksAt.isComplete}
                            isFetchingNextPage={worksAt.isFetchingNextPage}
                            loadNextPage={worksAt.loadNextPage}
                            loadAll={worksAt.loadAll}
                        />
                    </Card.Body>
                </Card>
            )}

            {showCollaboratingOrganizations && (
                <>
                    <hr style={{borderWidth: "3px"}}/>

                    {collaboratesWith.data.length > 0 && (
                        <Card>
                            <Card.Body>
                                <PaginatedResultsTable
                                    header={"These are organizations that this person collaborates with:"}
                                    columns={columns}
                                    data={collaboratesWith.data}
                                    onClickValue={handleClickValue}
                                    pageSize={pageSize}
                                    hasMore={collaboratesWith.hasMore}
                                    isComplete={collaboratesWith.isComplete}
                                    isFetchingNextPage={collaboratesWith.isFetchingNextPage}
                                    loadNextPage={collaboratesWith.loadNextPage}
                                    loadAll={collaboratesWith.loadAll}
                                />
                            </Card.Body>
                        </Card>
                    )}

                    <hr style={{borderWidth: "3px"}}/>
                </>
            )}
        </RicgraphResultCard>
    );
}

export default PersonOrganizationsComponent;
