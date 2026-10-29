import {Card} from "react-bootstrap";
import type {ReactNode} from "react";
import LoadingSpinner from "../LoadingSpinner.tsx";

interface RicgraphResultCardProps {
    header?: string;
    loading: boolean;
    className?: string;
    bodyClassName?: string;
    children: ReactNode;
}

function RicgraphResultCard({header, loading, className, bodyClassName, children}: RicgraphResultCardProps) {
    return (
        <Card className={className}>
            {header && (
                <Card.Header className={"uu-yellow"}>
                    {header}
                </Card.Header>
            )}
            <Card.Body className={bodyClassName}>
                {
                    loading ? <LoadingSpinner/>
                        : children
                }
            </Card.Body>
        </Card>
    );
}

export default RicgraphResultCard;
