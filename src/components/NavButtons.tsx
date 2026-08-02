import cn from "classnames";
import { useNavigate, useLocation } from "react-router-dom";

import {
  House,
  ListChecks,
  Dumbbell,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

import styles from "../styles/modules/NavButtons.module.scss";

const NavButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="footer">
      <div className={styles.navBtnContainer}>
        <button
          className={cn(styles.home, styles.navButton, {
            [styles.active]: isActive("/"),
          })}
          onClick={() => navigate("/")}
        >
          <House size={18} />
          Home
        </button>
        <button
          className={cn(styles.routines, styles.navButton, {
            [styles.active]: isActive("/routines"),
          })}
          onClick={() => navigate("/routines")}
        >
          <ListChecks size={18} />
          Routines
        </button>
        <button
          className={cn(styles.progress, styles.navButton, {
            [styles.active]: isActive("/exercises"),
          })}
          onClick={() => navigate("/exercises")}
        >
          <Dumbbell size={18} />
          Exercises
        </button>
        <button
          className={cn(styles.history, styles.navButton, {
            [styles.active]: isActive("/progress"),
          })}
          onClick={() => navigate("/progress")}
        >
          <ChartNoAxesColumnIncreasing size={18} />
          Progress
        </button>
      </div>
    </div>
  );
};

export default NavButtons;
