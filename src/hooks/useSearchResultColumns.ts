import {getRicgraphNodeInfo} from "../api/endpoints/advanced.ts";

// Get the table columns to show, depending on the discoverer mode, and filtering some that are internal only.
// '_history' is not delivered by the backend, so we filter it out.
export function useSearchResultColumns(discovererMode: string): string[] {
    let properties = getRicgraphNodeInfo().data?.ricgraph_node_all_properties ?? [];
    const filter = ["_key", "source_event", "history_event","_history"];
    if (discovererMode !== "details_view")
        filter.push("_history");
    return properties.filter(item => !filter.includes(item));
}
