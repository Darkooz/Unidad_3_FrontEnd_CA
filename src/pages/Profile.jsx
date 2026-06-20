import { Card, Container } from "react-bootstrap";
import { getUser } from "../services/authService";

function Profile() {
  const user = getUser();

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card className="shadow-sm border-0" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Header className="bg-white py-3 text-center">
          <h4 className="mb-0 fw-bold text-dark">Mi Perfil</h4>
        </Card.Header>
        <Card.Body className="p-4 text-center">
          <div className="mb-4">
            <div 
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow" 
              style={{ width: '80px', height: '80px', fontSize: '32px' }}
            >
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : '👤'}
            </div>
          </div>
          <h5 className="fw-bold mb-1">{user?.full_name || "Usuario del Sistema"}</h5>
          <p className="text-muted mb-3">{user?.email}</p>
          
          <div className="bg-light p-3 rounded-3 text-start">
            <p className="mb-1"><strong>ID de Cuenta:</strong> #{user?.id || "N/A"}</p>
            <p className="mb-0"><strong>Rol Asignado:</strong> <span className="badge bg-secondary text-capitalize">{user?.role || "user"}</span></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;