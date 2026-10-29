import {DISCOVERER_MODE_PERSON} from "./constants.ts";

export function getParamOrEmpty(searchParams: URLSearchParams, param: string): string {
    return searchParams.get(param) ?? "";
}

export function getParamOrElse(searchParams: URLSearchParams, param: string, fallback: string): string {
    return searchParams.get(param) ?? fallback;
}

export function getDiscovererMode(searchParams: URLSearchParams): string {
    return searchParams.get("discoverer_mode") ?? DISCOVERER_MODE_PERSON;
}
