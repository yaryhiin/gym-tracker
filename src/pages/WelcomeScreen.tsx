import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useTranslation } from "react-i18next";

import styles from "../styles/modules/WelcomeScreen.module.scss";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>{t("welcomeScreen.title")}</h1>
      <h3 className={styles.description}>{t("welcomeScreen.description")}</h3>
      <div className={styles.sessionBox}>
        <button
          onClick={() => navigate("/login")}
          className={cn("button", styles.logIn)}
        >
          {t("auth.login")}
        </button>
        <button
          onClick={() => navigate("/signup")}
          className={cn("button", styles.signUp)}
        >
          {t("auth.signup")}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
