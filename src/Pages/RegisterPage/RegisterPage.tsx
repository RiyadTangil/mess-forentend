import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { rootDomain } from "../../API/API";
import { toast } from "react-hot-toast";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (
      !formData.name ||
      !formData.number ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setWarningMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setWarningMessage("Password and Confirm Password do not match.");
      setLoading(false);
      return;
    }

    try {
      // API Request
      const response = await axios.post(
        rootDomain + "/mess/create-mess",
        formData
      );

      // Handle the API response
      const { data } = response.data;
      localStorage.setItem("messInfo", JSON.stringify(data));

      // Clear any warning message
      setWarningMessage("");
      setLoading(false);
      navigate("/add-meals");
      toast.success("Registration successful!");
    } catch (error) {
      // Handle errors
      setWarningMessage("Phone number already exists.");
      setLoading(false);
      toast.error("Registration failed. Please try again.");
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
            <div style={styles.passwordContainer}>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                style={styles.input}
              />
              <span
                style={styles.eyeIcon}
                onClick={() => {
                  const passwordInput = document.getElementById(
                    "password"
                  ) as HTMLInputElement;
                  passwordInput.type =
                    passwordInput.type === "password" ? "text" : "password";
                }}
              >
                👁️
              </span>
            </div>
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
            {loading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
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
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    cursor: "pointer",
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
