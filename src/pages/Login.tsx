import { supabase } from "../supabase";
import { useState } from "react";
import styles from "../styles/modules/FormLayout.module.scss";
import cn from "classnames";
import { useNavigate } from "react-router-dom";

type Errors = {
  confirmPassword: boolean;
  password: boolean;
  email: boolean;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({
    confirmPassword: false,
    password: false,
    email: false,
  });
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();
  function home() {
    navigate("/");
  }

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setAuthError("");
    const newErrors: Errors = {
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
    home();
  }

  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setEmail("");
    setPassword("");

    home();
  };

  return (
    <>
      <div className="container">
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Log In</h1>
          <div className={styles.inputBox}>
            <div className={styles.inputContainer}>
              <p className={styles.inputText}>Email</p>
              <input
                className={cn(styles.input, errors.email && styles.error)}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {authError && (
                <p className={cn(styles.errorMessage, styles.fullWidth)}>
                  {authError}
                </p>
              )}
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.inputText}>Password</p>
              <input
                className={cn(styles.input, errors.password && styles.error)}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {authError && (
                <p className={cn(styles.errorMessage, styles.fullWidth)}>
                  {authError}
                </p>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className="backBtn button" onClick={onBack}>
              Back
            </button>
            <button
              className={cn(styles.saveBtn, "button")}
              onClick={handleLogin}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
