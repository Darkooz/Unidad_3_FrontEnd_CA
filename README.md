SportClub - Sistema de Gestión Deportiva

Proyecto desarrollado para la asignatura de Programación Front End (T13031) en INACAP. Este sistema es una Single Page Application (SPA) que permite la gestión integral de un club deportivo, abarcando roles de Administrador, Entrenador (Coach) y Miembro.

👥 Integrante

Carlos Albarado

🌐 Despliegue

La aplicación se encuentra desplegada y operativa en la nube AWS:

URL del Sistema: http://35.175.8.40

🛠️ Tecnologías Utilizadas

Frontend: React, React Router Dom, React-Bootstrap, SweetAlert2, Axios/Fetch.

Backend: Node.js, Express, Sequelize ORM.

Base de Datos: MariaDB.

Infraestructura: AWS EC2 (Debian 13), Docker Compose, Nginx (Proxy Inverso).

🚀 Flujos Funcionales Implementados

Como estudiante individual, se han implementado los 8 flujos funcionales requeridos:

Administración:

Gestión de Salas: CRUD completo con modales y validaciones.

Gestión de Asignaciones: Cruce relacional entre Deporte, Sala y Coach.

Gestión de Horarios: Configuración de bloques horarios.

Coach:
4. Mis Clases: Visualización de clases asignadas.
5. Mi Horario: Vista personalizada de la parrilla horaria.

Usuario (Miembro):
6. Clases Disponibles: Catálogo de disciplinas.
7. Crear Reserva: Sistema de inscripción a cupos.
8. Mis Reservas / Cancelar Reserva: Gestión de estados de reserva (borrado lógico).

⚙️ Instrucciones de Ejecución

Backend

Clonar el repositorio del backend.

Configurar el archivo .env con las credenciales de base de datos.

Levantar servicios: sudo docker compose up -d --build.

Frontend

Clonar este repositorio.

Crear archivo .env en la raíz con: VITE_API_URL=/api.

Instalar dependencias: npm install.

Compilar para producción: npm run build.

Copiar archivos a Nginx: sudo cp -r dist/* /usr/share/nginx/html/.

Desarrollado bajo los estándares de programación Front End - INACAP.
