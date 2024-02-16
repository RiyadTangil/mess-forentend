import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getMessInfoFromLocalHost } from "../../helperFunctions";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState(getMessInfoFromLocalHost());

  const handleLogout = () => {
    // Open the confirmation dialog
    setOpenDialog(true);
  };

  const handleConfirmLogout = () => {
    // Clear user information from local storage
    localStorage.removeItem("messInfo");

    // Redirect to the login page
    navigate("/login");
  };

  const handleCancelLogout = () => {
    // Close the confirmation dialog
    setOpenDialog(false);
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {/* Display user information */}
      <p>Welcome, {userInfo?.name}</p>

      {/* Logout button */}
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>

      {/* Confirmation dialog */}
      <Dialog open={openDialog} onClose={handleCancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to logout?</p>
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
    </div>
  );
};

export default Profile;
