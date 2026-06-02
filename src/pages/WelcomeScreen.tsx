import { useNavigate } from "react-router-dom";
import cn from "classnames";

import styles from "../styles/modules/WelcomeScreen.module.scss";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Welcome to the Gym Tracker App</h1>
      <h3 className={styles.description}>
        Track your workouts, exercises, sets and time all in one app
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
