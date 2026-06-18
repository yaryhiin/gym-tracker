import cn from "classnames";
import { useNavigate } from "react-router-dom";

import styles from "../styles/modules/NavButtons.module.scss";

const NavButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="footer">
      <div className={styles.navBtnContainer}>
        <button
          className={cn(styles.home, styles.navButton)}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className={cn(styles.routines, styles.navButton)}
          onClick={() => navigate("/routines")}
        >
          Routines
        </button>
        <button
          className={cn(styles.progress, styles.navButton)}
          onClick={() => navigate("/exercises")}
        >
          Exercises
        </button>
        <button
          className={cn(styles.history, styles.navButton)}
          onClick={() => navigate("/progress")}
        >
          Progress
        </button>
      </div>
    </div>
  );
};

export default NavButtons;
