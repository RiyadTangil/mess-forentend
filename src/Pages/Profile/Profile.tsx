import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getMessInfoFromLocalHost } from "../../helperFunctions";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { rootDomain } from "../../API/API";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState(getMessInfoFromLocalHost());
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    number: userInfo?.number || "",
    password: "",
    mess_id: userInfo?.mess_id || "",
  });

  const handleLogout = () => {
    setOpenDialog(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("messInfo");
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setOpenDialog(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Make API request to update user information
      await axios.patch(rootDomain + `/users/${userInfo?.userId}`, formData);
      setUserInfo({ ...userInfo, ...formData });
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userInfo?.name || "",
      number: userInfo?.number || "",
      password: "",
    });
    setEditing(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Profile Page
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Card
          sx={{ width: "80%", borderRadius: "20px" }}
          variant={editing ? "outlined" : "elevation"}
        >
          {" "}
          {/* Conditional border based on editing state */}
          <CardContent>
            {!editing ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5">User Information</Typography>
                <IconButton onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5">Edit Information</Typography>
                <IconButton onClick={handleCancelEdit}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            <TextField
              fullWidth
              variant="standard"
              id="standard-basic"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
            />
            <TextField
              fullWidth
              variant="standard"
              id="standard-basic"
              label="Number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              disabled={!editing}
            />
            <TextField
              variant="standard"
              id="standard-basic"
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={!editing}
            />
            {editing && (
              <Button
                sx={{ marginTop: 2 }}
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          disabled={loading}
        >
          Logout
        </Button>
      </Grid>
      <Dialog open={openDialog} onClose={handleCancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Profile;
