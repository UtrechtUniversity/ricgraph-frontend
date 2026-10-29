import {Card, Form} from "react-bootstrap";
import {getRicgraphSystemInfo} from "../../api/endpoints/advanced.ts";
import {DISCOVERER_MODE_DESCRIPTIONS} from "../../utils/constants.ts";

interface DiscovererModeFieldsProps {
    defaultValue?: string;
}

function DiscovererModeFields({defaultValue}: DiscovererModeFieldsProps) {
    const systemInfo = getRicgraphSystemInfo().data;

    const results: string[] = systemInfo?.discoverer_mode_all ?? [];
    const defaultMode: string | undefined = systemInfo?.discoverer_mode_default;

    return (
        <Card className={"mb-3"}>
            <Card.Body>
                <Form.Group controlId={"formResultViewOption"}>
                    <Form.Label>Please specify how you like to view your results:</Form.Label>
                    {results.map((result: string) => (
                        <Form.Check key={result} className={"mb-2"}>
                            <Form.Check.Input
                                defaultChecked={(defaultValue ?? defaultMode) === result}
                                name={"discoverer_mode"}
                                type={"radio"}
                                value={result}
                            />
                            <Form.Check.Label>{result}</Form.Check.Label>
                            {DISCOVERER_MODE_DESCRIPTIONS[result] && (
                                <Form.Text className={"d-block"}>
                                    {DISCOVERER_MODE_DESCRIPTIONS[result]}
                                </Form.Text>
                            )}
                        </Form.Check>
                    ))}
                </Form.Group>
            </Card.Body>
        </Card>
    );
}

export default DiscovererModeFields;
