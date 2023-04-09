import { Navigate, Outlet } from 'react-router-dom'


type ComponentType = {
  isLoggedIn: boolean
}

const PrivateRoute = ({ isLoggedIn }: ComponentType) => (isLoggedIn ? <Outlet /> : <Navigate to="/login" />)

export default PrivateRoute
