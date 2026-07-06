import { Outlet } from "react-router";
import Navbar from "../features/auth/components/Navbar";
import { useAuth } from "../features/auth/hooks/useAuth";

const MainLayout = () => {
  const { user, handleLogout } = useAuth();

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <Outlet />
    </>
  );
};

export default MainLayout;