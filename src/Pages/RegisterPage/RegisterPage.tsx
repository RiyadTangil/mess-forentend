// RegisterPage.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import jsonwebtoken from "jsonwebtoken";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { rootDomain } from "../../API/API";

interface FormData {
  name: string;
  number: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const [warningMessage, setWarningMessage] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.number ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setWarningMessage("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setWarningMessage("Password and Confirm Password do not match.");
      return;
    }

    try {
      // API Request
      const response = await axios.post(
        rootDomain + "/mess/create-mess",
        formData
      );

      // Handle the API response
      const { refreshToken, accessToken, data } = response.data.data;
      // console.log(response.data.data);
      // const decodedToken: any = jsonwebtoken.decode(accessToken);
      // console.log(decodedToken,"decodedToken");

      // Store the access token in local storage (you might want to use secure storage methods)
      localStorage.setItem("messInfo", JSON.stringify(data));

      // Decrypt the access token (you might have your own decryption logic)
      // For demonstration purposes, we'll just use the received access token as is
      setAccessToken(accessToken);

      // Clear any warning message
      setWarningMessage("");
      navigate("/add-meals");
    } catch (error) {
      // Handle errors, e.g., if the phone number already exists
      setWarningMessage("Phone number already exists.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.cardTitle}>Register</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Mess Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleInputChange}
              value={formData.name}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="number" style={styles.label}>
              Phone Number:
            </label>
            <input
              type="text"
              id="number"
              name="number"
              onChange={handleInputChange}
              value={formData.number}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleInputChange}
              value={formData.confirmPassword}
              style={styles.input}
            />
          </div>
          {warningMessage && <p style={styles.warning}>{warningMessage}</p>}
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "24px",
    width: "300px",
    background: "#fff",
  },
  cardTitle: {
    // textAlign: 'center',
    marginBottom: "16px",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as "column",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  warning: {
    color: "red",
    marginBottom: "16px",
  },
  submitButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default RegisterPage;
