import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createClassSchedule, updateClassSchedule } from "../../services/classScheduleService";
import { getSportRooms } from "../../services/sportRoomService";

function ClassScheduleModal({ show, handleClose, refreshData, itemToEdit }) {
  const [formData, setFormData] = useState({
    sport_room_id: "",
    day_of_week: "Monday",
    start_time: "",
    end_time: ""
  });

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await getSportRooms();
        if (res.data) setAssignments(res.data);
      } catch (e) {
        console.error("Error al cargar asignaciones", e);
      }
    };
    if (show) loadAssignments();
  }, [show]);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        sport_room_id: itemToEdit.sport_room_id || "",
        day_of_week: itemToEdit.day_of_week || "Monday",
        start_time: itemToEdit.start_time || "",
        end_time: itemToEdit.end_time || ""
      });
    } else {
      setFormData({ sport_room_id: "", day_of_week: "Monday", start_time: "", end_time: "" });
    }
  }, [itemToEdit, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sport_room_id || !formData.start_time || !formData.end_time) {
      Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
      return;
    }

    const dataToSend = {
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: formData.day_of_week,
      start_time: formData.start_time,
      end_time: formData.end_time
    };

    try {
      if (itemToEdit) {
        await updateClassSchedule(itemToEdit.id, dataToSend);
      } else {
        await createClassSchedule(dataToSend);
      }
      Swal.fire("Éxito", "Horario guardado correctamente", "success");
      refreshData();
      handleClose();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el horario", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{itemToEdit ? "Editar Horario" : "Nuevo Horario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Asignación Activa</Form.Label>
            <Form.Select name="sport_room_id" value={formData.sport_room_id} onChange={handleChange} required>
              <option value="">Seleccione un bloque asignado...</option>
              {assignments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.sport?.name || `Deporte ${a.sport_id}`} - {a.room?.name || `Sala ${a.room_id}`} ({a.coach?.full_name || a.user?.full_name || 'Coach'})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Día Asignado</Form.Label>
            <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
              <option value="Monday">Lunes</option>
              <option value="Tuesday">Martes</option>
              <option value="Wednesday">Miércoles</option>
              <option value="Thursday">Jueves</option>
              <option value="Friday">Viernes</option>
              <option value="Saturday">Sábado</option>
              <option value="Sunday">Domingo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de Inicio</Form.Label>
            <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de Término</Form.Label>
            <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" className="me-2" onClick={handleClose}>Cancelar</Button>
            <Button variant={itemToEdit ? "primary" : "success"} type="submit">{itemToEdit ? "Guardar" : "Crear"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ClassScheduleModal;