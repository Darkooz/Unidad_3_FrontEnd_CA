import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function AdminLayout() {
const navigate = useNavigate();
const user = getUser();

const handleLogout = () => {
    logout();
    navigate("/login");
};

return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
        <Navbar.Brand>⚙️ SportClub Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto">
            <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
            </Nav>
            <Nav className="align-items-center">
            <span className="text-white me-3 small">
                Admin: {user?.name || user?.email?.split("@")[0]}
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

export default AdminLayout;