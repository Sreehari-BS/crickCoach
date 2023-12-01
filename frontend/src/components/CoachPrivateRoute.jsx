import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const CoachPrivateRoute = () => {
  const { coachInfo } = useSelector((state) => state.coachAuth);
  return coachInfo ? <Outlet /> : <Navigate to="/explore" replace />;
};

export default CoachPrivateRoute;
