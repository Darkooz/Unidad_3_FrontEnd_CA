import { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserFormModal from "../../components/users/UserFormModal";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.data || data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        Swal.fire("¡Actualizado!", "Usuario actualizado.", "success");
      } else {
        await createUser(formData);
        Swal.fire("¡Creado!", "Usuario creado.", "success");
      }
      closeModal();
      loadUsers();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción eliminará a ${user.full_name || user.email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id);
        Swal.fire("¡Eliminado!", "Usuario eliminado.", "success");
        loadUsers();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
        <h5 className="mb-0 fw-bold text-dark">👥 Gestión de Usuarios</h5>
        <Button variant="primary" size="sm" onClick={openCreateModal}>+ Nuevo Usuario</Button>
      </Card.Header>
      <Card.Body className="p-0">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table responsive hover striped className="m-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td><td className="fw-semibold">{user.full_name}</td><td>{user.email}</td>
                  <td><Badge bg={user.role === "admin" ? "success" : user.role === "coach" ? "info" : "secondary"}>{user.role}</Badge></td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="warning" size="sm" onClick={() => openEditModal(user)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(user)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <UserFormModal show={showModal} handleClose={closeModal} handleSave={handleSave} selectedUser={selectedUser} />
    </Card>
  );
}

export default UsersPage;