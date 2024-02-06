import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Drawer,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import toast, { useToaster } from "react-hot-toast";
import "../MealAndDate/MealAndDate.css";
import { rootDomain } from "../../API/API";
interface UserData {
  _id: string;
  name: string;
  number: string;
}

const Users: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [mess_id, setMessId] = useState("");

  useEffect(() => {
    // Fetch user data from the backend or local storage
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Retrieve mess ID from local storage
      const userData = JSON.parse(localStorage.getItem("messInfo") ?? "");
      const messId = userData ? userData.mess_id : null;
      console.log("messId => ", messId);
      if (!messId) {
        console.error("Mess ID not found in local storage");
        return;
      }
      setMessId(messId);

      const response = await axios.get(rootDomain + `/mess/${messId}`);

      setUserData(response.data.data.users);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleAddUser = () => {
    setName("");
    setNumber("");
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setName(user.name);
    setNumber(user.number);

    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(rootDomain + `/users/${userId}`);
      const updatedUsers = userData.filter((user) => user._id !== userId);
      setUserData(updatedUsers);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("Error deleting user. Please try again.");
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setName("");
    setNumber("");
  };

  const handleSubmit = async () => {
    const requestData = {
      name,
      number,
      password: number,
      role: "user",
      mess_id,
    };

    try {
      let response;
      if (editingUser) {
        response = await axios.patch(
          rootDomain + `/users/${editingUser._id}`,
          requestData
        );
      } else {
        response = await axios.post(rootDomain + "/users/signup", requestData);
      }

      const updatedUsers = editingUser
        ? userData.map((user) =>
            user._id === editingUser._id ? response.data.data : user
          )
        : [...userData, response.data.data];

      setUserData(updatedUsers);
      setDrawerOpen(false);
      toast.success(
        `${editingUser ? "User updated" : "User added"} successfully!`
      );
    } catch (error) {
      console.error("Error adding/updating user", error);
      toast.error("Error adding/updating user. Please try again.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",

          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.number}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <div style={{ padding: "20px", width: "300px" }}>
          <h2>{editingUser ? "Edit User" : "Add User"}</h2>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingUser ? "Update" : "Add"}
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Users;
