import {Card, Form} from "react-bootstrap";
import React, {useRef} from "react";
import {isFirefox} from "../utils/format.ts";
import {FORM_YEAR_FIRST_INPUT, FORM_YEAR_LAST_INPUT, YEAR_DATALIST_ID} from "../utils/constants.ts";

interface Props {
    yearFirstDefault: string;
    yearLastDefault: string;
    yearOptions: string[];
    yearMin: number;
    yearMax: number;
    // When given, applies instantly on Enter or blur (clicking outside of the component)
    onChange?: (yearFirst: string, yearLast: string) => void;
}

function YearFilterCard({yearFirstDefault, yearLastDefault, yearOptions, yearMin, yearMax, onChange}: Props) {
    const fromRef = useRef<HTMLInputElement>(null);
    const toRef = useRef<HTMLInputElement>(null);

    // Clamps a year field to the range of years present in the data or the
    // fallback range once the user leaves the field, rather than restricting keystrokes.
    function clampYearField(event: React.FocusEvent<HTMLInputElement>) {
        const value = event.target.value.trim();
        if (!value) {
            onChange?.(fromRef.current?.value ?? "", toRef.current?.value ?? "");
            return;
        }

        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            event.target.value = "";
            onChange?.(fromRef.current?.value ?? "", toRef.current?.value ?? "");
            return;
        }

        event.target.value = String(Math.min(yearMax, Math.max(yearMin, Math.round(parsed))));
        onChange?.(fromRef.current?.value ?? "", toRef.current?.value ?? "");
    }

    // Enter has nothing to submit to when there's no enclosing <form> (onApply mode), so
    // blur the field instead which runs clampYearField above, which applies the value.
    function applyOnEnter(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") event.currentTarget.blur();
    }

    // Applies on every keystroke, not just on blur, as soon as what's typed is a complete year
    function applyIfCompleteYear(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.trim();
        if (value === "") {
            onChange?.(fromRef.current?.value ?? "", toRef.current?.value ?? "");
            return;
        }

        const parsed = Number(value);
        if (Number.isFinite(parsed) && parsed >= yearMin && parsed <= yearMax) {
            onChange?.(fromRef.current?.value ?? "", toRef.current?.value ?? "");
        }
    }

    return (
        <Card>
            <Card.Header className={"uu-yellow"}>
                <Form.Label>Filter on "year"</Form.Label>
            </Card.Header>
            <Card.Body>
                <Form.Label htmlFor={FORM_YEAR_FIRST_INPUT}>From:</Form.Label>
                <Form.Control ref={fromRef}
                              id={FORM_YEAR_FIRST_INPUT} name={FORM_YEAR_FIRST_INPUT}
                              type={"text"} inputMode={"numeric"} autoComplete={"off"}
                              list={YEAR_DATALIST_ID} placeholder={String(yearMin)}
                              defaultValue={yearFirstDefault}
                              onChange={applyIfCompleteYear}
                              onBlur={clampYearField}
                              onKeyDown={applyOnEnter}
                              className={"mb-2"}/>
                <Form.Label htmlFor={FORM_YEAR_LAST_INPUT}>To:</Form.Label>
                <Form.Control ref={toRef}
                              id={FORM_YEAR_LAST_INPUT} name={FORM_YEAR_LAST_INPUT}
                              type={"text"} inputMode={"numeric"} autoComplete={"off"}
                              list={YEAR_DATALIST_ID} placeholder={String(yearMax)}
                              defaultValue={yearLastDefault}
                              onChange={applyIfCompleteYear}
                              onBlur={clampYearField}
                              onKeyDown={applyOnEnter}/>
                <datalist id={YEAR_DATALIST_ID}>
                    {yearOptions.map(year => (
                        <option key={year} value={year}/>
                    ))}
                </datalist>
                {
                    isFirefox() && (
                        <Form.Text><i>Click twice to get a dropdown list.</i></Form.Text>
                    )
                }
            </Card.Body>
        </Card>
    );
}

export default YearFilterCard;
