import {useMemo} from "react";
import Histogram, {type HistogramItem} from "../Histogram.tsx";
import type {Entry} from "../../api/general.ts";

interface Props {
    topic: keyof Entry;
    data: Entry[];
}

function RicgraphHistogram({topic, data}: Props) {
    // Count occurrences per value, sorted most-common first, so Histogram can just render bars.
    const items = useMemo<HistogramItem[]>(() => {
        const counts = new Map<string, number>();

        for (const entry of data) {
            const value = String(entry[topic] ?? "Unknown");
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }

        return [...counts.entries()]
            .map(([name, value]) => ({name, value}))
            .sort((a, b) => b.value - a.value); // Sort by most common
    }, [data, topic]);

    // Biggest count, used to scale the bars.
    const max = useMemo(() => {
        return Math.max(...items.map(item => item.value), 1);
    }, [items]);

    return (
        <Histogram
            title={`Histogram on "${topic}"`}
            items={items}
            max={max}
        />
    );
}

export default RicgraphHistogram;