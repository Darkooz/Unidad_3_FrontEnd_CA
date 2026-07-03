import { useEffect, useState } from "react";
import { Container, Card, Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getRooms, deleteRoom, updateRoom } from "../../services/roomService";
import RoomModal from "./RoomModal";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);

  const handleOpenModal = (room = null) => {
    setRoomToEdit(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setRoomToEdit(null);
    setShowModal(false);
  };

  const loadRooms = async () => {
    try {
      const response = await getRooms();
      if (response && response.data) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error("Error al cargar salas:", error);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleToggle = async (room) => {
    try {
      // Para cambiar el estado, enviamos toda la data de la sala pero con el status invertido
      const dataToSend = { ...room, status: !room.status };
      const response = await updateRoom(room.id, dataToSend);
      if (response && response.ok !== false) {
        setRooms(rooms.map(r => r.id === room.id ? { ...r, status: !room.status } : r));
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar sala?",
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
          const response = await deleteRoom(id);
          if (response && response.ok !== false) {
            Swal.fire("Eliminada", "La sala ha sido eliminada.", "success");
            setRooms(rooms.filter(r => r.id !== id));
          } else {
            Swal.fire("Error", "No se pudo eliminar la sala.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Hubo un problema de conexión.", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-dark">Gestión de Salas</h4>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={loadRooms}>🔄 Refrescar</Button>
            <Button variant="danger" onClick={() => handleOpenModal()}>+ Crear Sala</Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="fw-semibold">{room.name}</td>
                    <td>{room.capacity} pers.</td>
                    <td>{room.location}</td>
                    <td>
                      <Form.Check 
                        type="switch"
                        id={`switch-${room.id}`}
                        checked={room.status}
                        onChange={() => handleToggle(room)}
                        label={room.status ? "Activa" : "Inactiva"}
                        className="d-inline-block"
                      />
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(room)}>✏️</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(room.id)}>🗑️</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-muted">No hay salas registradas.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <RoomModal show={showModal} handleClose={handleCloseModal} refreshRooms={loadRooms} roomToEdit={roomToEdit} />
    </Container>
  );
}

export default RoomsPage;