import {Card, Form} from "react-bootstrap";
import {DEFAULT_MAX_NR_TABLE_ROWS_STRING} from "../../utils/constants.ts";
import {MAX_PAGE_SIZE} from "../../api/general.ts";

interface SearchLimitsFieldsProps {
    defaultValue?: string;
}

function SearchLimitsFields({defaultValue = DEFAULT_MAX_NR_TABLE_ROWS_STRING}: SearchLimitsFieldsProps) {
    return (
        <Card>
            <Card.Body>
                <Form.Group controlId={"formMaxRows"}>
                    <Form.Label>
                        The amount of rows per page in result tables (1 &ndash; {MAX_PAGE_SIZE}).
                        A higher value shows more at once but can take longer to load.
                        Enter 0 for the largest page the server allows.
                    </Form.Label>
                    <Form.Control name={"max_nr_table_rows"} type={"number"}
                                  min={"0"} max={MAX_PAGE_SIZE} step={"1"}
                                  defaultValue={defaultValue}/>
                </Form.Group>
            </Card.Body>
        </Card>
    );
}

export default SearchLimitsFields;
