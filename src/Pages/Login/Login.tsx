import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { rootDomain } from "../../API/API";

interface FormData {
  number: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    number: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!formData.number || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // API Request
      const response = await axios.post(rootDomain + "/auth/login", formData);

      // Handle the API response
      const { refreshToken, accessToken, data } = response.data.data;

      // Decrypt the data (you might have your own decryption logic)
      // For demonstration purposes, we'll just use the received data as is
      // Note: Ensure to use secure storage methods in a real-world scenario
      localStorage.setItem("messInfo", JSON.stringify(data));

      // Clear any previous error messages
      setErrorMessage("");
      navigate("/add-meals");
    } catch (error) {
      // Handle errors, e.g., invalid credentials
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="number" style={styles.label}>
            Number:
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
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    borderRadius: "8px",
    padding: "24px",
    width: "300px",
    background: "#fff",
    margin: "50px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
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
  error: {
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

export default Login;
