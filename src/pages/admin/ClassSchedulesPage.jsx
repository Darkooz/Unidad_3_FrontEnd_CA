import { useEffect, useState } from "react";
import { Container, Card, Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { getClassSchedules, deleteClassSchedule } from "../../services/classScheduleService";
import { getSportRooms } from "../../services/sportRoomService";
import { getSports } from "../../services/sportService";
import { getRooms } from "../../services/roomService";
import { getUsers } from "../../services/userService";
import ClassScheduleModal from "./ClassScheduleModal";

function ClassSchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleOpenModal = (item = null) => {
    setItemToEdit(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setItemToEdit(null);
    setShowModal(false);
  };

  // 2. SUPER FUNCIÓN PARA CARGAR Y CRUZAR TODOS LOS DATOS
  const loadSchedules = async () => {
    try {
      const [schedulesRes, sportRoomsRes, sportsRes, roomsRes, usersRes] = await Promise.all([
        getClassSchedules(),
        getSportRooms(),
        getSports(),
        getRooms(),
        getUsers()
      ]);

      const allSchedules = schedulesRes.data || schedulesRes || [];
      const allSportRooms = sportRoomsRes.data || sportRoomsRes || [];
      const allSports = sportsRes.data || sportsRes || [];
      const allRooms = roomsRes.data || roomsRes || [];
      const allUsers = usersRes.data || usersRes || [];

      // Mapeamos para inyectar los nombres reales
      const mappedSchedules = allSchedules.map(sch => {
        const sr = allSportRooms.find(r => r.id === sch.sport_room_id);
        const sport = allSports.find(s => s.id === sr?.sport_id);
        const room = allRooms.find(r => r.id === sr?.room_id);
        const coach = allUsers.find(u => u.id === sr?.coach_id);

        return {
          ...sch,
          sportName: sport?.name || "Deporte no asignado",
          roomName: room?.name || "Sala no asignada",
          coachName: coach ? `${coach.first_name || ""} ${coach.last_name || ""}`.trim() || coach.full_name || "Sin nombre" : "Coach no asignado"
        };
      });
      setSchedules(mappedSchedules);
    }    catch (error) {
      console.error("Error al cargar horarios:", error);
      Swal.fire("Error", "No se pudieron cargar los horarios", "error");
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar este bloque horario?",
      text: "La clase se quitará de la oferta del club.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteClassSchedule(id);
          Swal.fire("Eliminado", "Horario borrado correctamente.", "success");
          loadSchedules();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el horario.", "error");
        }
      }
    });
  };

  // 3. CORREGIDA PARA QUE RECIBA NÚMEROS (1, 2, 3...) EN VEZ DE TEXTO EN INGLÉS
  const translateDay = (day) => {
    const days = {
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado",
      7: "Domingo"
    };
    return days[day] || day;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-dark">Horarios de Clases</h4>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={loadSchedules}>🔄 Refrescar</Button>
            <Button variant="warning" className="fw-bold" onClick={() => handleOpenModal()}>+ Nuevo Horario</Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Día</th>
                <th>Bloque Horario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((item) => (
                  <tr key={item.id}>
                    {/* 4. ACTUALIZAMOS LOS NOMBRES DE LAS COLUMNAS A LAS VARIABLES MAPEADAS */}
                    <td className="fw-semibold text-capitalize">{item.sportName}</td>
                    <td>{item.roomName}</td>
                    <td>{item.coachName}</td>
                    <td>{translateDay(item.day_of_week)}</td>
                    <td className="fw-bold text-primary">{item.start_time} - {item.end_time}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(item)}>✏️</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>🗑️</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-muted">No hay bloques horarios registrados.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ClassScheduleModal show={showModal} handleClose={handleCloseModal} refreshData={loadSchedules} itemToEdit={itemToEdit} />
    </Container>
  );
}

export default ClassSchedulesPage;