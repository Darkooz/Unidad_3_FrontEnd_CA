// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";
import { Alert, Button, Container } from "react-bootstrap";

function Unauthorized() {
return (
    <Container className="mt-5">
        <Alert variant="danger" className="shadow">
        <Alert.Heading>⛔ Acceso no autorizado</Alert.Heading>
        <p>No tienes los permisos necesarios para entrar a esta sección del SportClub.</p>
        <hr />
        <Link to="/login">
            <Button variant="danger">Volver al Login</Button>
        </Link>
        </Alert>
    </Container>
);
}

export default Unauthorized;