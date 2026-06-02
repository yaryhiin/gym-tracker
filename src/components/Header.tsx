import cn from "classnames";
import { useNavigate } from "react-router-dom";

import styles from "../styles/modules/Header.module.scss";

type HeaderProps = {
  toggleTheme: () => void;
  theme: string;
  handleLogout: () => void;
  session: boolean;
};

const Header = ({ toggleTheme, theme, handleLogout, session }: HeaderProps) => {
  const navigate = useNavigate();
  function signup() {
    navigate("/signup");
  }
  function login() {
    navigate("/login");
  }
  return (
    <header className={cn("header", styles.header)}>
      {session ? (
        <div className={styles.sessionBox}>
          <button
            className={cn("button", styles.logOut)}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className={styles.sessionBox}>
          <button onClick={login} className={cn("button", styles.logIn)}>
            Log In
          </button>
          <button onClick={signup} className={cn("button", styles.signUp)}>
            Sign Up
          </button>
        </div>
      )}
      <div className={styles.themeBox}>
        <button
          onClick={toggleTheme}
          className={cn("button", styles.themeSwitch)}
          aria-pressed={theme === "dark"}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
};

export default Header;
