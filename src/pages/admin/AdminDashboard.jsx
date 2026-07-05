import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUsers } from "../../services/userService";
import { getClassSchedules } from "../../services/classScheduleService";

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, schedules: 0 });
  const [loading, setLoading] = useState(true);

  // Obtenemos el nombre del administrador activo
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const adminName = currentUser.full_name || currentUser.first_name || "Administrador";

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // Traemos los datos reales del backend para contarlos
        const [usersRes, schedulesRes] = await Promise.all([
          getUsers(),
          getClassSchedules()
        ]);
        
        const usersArray = usersRes.data || usersRes || [];
        const schedulesArray = schedulesRes.data || schedulesRes || [];

        setStats({
          users: usersArray.length,
          schedules: schedulesArray.length
        });
      } catch (error) {
        console.error("Error al cargar las estadísticas del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="mt-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Panel de Control</h2>
        <p className="text-muted">Bienvenido, <strong>{adminName}</strong>. Aquí tienes un resumen del sistema.</p>
      </div>

      <Row className="mb-4">
        {/* TARJETA 1: TOTAL DE USUARIOS */}
        <Col md={6} className="mb-3">
          <Card className="shadow-sm border-0 h-100" style={{ borderLeft: "5px solid #cc1f29" }}>
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-2">Total Usuarios Registrados</h6>
                {loading ? (
                  <Spinner animation="border" variant="danger" size="sm" />
                ) : (
                  <h2 className="fw-bold text-dark mb-0">{stats.users}</h2>
                )}
              </div>
              <div className="bg-light p-3 rounded-circle text-danger fs-3">
                👥
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* TARJETA 2: CLASES ACTIVAS */}
        <Col md={6} className="mb-3">
          <Card className="shadow-sm border-0 h-100" style={{ borderLeft: "5px solid #ffc107" }}>
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-2">Horarios Programados</h6>
                {loading ? (
                  <Spinner animation="border" variant="warning" size="sm" />
                ) : (
                  <h2 className="fw-bold text-dark mb-0">{stats.schedules}</h2>
                )}
              </div>
              <div className="bg-light p-3 rounded-circle text-warning fs-3">
                📅
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* TARJETA DE ACCESOS RÁPIDOS */}
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">🚀 Accesos Rápidos</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={4} className="mb-3">
                  <Link to="/admin/users" className="text-decoration-none">
                    <Button variant="outline-danger" className="w-100 py-3 fw-semibold">
                      ⚙️ Gestionar Usuarios
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  <Link to="/admin/schedules" className="text-decoration-none">
                    <Button variant="outline-warning" className="w-100 py-3 fw-semibold text-dark border-warning">
                      ⏱️ Modificar Horarios
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="mb-3">
                  {/* Ajusta esta ruta a la de tus salas si ya la tienes */}
                  <Link to="/admin/rooms" className="text-decoration-none">
                    <Button variant="outline-secondary" className="w-100 py-3 fw-semibold">
                      📍 Administrar Salas
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;