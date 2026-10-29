import {useEffect, useMemo, useRef} from "react";
import type {Entry} from "../../api/general.ts";
import Filter, {type FilterOption} from "../Filter.tsx";

interface Props {
    topic: keyof Entry;
    data: Entry[];
    selectedValues: string[];
    onChange: (selectedValues: string[]) => void;
}

function RicgraphFilter({topic, data, selectedValues, onChange}: Props) {
    const options = useMemo<FilterOption[]>(() => {
        const counts = new Map<string, number>();

        for (const entry of data) {
            const value = String(entry[topic] ?? "Unknown");
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }

        const options = Array.from(counts, ([value, count]) => ({
            label: value,
            value,
            count,
        }));

        options.sort((a, b) => a.label.localeCompare(b.label));

        return options;
    }, [data, topic]);

    // Start with everything selected (nothing filtered out) the first time the option
    // list gets populated, instead of an empty selection that would hide all the data.
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (options.length === 0 || hasInitialized.current) return;

        hasInitialized.current = true;
        onChange(options.map(option => option.value));
    }, [options, onChange]);

    return (
        <Filter
            title={`Filter on ${String(topic)}`}
            options={options}
            selectedValues={selectedValues}
            onChange={onChange}
        />
    );
}

export default RicgraphFilter;