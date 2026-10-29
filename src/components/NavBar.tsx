import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {Link, NavLink, useSearchParams} from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const [searchParams, setSearchParams] = useSearchParams();

    const navItems = [
        {label: "Home", to: "/", isExternal: false, newTab: false},
        {label: "Broad search", to: "/search-broad", isExternal: false, newTab: false},
        {label: "Advanced search", to: "/search-advanced", isExternal: false, newTab: false},
    ];

    return (
        <Navbar expand={"lg"} className={"uu-yellow mb-3"}>
            <Container fluid>
                {/* Go back */}
                <Button variant={"link"} onClick={() => globalThis.history.back()} className={"go-back-btn"}>
                    Go back
                </Button>

                {/* Logos */}
                <Navbar.Brand as={Link} to={'/'} className={"d-flex align-items-center"}>
                    <img src={'/images/uu_logo_small.png'}
                         alt={"Utrecht University logo"}
                         height={"30"}
                         className={"me-4"}/>
                    <img src={'/images/ricgraph_logo.png'}
                         alt={"Ricgraph logo"}
                         height={"30"}
                         className={"me-2"}/>
                    Explorer frontend PoC
                </Navbar.Brand>

                <Navbar.Toggle aria-controls={"ricgraph-navbar"}/>

                <Navbar.Collapse id={"ricgraph-navbar"}>
                    <Nav className={"ms-1 align-items-center"}>

                        {navItems.map(item => (
                            item.isExternal ? (
                                <Nav.Link key={item.label} href={item.to} target={item.newTab ? "_blank" : ""}
                                          className={"nav-btn"}>{item.label}</Nav.Link>
                            ) : (
                                <Nav.Link key={item.label} as={NavLink} to={item.to}
                                          className={"nav-btn"}>{item.label}</Nav.Link>
                            )
                        ))}

                        {searchParams.get("discoverer_mode") && (
                            // Remove 'd-none' if you want a button that toggles the discover_mode.
                            <Nav.Link key={"toggle_discoverer_mode"} className={"nav-btn d-none"}
                                      onClick={() => {
                                          const newMode = searchParams.get("discoverer_mode") === "details_view" ? "person_view" : "details_view";
                                          const newParams = new URLSearchParams(searchParams);
                                          newParams.set("discoverer_mode", newMode);
                                          setSearchParams(newParams, {replace: true});
                                      }}
                            >Toggle discoverer mode</Nav.Link>
                        )}
                        {/*
                        */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;