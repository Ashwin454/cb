import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, User } = useSelector((state) => state.Auth);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(User?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
