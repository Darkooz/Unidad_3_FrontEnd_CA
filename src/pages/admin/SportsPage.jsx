import { useEffect, useState } from "react";
import { Container, Card, Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getSports, deleteSport, toggleSportStatus } from "../../services/sportService";
import SportModal from "./SportModal";

function SportsPage() {
const [sports, setSports] = useState([]);
const [showModal, setShowModal] = useState(false);
const [sportToEdit, setSportToEdit] = useState(null);

  // Funciones para controlar la ventana flotante del Modal
const handleOpenModal = (sport = null) => {
    setSportToEdit(sport);
    setShowModal(true);
};

const handleCloseModal = () => {
    setSportToEdit(null);
    setShowModal(false);
};

  // Función para cargar los datos de la API
const loadSports = async () => {
    try {
    const response = await getSports();
    if (response.ok) {
        setSports(response.data);
    }
    } catch (error) {
    console.error("Error al cargar deportes:", error);
    }
};

  // Cargar los deportes apenas se abre la pantalla
useEffect(() => {
    loadSports();
}, []);

  // Función para formatear la fecha exactamente como pide la pauta
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
};

  // Botón Refrescar
const handleRefresh = () => {
    loadSports();
};

  // Cambiar Estado con el Switch directamente en la tabla
const handleToggle = async (id, currentStatus) => {
    try {
    const response = await toggleSportStatus(id, !currentStatus);
    if (response.ok) {
        // Actualiza el estado en pantalla sin recargar la página
        setSports(sports.map(sport => sport.id === id ? { ...sport, status: !currentStatus } : sport));
    }
    } catch (error) {
    Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
};

  // Eliminar con SweetAlert2
const handleDelete = (id) => {
    Swal.fire({
    title: "¿Está seguro de eliminar este deporte?",
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
        const response = await deleteSport(id);
        if (response.ok) {
            Swal.fire("Eliminado", "El deporte ha sido eliminado correctamente.", "success");
            // Actualiza la tabla sin recargar la página
            setSports(sports.filter(sport => sport.id !== id));
        }
        } catch (error) {
        Swal.fire("Error", "Hubo un problema al eliminar el deporte.", "error");
        }
    }
    });
};

return (
    <Container className="mt-4">
    <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
        <h4 className="mb-0 fw-bold text-dark">Gestión de Deportes</h4>
        <div>
            <Button variant="outline-secondary" className="me-2" onClick={handleRefresh}>
            🔄 Refrescar
            </Button>
            {/* Aquí llamamos a handleOpenModal sin parámetros para crear uno nuevo */}
            <Button variant="danger" onClick={() => handleOpenModal()}>
            + Crear Deporte
            </Button>
        </div>
        </Card.Header>
        
        <Card.Body className="p-0">
        <Table responsive hover className="mb-0 text-center align-middle">
            <thead className="table-light">
            <tr>
                <th>Nombre</th>
                <th>Objetivo</th>
                <th>Duración (min)</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {sports.length > 0 ? (
                sports.map((sport) => (
                <tr key={sport.id}>
                    <td className="fw-semibold">{sport.name}</td>
                    <td className="text-start">{sport.objective}</td>
                    <td>{sport.duration}</td>
                    <td>
                    <Form.Check 
                        type="switch"
                        id={`switch-${sport.id}`}
                        checked={sport.status}
                        onChange={() => handleToggle(sport.id, sport.status)}
                        label={sport.status ? "Activo" : "Inactivo"}
                        className="d-inline-block"
                    />
                    </td>
                    <td>{formatDate(sport.created_at)}</td>
                    <td>
                      {/* Aquí llamamos a handleOpenModal pasándole el deporte específico a editar */}
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(sport)}>
                        ✏️
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sport.id)}>
                        🗑️
                    </Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="6" className="py-4 text-muted">No hay deportes registrados.</td>
                </tr>
            )}
            </tbody>
        </Table>
        </Card.Body>
    </Card>

      {/* Aquí abajo va el Modal flotante, que se muestra solo si showModal es true */}
    <SportModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        refreshSports={loadSports} 
        sportToEdit={sportToEdit} 
    />
    </Container>
);
}

export default SportsPage;