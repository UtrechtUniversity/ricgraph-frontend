import {Card} from "react-bootstrap";
import type {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

function TitleCard({children}: Props) {
    return (
        <Card className={"mb-3"}>
            <Card.Body>
                <h3>{children}</h3>
            </Card.Body>
        </Card>
    );
}

export default TitleCard;