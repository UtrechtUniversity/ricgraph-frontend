import {Alert, Button} from "react-bootstrap";

interface ResultsStatusBarProps {
    // From usePaginatedQuery: whether every page has been fetched
    isComplete: boolean;
    // How many rows are loaded right now
    loadedCount: number;
    // A page fetch is being processed
    isLoadingMore: boolean;
    // Fetch every remaining page
    onLoadAll: () => void;
}

// Sits above a paginated result set (tables + histograms) and says
// whether what is shown is the complete set yet.
// While incomplete, tab counts and histograms keep changing as more
// pages load, so this doubles as the warning for that.
function ResultsStatusBar({isComplete, loadedCount, isLoadingMore, onLoadAll}: ResultsStatusBarProps) {
    if (isComplete) {
        return (
            <Alert variant={"success"} className={`py-2 mb-3`}>
                <strong>Complete.</strong> {loadedCount} result{loadedCount === 1 ? "" : "s"} loaded.
            </Alert>
        );
    }

    return (
        <Alert
            variant={"warning"}
            className={`py-2 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2`}
        >
            <span>
                <strong>Incomplete.</strong> {loadedCount} loaded so far &ndash; categories and amounts may still change.
            </span>
            <Button
                size={"sm"}
                variant={"dark"}
                className={"uu-yellow flex-shrink-0"}
                onClick={onLoadAll}
                disabled={isLoadingMore}
            >
                {isLoadingMore ? "Loading..." : "Load all results"}
            </Button>
        </Alert>
    );
}

export default ResultsStatusBar;
