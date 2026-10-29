import {useNavigate, useSearchParams} from "react-router-dom";
import {getEntryTargetPage} from "../utils/navigation.ts";
import type {UrlEntry} from "../api/general.ts";

// Navigates to the options/results page for a clicked Entry, carrying over the current search params.
export function useEntryNavigate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    return (entry: UrlEntry) => navigate(getEntryTargetPage(entry, searchParams));
}
