import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService"; 

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a tu función que limpia el localStorage
    navigate("/login", { replace: true });
  };

  return (
    <Navbar expand="lg" className="shadow-sm bg-dark navbar-dark">
      <Container>
        {/* Logo SportClub */}
        <Navbar.Brand as={Link} to="/user/dashboard" className="d-flex align-items-center">
  <img
    src="/logo_empresa_letra_v1.png"
    alt="Logo SportClub"
    height="45" 
    className="d-inline-block align-top"
  />
</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            
            {/* Enlace Mi Perfil */}
            <Nav.Link as={Link} to="/profile" className="me-3 text-white fw-semibold">
              Mi Perfil
            </Nav.Link>
            
            {/* Botón Cerrar Sesión */}
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;