import { Outlet, useNavigate, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function UserLayout() {
const navigate = useNavigate();
const user = getUser();

const handleLogout = () => {
    logout();
    navigate("/login");
};

return (
    <>
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container>
        <Navbar.Brand>🏋️‍♂️ SportClub Alumno</Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar" />
        <Navbar.Collapse id="user-navbar">
            <Nav className="me-auto">
            <Nav.Link as={Link} to="/user/dashboard">Mi Panel</Nav.Link>
            </Nav>
            <Nav className="align-items-center">
            <span className="text-white me-3 small">
                Hola, {user?.name || user?.email?.split("@")[0]}
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

export default UserLayout;