import { useNavigate } from "react-router-dom";
import cn from "classnames";

import styles from "../styles/modules/WelcomeScreen.module.scss";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>
        Track your workouts and progress in one place.
      </h1>
      <h3 className={styles.description}>
        Create exercises, build routines, log sets, view history, and follow
        your progress over time. Simple, fast, and made for real gym sessions.
      </h3>
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
      </div>
    </div>
  );
};

export default WelcomeScreen;
