import { useNavigate, Outlet, useLocation, matchPath } from "react-router-dom";

import Header from "./Header";
import NavButtons from "./NavButtons";

import { supabase } from "../supabase";

type LayoutProps = {
  toggleTheme: () => void;
  theme: string;
  session: boolean;
};

export default function Layout({ toggleTheme, theme, session }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveWorkout =
    location.pathname === "/workout" ||
    !!matchPath("/changeWorkout/:id", location.pathname);

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
