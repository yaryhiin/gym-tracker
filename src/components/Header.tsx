import cn from "classnames";
import { useNavigate } from "react-router-dom";

import { UserRound } from "lucide-react";

import styles from "../styles/modules/Header.module.scss";

type HeaderProps = {
  session: boolean;
  toggleTheme: () => void;
  theme: string;
};

const Header = ({ toggleTheme, theme, session }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={cn("header", styles.header)}>
      {session ? (
        <div className={styles.sessionBox}>
          <button
            className={styles.profileLogo}
            onClick={() => navigate("/profile")}
          >
            <UserRound size={20}/>
          </button>
        </div>
      ) : (
        <div className={styles.sessionBox}>
          <button
            onClick={() => navigate("/login")}
            className={cn("button", styles.logIn)}
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className={cn("button", styles.signUp)}
          >
            Sign Up
          </button>
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
        </div>
      )}
    </header>
  );
};

export default Header;
