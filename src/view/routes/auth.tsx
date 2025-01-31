import { useAuthContext } from "@providers/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useAuthContext();

  // ログインしていない場合、`/sign-in` にリダイレクト
  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  // ログイン済みならそのままレンダリング
  return <Outlet />;
};

export default ProtectedRoute;
