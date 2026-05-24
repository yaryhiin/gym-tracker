import { supabase } from "./supabase";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import Header from "./components/codes/Header";
import NavButtons from "./components/codes/NavButtons";

type LayoutProps = {
  toggleTheme: () => void;
  theme: string;
  session: boolean;
};

export default function Layout({ toggleTheme, theme, session }: LayoutProps) {
  const location = useLocation();

  const isActiveWorkout = location.pathname === "/workout";
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    navigate("/");
  };
  return (
    <div className={"appShell"}>
      {!isActiveWorkout && (
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          handleLogout={handleLogout}
          session={session}
        />
      )}
      <main className="container">
        <Outlet />
      </main>
      {!isActiveWorkout && session && <NavButtons />}
    </div>
  );
}
