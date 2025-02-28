import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PropTypes from "prop-types"

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
}

export default PrivateRoute

