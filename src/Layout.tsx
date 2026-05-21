import styles from "./components/styles/Header.module.scss";
import cn from "classnames";
import { supabase } from "./supabase";
import { useNavigate, Outlet } from "react-router-dom";

type LayoutProps = {
  toggleTheme: () => void;
  theme: string;
};

export default function Layout({ toggleTheme, theme }: LayoutProps) {
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
    <>
      <header className="header">
        <button className={cn("button", styles.logOut)} onClick={handleLogout}>
          Log Out
        </button>
        <div>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.themeSwitch}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>
      <main className="body">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
