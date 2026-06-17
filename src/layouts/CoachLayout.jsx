import { Outlet, useNavigate, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function CoachLayout() {
const navigate = useNavigate();
const user = getUser();

const handleLogout = () => {
    logout();
    navigate("/login");
};

return (
    <>
    <Navbar bg="success" variant="dark" expand="lg" className="shadow-sm">
        <Container>
        <Navbar.Brand>💪 SportClub Coach</Navbar.Brand>
        <Navbar.Toggle aria-controls="coach-navbar" />
        <Navbar.Collapse id="coach-navbar">
            <Nav className="me-auto">
            <Nav.Link as={Link} to="/coach/dashboard">Gestión Alumnos</Nav.Link>
            </Nav>
            <Nav className="align-items-center">
            <span className="text-white me-3 small">
                Coach: {user?.name || user?.email?.split("@")[0]}
            </span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Cerrar Sesión
            </Button>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
    <Container className="mt-4">
        <Outlet />
    </Container>
    </>
);
}

export default CoachLayout;