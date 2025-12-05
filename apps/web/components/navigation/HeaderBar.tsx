"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Container, Nav, Navbar, NavbarBrand, Offcanvas, Stack} from "react-bootstrap";
import {FaSearch} from "react-icons/fa";
import {NAV_ITEMS} from "./config";

export default function HeaderBar() {
    const pathname = usePathname();

    return (
        <Navbar expand={false} className="bg-white border-bottom" style={{boxShadow: "var(--shadow-md)"}}>
            <Container fluid className="px-4">
                <div className="d-flex align-items-center gap-3">
                    <Navbar.Toggle aria-controls="mobile-navbar-nav" className="d-md-none border-0 p-0 me-2"/>
                    <NavbarBrand className="d-flex align-items-center gap-2 me-0">
                        <span className="fw-bold">LeaseQA</span>
                        <span className="d-none d-lg-inline text-muted-light" style={{fontSize: "0.9rem"}}>
                        · where statutes can't reach
                    </span>
                    </NavbarBrand>
                </div>

                <Navbar.Offcanvas
                    id="mobile-navbar-nav"
                    aria-labelledby="mobile-navbar-label"
                    placement="start"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="mobile-navbar-label" className="fw-bold">
                            LeaseQA
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="flex-column gap-2">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <Link key={item.href} href={item.href} className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-2 ${isActive ? "bg-light text-primary fw-semibold" : "text-secondary"}`}>
                                        <item.icon size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>

                <Stack direction="horizontal" gap={3}>
                    <div className="search-box d-none d-md-flex">
                        <FaSearch className="text-muted-light" size={14}/>
                        <span className="text-muted-light" style={{fontSize: "0.875rem"}}>Search...</span>
                    </div>

                    <Link href="/account">
                        <div className="icon-circle icon-circle-md icon-bg-purple hover-scale"
                             style={{cursor: "pointer"}}>
                            <span className="fw-semibold" style={{fontSize: "0.875rem"}}>CA</span>
                        </div>
                    </Link>
                </Stack>
            </Container>
        </Navbar>
    );
}