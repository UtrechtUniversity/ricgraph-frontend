import loadingSpinner from "../assets/loading_spinner.gif";
import {Card} from "react-bootstrap";

function LoadingSpinner() {
    return (
        <Card className={"mt-3 mb-3"}>
            <Card.Body>
                <span style={{display: "inline-flex", alignItems: "center"}}>
                    <span>Please wait while the requested data is being fetched...</span>
                    <img src={loadingSpinner} alt={"Loading spinner"} style={{width: "32px", height: "32px"}}/>
                </span>
            </Card.Body>
        </Card>
    );
}

export default LoadingSpinner;

