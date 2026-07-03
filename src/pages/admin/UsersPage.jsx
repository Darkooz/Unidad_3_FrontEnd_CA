import { useEffect, useState } from "react";
import { Container, Card, Table, Button, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { getUsers, deleteUser } from "../../services/userService";
import UserModal from "./UserModal";

function UsersPage() {
  const [users, setUsers] = useState([]);
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

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      // Verificamos si el backend lo manda en 'data' o directo
      if (response && response.data) {
        setUsers(response.data);
      } else {
        setUsers(response);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Se borrará permanentemente de la base de datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          Swal.fire("Eliminado", "El usuario ha sido borrado.", "success");
          loadUsers(); // Recargamos la tabla
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar al usuario.", "error");
        }
      }
    });
  };

  const getRoleBadge = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return <Badge bg="danger">Admin</Badge>;
      case 'coach': return <Badge bg="success">Coach</Badge>;
      default: return <Badge bg="primary">Alumno</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-dark">Gestión de Usuarios</h4>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={loadUsers}>🔄 Refrescar</Button>
            <Button variant="primary" onClick={() => handleOpenModal()}>+ Nuevo Usuario</Button>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha Nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-semibold">{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{user.birth_date ? user.birth_date.split("T")[0] : "-"}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(user)}>✏️</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>🗑️</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-muted">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <UserModal show={showModal} handleClose={handleCloseModal} refreshData={loadUsers} itemToEdit={itemToEdit} />
    </Container>
  );
}

export default UsersPage;