import type {FilterOption} from "../components/Filter.tsx";

export function toFilterOptions(values: string[]): FilterOption[] {
    return values.map(value => ({
        label: value,
        value: value
    }));
}
