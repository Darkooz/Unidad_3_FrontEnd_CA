import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createUser, updateUser } from "../../services/userService";

function UserModal({ show, handleClose, refreshData, itemToEdit }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
    birth_date: ""
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        full_name: itemToEdit.full_name || "",
        email: itemToEdit.email || "",
        password: "", // Se deja vacío por seguridad al editar
        role: itemToEdit.role || "user",
        birth_date: itemToEdit.birth_date ? itemToEdit.birth_date.split("T")[0] : ""
      });
    } else {
      setFormData({ full_name: "", email: "", password: "", role: "user", birth_date: "" });
    }
  }, [itemToEdit, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      
      // Si estamos editando y no escribió contraseña nueva, la borramos del envío
      if (itemToEdit && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (itemToEdit) {
        await updateUser(itemToEdit.id, dataToSend);
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        if (!dataToSend.password) {
          Swal.fire("Advertencia", "La contraseña es obligatoria para usuarios nuevos", "warning");
          return;
        }
        await createUser(dataToSend);
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
      }
      refreshData();
      handleClose();
    } catch (error) {
      Swal.fire("Error", error.message || "Problema al guardar el usuario", "error");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{itemToEdit ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña {itemToEdit && <span className="text-muted">(Dejar en blanco para no cambiar)</span>}</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol del Sistema</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario (Alumno)</option>
              <option value="coach">Entrenador (Coach)</option>
              <option value="admin">Administrador (Admin)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
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

export default UserModal;