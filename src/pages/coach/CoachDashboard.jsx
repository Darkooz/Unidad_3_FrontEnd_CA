import { Container, Card, Table, Badge, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getClassSchedules } from "../../services/classScheduleService";
import Swal from "sweetalert2";
import { getSports } from "../../services/sportService"; 
import { getRooms } from "../../services/roomService";
import { getSportRooms } from "../../services/sportRoomService";
function CoachDashboard() {
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

const loadMyClasses = async () => {
    try {
      const res = await getClassSchedules();
      const allSchedules = res.data || res || [];
      
      const userData = localStorage.getItem("user"); 
      const currentUser = userData ? JSON.parse(userData) : null;
      const myId = currentUser?.id;

      console.log("Mi ID actual:", myId);
      console.log("Todos los horarios recibidos:", allSchedules);

      // Inspección: Imprimamos los coach_id que vienen en las clases
      allSchedules.forEach((s, index) => {
        console.log(`Clase ${index}: coach_id detectado es`, s.sport_room?.coach_id);
      });
console.log("¿El ID 4 es igual al ID 3?", Number(4) === Number(3)); // Esto debería dar false
const filteredClasses = allSchedules.filter(
  (item) => String(item.sportRoom?.coach_id) === String(myId)
);
      setMyClasses(filteredClasses);
    } catch (error) {
      console.error("Error cargando clases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyClasses();
  }, []);

  const translateDay = (day) => {
    const days = {
      Monday: "Lunes", Tuesday: "Martes", Wednesday: "Miércoles",
      Thursday: "Jueves", Friday: "Viernes", Saturday: "Sábado", Sunday: "Domingo"
    };
    return days[day] || day;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-dark">Mi Panel de Entrenador</h2>
          <p className="text-muted">Revisa tus próximas clases y horarios asignados.</p>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-dark text-white py-3">
          <h5 className="mb-0 fw-semibold">Mis Clases Asignadas</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Cargando tus clases...</p>
            </div>
          ) : (
            <Table responsive striped hover className="mb-0 text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Deporte</th>
                  <th>Sala</th>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {myClasses.length > 0 ? (
                  myClasses.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-primary text-capitalize">
                        {item.sport_room?.sport?.name || "Deporte"}
                      </td>
                      <td>{item.sport_room?.room?.name || "Sala"}</td>
                      <td>{translateDay(item.day_of_week)}</td>
                      <td className="fw-semibold">
                        {item.start_time} - {item.end_time}
                      </td>
                      <td>
                        <Badge bg={item.sport_room?.status ? "success" : "secondary"}>
                          {item.sport_room?.status ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-muted">
                      No tienes clases asignadas por el momento. ¡Día libre!
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CoachDashboard;