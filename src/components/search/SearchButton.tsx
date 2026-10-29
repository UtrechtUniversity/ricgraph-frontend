import {Button} from "react-bootstrap";
import type {ButtonVariant} from "react-bootstrap/esm/types";

interface SearchButtonProps {
    variant?: ButtonVariant;
    type?: "submit" | "reset" | "button";
    className?: string;
}

function SearchButton({variant = "dark", type = "submit", className = "mt-3 uu-yellow"}: SearchButtonProps) {
    return (
        <Button variant={variant} type={type} className={className}>search</Button>
    );
}

export default SearchButton;