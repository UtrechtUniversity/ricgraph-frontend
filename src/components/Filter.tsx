import {useId} from "react";
import {Card, Form} from "react-bootstrap";

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

interface Props {
    title: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (selectedValues: string[]) => void;
}

function Filter({title, options, selectedValues, onChange}: Props) {
    // Give each Filter object a unique id, to fix an issue where multiple Filter components on the same page
    // would have checkboxes with the same id, causing label clicks to toggle the wrong checkbox.
    const groupId = useId();

    function toggleValue(value: string) {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(selected => selected !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    }

    return (
        <Card>
            <Card.Header className="uu-yellow">
                {title}
            </Card.Header>

            <Card.Body>
                {options.map(option => (
                    <Form.Check
                        key={option.value}
                        type="checkbox"
                        id={`${groupId}${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        onChange={() => toggleValue(option.value)}
                        label={
                            <>
                                {option.label}
                                {option.count !== undefined && (
                                    <span className="text-muted"> ({option.count})</span>
                                )}
                            </>
                        }
                    />
                ))}
            </Card.Body>
        </Card>
    );
}

export default Filter;