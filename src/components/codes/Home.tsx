import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.scss";
import NavButtons from "./NavButtons";

type homeProps = {
  userName: string;
};

const Home = ({ userName }: homeProps) => {
  const navigate = useNavigate();
  function startWorkout(): void {
    navigate("/workout");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Good evening, {userName}</h1>
      <h2 className={styles.button}>Start Workout</h2>
      <div className={styles.workouts}>
        <button className={styles.button} onClick={startWorkout}>
          Push Day
        </button>
        <button className={styles.button} onClick={startWorkout}>
          Pull Day
        </button>
        <button className={styles.button} onClick={startWorkout}>
          Leg Day
        </button>
        <button className={styles.button} onClick={startWorkout}>
          Custom Workout
        </button>
      </div>
      <div className={styles.history}>
        <h2 className={styles.title}>Recent workout</h2>
        <p className={styles.descName}>Push Day - 10 May</p>
        <div className={styles.descWorkout}>
          <p>Bench Press: 70kg x 6</p>
        </div>
      </div>
      <NavButtons />
    </div>
  );
};

export default Home;
