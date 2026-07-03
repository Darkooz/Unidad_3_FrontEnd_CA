import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createSportRoom, updateSportRoom } from "../../services/sportRoomService";
import { getSports } from "../../services/sportService";
import { getRooms } from "../../services/roomService";

function SportRoomModal({ show, handleClose, refreshData, itemToEdit }) {
  const [formData, setFormData] = useState({
    sport_id: "",
    room_id: "",
    coach_id: "",
    observation: "",
    status: true
  });

  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [coaches, setCoaches] = useState([]);

  // Cargar las opciones para las listas desplegables
  useEffect(() => {
    const loadSelects = async () => {
      try {
        const sportsRes = await getSports();
        if (sportsRes.data) setSports(sportsRes.data);

        const roomsRes = await getRooms();
        if (roomsRes.data) setRooms(roomsRes.data);

        // Obtenemos los usuarios y filtramos solo los que son "coach"
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const usersRes = await fetch(`${API_URL}/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        if (usersData.data) {
          setCoaches(usersData.data.filter(u => u.role === 'coach' || u.role === 'Coach'));
        }
      } catch(e) {
        console.error("Error cargando listas desplegables", e);
      }
    };
    if (show) loadSelects();
  }, [show]);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        sport_id: itemToEdit.sport_id || "",
        room_id: itemToEdit.room_id || "",
        coach_id: itemToEdit.coach_id || "",
        observation: itemToEdit.observation || "",
        status: itemToEdit.status !== false
      });
    } else {
      setFormData({ sport_id: "", room_id: "", coach_id: "", observation: "", status: true });
    }
  }, [itemToEdit, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sport_id || !formData.room_id || !formData.coach_id) {
      Swal.fire("Advertencia", "Debes seleccionar un Deporte, una Sala y un Coach", "warning");
      return;
    }

    // El backend exige que los IDs sean números enteros
    const dataToSend = {
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id),
      observation: formData.observation,
      status: formData.status
    };

    try {
      let response;
      if (itemToEdit) {
        response = await updateSportRoom(itemToEdit.id, dataToSend);
      } else {
        response = await createSportRoom(dataToSend);
      }

      if (response && response.ok !== false && !response.errors) {
        Swal.fire("Éxito", "Asignación guardada correctamente", "success");
        refreshData();
        handleClose();
      } else {
        const msgError = response?.errors ? Object.values(response.errors).join(", ") : (response?.message || "Error al guardar");
        Swal.fire("Error", msgError, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Problema de conexión con el servidor", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{itemToEdit ? "Editar Asignación" : "Nueva Asignación"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Select name="sport_id" value={formData.sport_id} onChange={handleChange}>
              <option value="">Seleccione un deporte...</option>
              {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Select name="room_id" value={formData.room_id} onChange={handleChange}>
              <option value="">Seleccione una sala...</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coach (Profesor)</Form.Label>
            <Form.Select name="coach_id" value={formData.coach_id} onChange={handleChange}>
              <option value="">Seleccione un coach...</option>
              {coaches.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observación (Opcional)</Form.Label>
            <Form.Control type="text" name="observation" value={formData.observation} onChange={handleChange} placeholder="Ej: Traer toalla" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check type="switch" label={formData.status ? "Estado: Activa" : "Estado: Inactiva"} name="status" checked={formData.status} onChange={handleChange} />
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

export default SportRoomModal;