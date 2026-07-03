import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createRoom, updateRoom } from "../../services/roomService";

function RoomModal({ show, handleClose, refreshRooms, roomToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    location: "",
    status: true
  });

  useEffect(() => {
    if (roomToEdit) {
      setFormData({
        name: roomToEdit.name,
        description: roomToEdit.description,
        capacity: roomToEdit.capacity,
        location: roomToEdit.location,
        status: roomToEdit.status
      });
    } else {
      setFormData({ name: "", description: "", capacity: "", location: "", status: true });
    }
  }, [roomToEdit, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación visual en el Frontend
    if (!formData.name.trim() || !formData.description.trim() || !formData.capacity || !formData.location.trim()) {
      Swal.fire("Advertencia", "Todos los campos principales son obligatorios", "warning");
      return;
    }

    // Convertimos la capacidad a número estricto
    const dataToSend = {
      ...formData,
      capacity: Number(formData.capacity)
    };

    try {
      let response;
      if (roomToEdit) {
        response = await updateRoom(roomToEdit.id, dataToSend);
      } else {
        response = await createRoom(dataToSend);
      }

      if (response && response.ok !== false && !response.errors) {
        Swal.fire("Éxito", "Sala guardada correctamente", "success");
        refreshRooms(); // Actualiza la tabla sin recargar la página
        handleClose();
      } else {
        const msgError = response?.errors ? Object.values(response.errors).join(", ") : (response?.message || "Error al guardar");
        Swal.fire("Error", msgError, "error");
      }
    } catch (error) {
      Swal.fire("Error de Conexión", "No se pudo comunicar con el backend", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{roomToEdit ? "Editar Sala" : "Crear Nueva Sala"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Sala</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Sala de Musculación" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} placeholder="Descripción del espacio" />
          </Form.Group>
          <div className="row">
            <Form.Group className="mb-3 col-6">
              <Form.Label>Capacidad (personas)</Form.Label>
              <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Ej: 20" min="1" />
            </Form.Group>
            <Form.Group className="mb-3 col-6">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Piso 1" />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Check type="switch" label={formData.status ? "Estado: Activa" : "Estado: Inactiva"} name="status" checked={formData.status} onChange={handleChange} />
          </Form.Group>
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" className="me-2" onClick={handleClose}>Cancelar</Button>
            <Button variant={roomToEdit ? "primary" : "success"} type="submit">{roomToEdit ? "Guardar Cambios" : "Crear Sala"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RoomModal;