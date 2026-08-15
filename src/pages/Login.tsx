import { supabase } from "../supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import cn from "classnames";

import styles from "../styles/modules/FormLayout.module.scss";

import type { AuthErrors } from "../types/errors";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthErrors>({
    confirmPassword: false,
    password: false,
    email: false,
  });
  const [authError, setAuthError] = useState("");

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAuthError("");
    const newErrors: AuthErrors = {
      confirmPassword: false,
      password: false,
      email: false,
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = true;
    if (!password) newErrors.password = true;

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors((prev) => ({ ...prev, password: true, email: true }));
      return;
    }
    console.log("User logged in successfully:", data);

    setEmail("");
    setPassword("");
    navigate("/");
  }

  function onBack(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setEmail("");
    setPassword("");

    navigate("/");
  }

  return (
    <div className="container">
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>{t("auth.login")}</h1>
        <div className={styles.inputBox}>
          <div className={styles.inputContainer}>
            <p className={styles.inputText}>{t("auth.email")}</p>
            <input
              className={cn(styles.input, errors.email && "error")}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {authError && (
              <p className={cn("errorMessage", styles.fullWidth)}>
                {authError}
              </p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputText}>{t("auth.password")}</p>
            <input
              className={cn(styles.input, errors.password && "error")}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authError && (
              <p className={cn("errorMessage", styles.fullWidth)}>
                {authError}
              </p>
            )}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className="backBtn button" onClick={onBack}>
            {t("common.back")}
          </button>
          <button
            className={cn(styles.saveBtn, "button")}
            onClick={handleLogin}
          >
            {t("auth.login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
