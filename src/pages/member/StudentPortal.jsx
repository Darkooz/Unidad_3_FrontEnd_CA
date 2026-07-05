import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getClassSchedules } from "../../services/classScheduleService";
import { getSportRooms } from "../../services/sportRoomService";
import { getSports } from "../../services/sportService";
import { getRooms } from "../../services/roomService";
import { getUsers } from "../../services/userService";
import { createReservation, getMyReservations, cancelReservation } from "../../services/reservationService";
import logoSportClub from "../../assets/logo_empresa_letra_v1.png"; 

function StudentPortal() {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [key, setKey] = useState("clases");
  
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const userName = currentUser.full_name || currentUser.first_name || "Alumno";

  const loadPortalData = async () => {
    try {
      const [schedulesRes, sportRoomsRes, sportsRes, roomsRes, usersRes, myResRes] = await Promise.all([
        getClassSchedules(),
        getSportRooms(),
        getSports(),
        getRooms(),
        getUsers(),
        getMyReservations()
      ]);

      const allSchedules = schedulesRes.data || schedulesRes || [];
      const allSportRooms = sportRoomsRes.data || sportRoomsRes || [];
      const allSports = sportsRes.data || sportsRes || [];
      const allRooms = roomsRes.data || roomsRes || [];
      const allUsers = usersRes.data || usersRes || [];
      
      // FILTRO APLICADO: Solo guardamos las reservas que NO estén canceladas
      const rawReservations = myResRes.data || myResRes || [];
      const activeReservations = rawReservations.filter(
        res => res.status !== "cancelled" && res.status !== "cancelada"
      );
      setMyReservations(activeReservations);

      const mappedSchedules = allSchedules.map(sch => {
        const sr = allSportRooms.find(r => r.id === sch.sport_room_id);
        const sport = allSports.find(s => s.id === sr?.sport_id);
        const room = allRooms.find(r => r.id === sr?.room_id);
        const coach = allUsers.find(u => u.id === sr?.coach_id);

        return {
          ...sch,
          sportName: sport?.name || "Deporte",
          roomName: room?.name || "Sala",
          coachName: coach ? `${coach.first_name || ""} ${coach.last_name || ""}`.trim() || coach.full_name : "Coach"
        };
      });

      setAvailableClasses(mappedSchedules);
    } catch (error) {
      console.error("Error al cargar datos del portal:", error);
      Swal.fire("Error", "No se pudo sincronizar la información", "error");
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleBooking = async (scheduleId) => {
    const alreadyBooked = myReservations.some(res => res.class_schedule_id === scheduleId);
    if (alreadyBooked) {
      return Swal.fire("Aviso", "Ya estás inscrito en esta clase", "info");
    }

    try {
      await createReservation(scheduleId);
      Swal.fire("¡Inscrito!", "Tu cupo ha sido reservado con éxito.", "success");
      loadPortalData();
    } catch (error) {
      Swal.fire("Error", "No se pudo completar la reserva.", "error");
    }
  };

  const handleCancel = async (reservationId) => {
    if (!reservationId) {
      return Swal.fire("Error", "No se encontró el ID de la reserva", "error");
    }

    Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Liberarás tu cupo para otro miembro.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd", 
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Mantener"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelReservation(reservationId);
          Swal.fire("Cancelada", "Tu reserva fue anulada.", "success");
          loadPortalData();
        } catch (error) {
          console.error("Detalle del error al cancelar:", error);
          Swal.fire("Error", "El servidor rechazó la cancelación.", "error");
        }
      }
    });
  };

  const translateDay = (day) => {
    const days = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" };
    return days[day] || day;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); 
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="text-white d-flex justify-content-between align-items-center px-4 py-3 mb-4 shadow" style={{ backgroundColor: "#0d6efd" }}>
        <div className="d-flex align-items-center">
          <img 
            src={logoSportClub} 
            alt="SportClub Logo" 
            style={{ height: "45px", marginRight: "15px", objectFit: "contain" }}
            onError={(e) => { e.target.src = "https://via.placeholder.com/150x50?text=SPORTCLUB"; }} 
          />
          <h4 className="mb-0 fw-bold tracking-wide">Portal del Alumno</h4>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-3 fw-semibold">👤 Hola, {userName}</span>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <Container>
        <Tabs id="portal-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-4 custom-tabs">
          <Tab eventKey="clases" title="🏋️ Clases Disponibles">
            <Row>
              {availableClasses.length > 0 ? (
                availableClasses.map((item) => (
                  <Col md={4} key={item.id} className="mb-4">
                    <Card className="shadow border-0 h-100 overflow-hidden card-hover">
                      <div style={{ height: "6px", backgroundColor: "#ffc107" }}></div>
                      <Card.Body className="d-flex flex-column justify-content-between p-4 bg-white">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="fw-bold text-dark text-capitalize mb-0">{item.sportName}</h5>
                            <Badge bg="dark" className="text-warning px-2 py-1.5">{translateDay(item.day_of_week)}</Badge>
                          </div>
                          <p className="text-muted mb-2">📍 <strong>Sala:</strong> <span className="text-dark">{item.roomName}</span></p>
                          <p className="text-muted mb-3">🗣️ <strong>Coach:</strong> <span className="text-dark">{item.coachName}</span></p>
                          <div className="p-2 bg-light rounded text-center mb-4 border border-light">
                            <h6 className="text-primary fw-bold mb-0">⏰ {item.start_time} - {item.end_time}</h6>
                          </div>
                        </div>
                        <Button variant="warning" className="fw-bold w-100 py-2 shadow-sm text-dark" onClick={() => handleBooking(item.id)}>
                          Inscribirse a Clase
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center py-5">
                  <p className="text-muted bg-white p-4 rounded shadow-sm border">No hay horarios disponibles en este momento.</p>
                </Col>
              )}
            </Row>
          </Tab>

          <Tab eventKey="mis-reservas" title="📅 Mis Reservas Agendadas">
            <Row>
              {myReservations.length > 0 ? (
                myReservations.map((res) => {
                  const classInfo = availableClasses.find(c => c.id === res.class_schedule_id);
                  return (
                    <Col md={4} key={res.id} className="mb-4">
                      <Card className="shadow border-0 h-100 overflow-hidden">
                        <div style={{ height: "6px", backgroundColor: "#0d6efd" }}></div>
                        <Card.Body className="d-flex flex-column justify-content-between p-4 bg-white">
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="fw-bold text-primary text-capitalize mb-0">{classInfo?.sportName || "Clase Agendada"}</h5>
                              <Badge bg="primary">{translateDay(classInfo?.day_of_week)}</Badge>
                            </div>
                            <p className="mb-2 text-muted">⏰ <strong>Horario:</strong> <span className="text-dark">{classInfo?.start_time} - {classInfo?.end_time}</span></p>
                            <p className="mb-4 text-muted">📍 <strong>Sala:</strong> <span className="text-dark">{classInfo?.roomName}</span></p>
                          </div>
                          <Button variant="outline-danger" className="w-100 fw-semibold" onClick={() => handleCancel(res.id)}>
                            ✕ Cancelar Reserva
                      </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <Col className="text-center py-5">
                  <p className="text-muted bg-white p-4 rounded shadow-sm border">Aún no te has inscrito en ninguna clase activa.</p>
                </Col>
              )}
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default StudentPortal;