import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createSport, updateSport } from "../../services/sportService";

function SportModal({ show, handleClose, refreshSports, sportToEdit }) {
const [formData, setFormData] = useState({
    name: "",
    objective: "",
    duration: "",
    status: true
});

  // Este hook detecta si le pasamos un deporte para editar, o si es uno nuevo
useEffect(() => {
    if (sportToEdit) {
    setFormData({
        name: sportToEdit.name,
        objective: sportToEdit.objective,
        duration: sportToEdit.duration,
        status: sportToEdit.status
    });
    } else {
    setFormData({ name: "", objective: "", duration: "", status: true });
    }
}, [sportToEdit, show]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones Obligatorias de la rúbrica
    if (!formData.name.trim() || !formData.objective.trim() || !formData.duration) {
    Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
    return;
    }

    // Convertimos la duración estrictamente a número para que el backend no la rechace
    const dataToSend = {
    ...formData,
    duration: Number(formData.duration)
    };

    try {
    let response;
    if (sportToEdit) {
        response = await updateSport(sportToEdit.id, dataToSend);
    } else {
        response = await createSport(dataToSend);
    }

      // Si el backend aprueba la creación
    if (response.ok) {
        Swal.fire("Éxito", response.message, "success");
        refreshSports(); // Actualiza la tabla en tiempo real
        handleClose();   // Cierra el modal
    } else {
        // Si el backend arroja un error (ej: deporte ya existe)
        Swal.fire("Error del Servidor", response.message || "No se pudo guardar", "error");
    }
    } catch (error) {
    console.error(error);
    Swal.fire("Error de Conexión", "No se pudo comunicar con el backend", "error");
    }
};

return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
    <Modal.Header closeButton>
        <Modal.Title>{sportToEdit ? "Editar Deporte" : "Crear Nuevo Deporte"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Nombre del Deporte</Form.Label>
            <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Natación"
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
            as="textarea"
            rows={2}
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            placeholder="Ej: Mejorar resistencia física"
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Ej: 60"
            min="1"
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Check
            type="switch"
            label={formData.status ? "Estado: Activo" : "Estado: Inactivo"}
            name="status"
            checked={formData.status}
            onChange={handleChange}
            />
        </Form.Group>
        <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" className="me-2" onClick={handleClose}>
            Cancelar
            </Button>
            <Button variant={sportToEdit ? "primary" : "success"} type="submit">
            {sportToEdit ? "Guardar Cambios" : "Crear Deporte"}
            </Button>
        </div>
        </Form>
    </Modal.Body>
    </Modal>
);
}

export default SportModal;