import styles from "../styles/WelcomeScreen.module.scss";

const WelcomeScreen = () => {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Welcome to the Gym Tracker App</h1>
      <h3 className={styles.description}>
        Track your workouts, exercises, sets and rest time all in one app
      </h3>
    </div>
  );
};

export default WelcomeScreen;
