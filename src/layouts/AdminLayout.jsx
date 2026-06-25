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
      <Navbar bg="danger" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/admin/dashboard" className="d-flex align-items-center">
  <img
    src="/logo_empresa_letra_v1.png"
    alt="Logo SportClub"
    height="45" 
    className="d-inline-block align-top"
  />
</Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="me-auto">
              <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
              <Link className="nav-link" to="/admin/users">Usuarios</Link> 
              <Link className="nav-link" to="/admin/sports">Deportes</Link>
            </Nav>
            <Nav className="align-items-center">
              <span className="text-white me-3 small">
                Admin: {user?.full_name || user?.email?.split("@")[0]}
              </span>
              <Link className="nav-link text-white me-3 fw-semibold" to="/admin/perfil">Mi Perfil</Link>
              <Button variant="light" size="sm" onClick={handleLogout} className="text-danger fw-bold">
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