import cn from "classnames";
import styles from "../styles/NavButtons.module.scss";
import { useNavigate } from "react-router-dom";

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
          className={cn(styles.history, styles.navButton)}
          onClick={() => navigate("/history")}
        >
          History
        </button>
        <button
          className={cn(styles.progress, styles.navButton)}
          onClick={() => navigate("/progress")}
        >
          Progress
        </button>
      </div>
    </div>
  );
};

export default NavButtons;
