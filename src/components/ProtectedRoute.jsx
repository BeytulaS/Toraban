import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/userProvider";

export default function ProtectedRoute({ children }) {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  return children;
}
