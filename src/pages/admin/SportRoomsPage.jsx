import { useEffect, useState } from "react";
import { Container, Card, Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getSportRooms, deleteSportRoom, updateSportRoom } from "../../services/sportRoomService";
import SportRoomModal from "./SportRoomModal";

function SportRoomsPage() {
  const [assignments, setAssignments] = useState([]);
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

  const loadAssignments = async () => {
    try {
      const response = await getSportRooms();
      if (response && response.data) {
        setAssignments(response.data);
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleToggle = async (item) => {
    try {
      const dataToSend = { ...item, status: !item.status };
      const response = await updateSportRoom(item.id, dataToSend);
      if (response && response.ok !== false) {
        setAssignments(assignments.map(a => a.id === item.id ? { ...a, status: !item.status } : a));
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar asignación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteSportRoom(id);
          if (response && response.ok !== false) {
            Swal.fire("Eliminada", "La asignación fue borrada.", "success");
            setAssignments(assignments.filter(a => a.id !== id));
          }
        } catch (error) {
          Swal.fire("Error", "Problema de conexión.", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-dark">Gestión de Asignaciones</h4>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={loadAssignments}>🔄 Refrescar</Button>
            <Button variant="danger" onClick={() => handleOpenModal()}>+ Nueva Asignación</Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((item) => (
                  <tr key={item.id}>
                    {/* Sequelize trae los datos anidados de la tabla original */}
                    <td className="fw-semibold">{item.sport?.name || `Deporte ID: ${item.sport_id}`}</td>
                    <td>{item.room?.name || `Sala ID: ${item.room_id}`}</td>
                    <td>{item.coach?.full_name || item.user?.full_name || `Coach ID: ${item.coach_id}`}</td>
                    <td>
                      <Form.Check 
                        type="switch"
                        id={`switch-${item.id}`}
                        checked={item.status}
                        onChange={() => handleToggle(item)}
                        label={item.status ? "Activa" : "Inactiva"}
                        className="d-inline-block"
                      />
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(item)}>✏️</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>🗑️</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-muted">No hay asignaciones registradas.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <SportRoomModal show={showModal} handleClose={handleCloseModal} refreshData={loadAssignments} itemToEdit={itemToEdit} />
    </Container>
  );
}

export default SportRoomsPage;