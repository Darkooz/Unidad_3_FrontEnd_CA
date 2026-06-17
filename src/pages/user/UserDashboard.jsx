import { Card, Table, Row, Col, ProgressBar } from "react-bootstrap";

function UserDashboard() {
return (
    <Card className="shadow-sm border-0">
    <Card.Body>
        <h3 className="text-primary mb-3">📋 Mi Plan de Entrenamiento Active</h3>
        <p className="text-muted">Aquí puedes hacer seguimiento a tus rutinas asignadas y asistencias.</p>
        <Row className="mb-4">
        <Col md={4}>
            <div className="p-3 border rounded bg-light">
            <span className="text-muted d-block small">Asistencias del mes</span>
            <strong className="fs-3">12 / 16</strong>
            <ProgressBar now={75} variant="primary" className="mt-2" label="75%" />
            </div>
        </Col>
        </Row>
        <Table striped bordered hover responsive className="mt-3">
        <thead className="table-primary">
            <tr>
            <th>Ejercicio</th>
            <th>Series</th>
            <th>Repeticiones</th>
            <th>Descanso</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>Press Banca</td>
            <td>4</td>
            <td>10</td>
            <td>90 seg</td>
            </tr>
            <tr>
            <td>Sentadillas GVT</td>
            <td>4</td>
            <td>12</td>
            <td>120 seg</td>
            </tr>
        </tbody>
        </Table>
    </Card.Body>
    </Card>
);
}

export default UserDashboard;