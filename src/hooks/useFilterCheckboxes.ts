import {useState} from "react";

// When the user hasn't checked anything themselves (URL has no selection) we want to default to every box checked
// We can't just seed useState with activeValues, because useState only reads its argument once,
// on a cold load that's before nodeInfo arrives with the information on the checkboxes, so it would be [] and the boxes would stay unchecked.
//
// So we leave the state undefined until the user actually clicks a box.
// While it's undefined we show activeValues (recomputed every render, so it fills in once nodeInfo loads).
// After the first click, 'selected' holds the user's choice and we show that instead.
export function useFilterCheckboxes(appliedValues: string[], activeValues: string[]) {
    const hasApplied = appliedValues.length > 0;
    const [selected, setSelected] = useState<string[] | undefined>(hasApplied ? appliedValues : undefined);
    const value = selected ?? (hasApplied ? appliedValues : activeValues);
    return [value, setSelected] as const;
}
