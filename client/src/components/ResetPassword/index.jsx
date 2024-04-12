import React, { useState } from 'react';
import { Link,  useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResetPasswordRequest = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          setMessage(data.message);
        } catch (error) {
          console.error("Error:", error);
        }
      };
    
      const handleResetPassword = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/reset-password-update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
          });
          const data = await response.json();
          setMessage(data.message);
        } catch (error) {
          console.error("Error:", error);
        }
      };

    

  return (
    <div className={styles.reset_container}>
    <div className={styles.reset_form_container}>
    <form className={styles.form_container} >
             <h2>Reset Password</h2>
     
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <button
         onClick={handleResetPasswordRequest}
         className={styles.green_btn}
         >Request Reset</button>
    
     
        <input
          type="text"
          placeholder="Enter token from email"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleResetPassword}
        className={styles.green_btn}
        >Reset Password</button>
          <button onClick={()=>{navigate('/login')}}
        className={styles.green_btn}
        >Back</button>

     
      {message && <p>{message}</p>}
            </form>  
    </div>
    </div>
  )
}

export default ResetPassword;