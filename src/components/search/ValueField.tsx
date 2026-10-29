import {Card, Form} from "react-bootstrap";

interface ValueFieldProps {
    defaultValue?: string;
}

function ValueField({defaultValue = ""}: ValueFieldProps) {
    return (
        <Card className={"mb-3"}>
            <Card.Body>
                <Form.Group controlId={"formSearchString"}>
                    <Form.Label>Type your search string:</Form.Label>
                    <Form.Control name={"value"} type={"text"} defaultValue={defaultValue}/>
                </Form.Group>
            </Card.Body>
        </Card>
    );
}

export default ValueField;
