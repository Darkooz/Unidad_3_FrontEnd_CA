import { Container, Card, Table, Badge, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getClassSchedules } from "../../services/classScheduleService";

function CoachDashboard() {
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyClasses = async () => {
    try {
      const res = await getClassSchedules();

      console.log("Respuesta API:", res);

      const allSchedules = Array.isArray(res.data) ? res.data : [];

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const myId = Number(currentUser.id);

      console.log("Mi ID:", myId);

      const filtered = allSchedules.filter((item) => {
        // Soporta sportRoom y sport_room
        const sportRoom = item.sportRoom || item.sport_room;

        console.log("Horario:", item);
        console.log("SportRoom:", sportRoom);
        console.log("Coach:", sportRoom?.coach);

        const coachId =
          sportRoom?.coach?.id ??
          sportRoom?.coach_id;

        console.log({
  miId: myId,
  coachId: coachId,
  coach: sportRoom?.coach,
  sportRoom
});

        return Number(coachId) === myId;
      });

      console.log("Clases encontradas:", filtered);

      setMyClasses(filtered);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyClasses();
  }, []);

  const translateDay = (day) => {
  const days = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",

    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };

  return days[day] || day;
};

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-dark">Mi Panel de Entrenador</h2>
          <p className="text-muted">
            Revisa tus próximas clases y horarios asignados.
          </p>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-dark text-white py-3">
          <h5 className="mb-0 fw-semibold">Mis Clases Asignadas</h5>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
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
                  myClasses.map((item) => {
                    const sportRoom = item.sportRoom || item.sport_room;

                    return (
                      <tr key={item.id}>
                        <td>{sportRoom?.sport?.name}</td>

                        <td>{sportRoom?.room?.name}</td>

                        <td>{translateDay(item.day_of_week)}</td>

                        <td>
                          {item.start_time} - {item.end_time}
                        </td>

                        <td>
                          <Badge bg={sportRoom?.status ? "success" : "secondary"}>
                            {sportRoom?.status ? "Activa" : "Inactiva"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5">
                      No tienes clases asignadas.
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