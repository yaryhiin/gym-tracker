import styles from "../styles/WelcomeScreen.module.scss";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  function signup() {
    navigate("/signup");
  }
  function login() {
    navigate("/login");
  }
  return (
    <>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to the Gym Tracker App</h1>
        <h3 className={styles.description}>
          Track your workouts, exercises, sets and rest time all in one app
        </h3>
        <div className={styles.sessionBox}>
          <div>
            <button onClick={login} className={styles.logIn}>
              Log In
            </button>
          </div>
          <div>
            <button onClick={signup} className={styles.signUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
