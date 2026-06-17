import { Card, Table, Button } from "react-bootstrap";

function CoachDashboard() {
return (
    <Card className="shadow-sm border-0">
    <Card.Body>
        <h3 className="text-success mb-3">💪 Gestión de Alumnos Asignados</h3>
        <p className="text-muted">Monitorea el progreso de tus alumnos en el gimnasio y actualiza sus planes.</p>
        <Table hover responsive className="mt-4">
        <thead className="table-success">
            <tr>
            <th>Alumno</th>
            <th>Plan Actual</th>
            <th>Estado Rutina</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>Carlos Albarado</td>
            <td>Hipertrofia Avanzada</td>
            <td><span className="badge bg-success">Actualizada</span></td>
            <td><Button variant="outline-success" size="sm">Modificar</Button></td>
            </tr>
        </tbody>
        </Table>
    </Card.Body>
    </Card>
);
}

export default CoachDashboard;