import { Card, Table, Button, Badge } from "react-bootstrap";

function AdminDashboard() {
return (
    <Card className="shadow-sm border-0">
    <Card.Body>
        <h3 className="text-danger mb-3">⚙️ Control Global del Sistema</h3>
        <p className="text-muted">Administración general de usuarios, asignación de roles y sucursales.</p>
        <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Usuarios Registrados</h5>
        <Button variant="danger" size="sm">+ Registrar Personal</Button>
        </div>
        <Table striped bordered hover responsive>
        <thead className="table-dark">
            <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol Activo</th>
            <th>Sede</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>#1012</td>
            <td>carlosalbarado1012@gmail.com</td>
            <td><Badge bg="primary">user</Badge></td>
            <td>La Serena</td>
            </tr>
            <tr>
            <td>#1013</td>
            <td>profesor.inacap@sportclub.cl</td>
            <td><Badge bg="success">coach</Badge></td>
            <td>Coquimbo</td>
            </tr>
        </tbody>
        </Table>
    </Card.Body>
    </Card>
);
}

export default AdminDashboard;