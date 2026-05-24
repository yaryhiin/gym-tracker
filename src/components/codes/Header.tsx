import cn from "classnames";
import styles from "../styles/Header.module.scss";
import { useNavigate } from "react-router-dom";

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
    <header className="header">
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
          <button onClick={login} className={styles.logIn}>
            Log In
          </button>
          <button onClick={signup} className={styles.signUp}>
            Sign Up
          </button>
        </div>
      )}
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
  );
};

export default Header;
