// src/routes/RoleRoute.jsx
import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../services/authService";

function RoleRoute({ children, allowedRoles }) {
if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
}

    const user = getUser();

  // Si no hay usuario o el rol no está en la lista permitida, rebota
    if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
}

    return children;
}

export default RoleRoute;