import {useEffect, useState} from "react";
import {Card, Container} from "react-bootstrap";
import {queryClient} from "../api/queryClient.ts";

// Only look at queries that are currently being observed by a mounted component.
// An errored query keeps its "error" status until it refetches or is garbage-collected,
// so counting inactive queries would keep the banner up long after the backend recovered
function anyQueryErrored(): boolean {
    return queryClient.getQueryCache().getAll().some(
        query => query.isActive() && query.state.status === "error",
    );
}

// Shown on every page whenever any active query has failed (backend is unreachable)
function BackendStatusBanner() {
    const [hasError, setHasError] = useState(anyQueryErrored);

    useEffect(() => {
        return queryClient.getQueryCache().subscribe(() => {
            setHasError(anyQueryErrored());
        });
    }, []);

    // While the banner is up, keep retrying, so the banner clears itself once the
    // backend is reachable again, without the user having to navigate or refocus.
    useEffect(() => {
        if (!hasError) return;
        const interval = setInterval(() => {
            void queryClient.refetchQueries({
                predicate: query => query.isActive() && query.state.status === "error",
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [hasError]);

    if (!hasError) return null;

    return (
        <Container fluid>
            <Card bg={"danger"} text={"white"} className={"mb-3"}>
                <Card.Body>
                    Could not reach the Ricgraph server. Information on this site may be missing or
                    incomplete until the connection is restored.
                </Card.Body>
            </Card>
        </Container>
    );
}

export default BackendStatusBanner;
