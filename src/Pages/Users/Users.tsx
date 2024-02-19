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
import toast from "react-hot-toast";
import { rootDomain } from "../../API/API";
import { getToday } from "../../helperFunctions";
interface DepositWithdraw {
  date: string;
  amount: number;
}

interface UserData {
  _id: string;
  role: string;
  name: string;
  number: string;
  deposit?: DepositWithdraw[];
  withdraw?: DepositWithdraw[];
}

const Users: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [number, setNumber] = useState("");
  const [mess_id, setMessId] = useState("");
  const [deposit, setDeposit] = useState<DepositWithdraw[]>([]);
  const [withdraw, setWithdraw] = useState<DepositWithdraw[]>([]);
  const [today] = useState(getToday());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("messInfo") ?? "");
      const messId = userData ? userData.mess_id : null;

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
    setRole("");
    setNumber("");
    setDeposit([]);
    setWithdraw([]);
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setName(user.name);
    setRole(user.role);
    setNumber(user.number);
    setDeposit(user.deposit ?? []);
    setWithdraw(user.withdraw ?? []);

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
    setRole("");
    setNumber("");
    setDeposit([]);
    setWithdraw([]);
  };

  const handleSubmit = async () => {
    toast.loading("Submitting User...");
    // Create copies of deposit and withdraw arrays
    let filteredDeposit = [...deposit];
    let filteredWithdraw = [...withdraw];

    // Iterate over deposit array to remove objects with amount equal to 0
    for (let i = 0; i < filteredDeposit.length; i++) {
      if (!filteredDeposit[i].amount) {
        filteredDeposit.splice(i, 1); // Remove the object at index i
        i--; // Decrement i to adjust for the removed object
      }
    }

    // Iterate over withdraw array to remove objects with amount equal to 0
    for (let i = 0; i < filteredWithdraw.length; i++) {
      if (!filteredWithdraw[i].amount) {
        filteredWithdraw.splice(i, 1); // Remove the object at index i
        i--; // Decrement i to adjust for the removed object
      }
    }

    const requestData = {
      name,
      number,
      role: role ? role : "user",
      password: number,
      mess_id,
      deposit: filteredDeposit,
      withdraw: filteredWithdraw,
    };

    try {
      let response;
      if (editingUser) {
        // Remove _id from deposit and withdraw with same date and amount
        const updatedDeposit = filteredDeposit.map((d) => ({
          ...d,
          _id: undefined,
        }));
        const updatedWithdraw = filteredWithdraw.map((w) => ({
          ...w,
          _id: undefined,
        }));

        response = await axios.patch(rootDomain + `/users/${editingUser._id}`, {
          ...requestData,
          deposit: updatedDeposit,
          withdraw: updatedWithdraw,
        });
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
    } finally {
      toast.dismiss();
    }
  };

  const handleDepositChange = (index: number, key: string, value: string) => {
    const updatedDeposit = [...deposit];
    updatedDeposit[index] = {
      ...updatedDeposit[index],
      [key]: parseFloat(value),
    };
    setDeposit(updatedDeposit);
  };

  const handleWithdrawChange = (index: number, key: string, value: string) => {
    const updatedWithdraw = [...withdraw];
    updatedWithdraw[index] = {
      ...updatedWithdraw[index],
      [key]: parseFloat(value),
    };
    setWithdraw(updatedWithdraw);
  };

  const addDepositOrWithdraw = (type: "deposit" | "withdraw") => {
    if (type === "deposit") {
      setDeposit([...deposit, { date: today, amount: 0 }]);
    } else {
      setWithdraw([...withdraw, { date: today, amount: 0 }]);
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
              <TableCell>Deposited</TableCell> {/* New column */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.number}</TableCell>

                <TableCell>
                  {/* Calculate the total deposited amount */}
                  {user.deposit?.reduce(
                    (total, deposit) => total + deposit.amount,
                    0
                  ) -
                    (user.withdraw?.reduce(
                      (total, withdraw) => total + withdraw.amount,
                      0
                    ) || 0)}
                </TableCell>
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
        <div style={{ padding: "20px", width: "70vw" }}>
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
          <div
            style={{
              display: deposit.length ? "" : withdraw.length ? "" : "flex",
              justifyContent: "space-between",
            }}
          >
            {deposit.map((item, index) => (
              <div key={index}>
                <TextField
                  label={`Deposit Amount (${item.date})`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={item.amount || 0}
                  onChange={(e) =>
                    handleDepositChange(index, "amount", e.target.value)
                  }
                />
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={() => addDepositOrWithdraw("deposit")}
            >
              Deposit
            </Button>

            {withdraw.map((item, index) => (
              <div key={index}>
                <TextField
                  label={`Withdraw Amount (${item.date})`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={item.amount || 0}
                  onChange={(e) =>
                    handleWithdrawChange(index, "amount", e.target.value)
                  }
                />
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: withdraw.length ? "" : "20px" }}
              onClick={() => addDepositOrWithdraw("withdraw")}
            >
              Withdraw
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editingUser ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Users;

//another design fo drawer

//     <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
//   <div style={{ padding: "20px", width: "400px", display: "flex", flexDirection: "column" }}>
//     <h2>{editingUser ? "Edit User" : "Add User"}</h2>
//     <TextField
//       label="Name"
//       variant="outlined"
//       fullWidth
//       margin="normal"
//       value={name}
//       onChange={(e) => setName(e.target.value)}
//     />
//     <TextField
//       label="Number"
//       variant="outlined"
//       fullWidth
//       margin="normal"
//       value={number}
//       onChange={(e) => setNumber(e.target.value)}
//     />
//     <div style={{ display: "flex", justifyContent: "space-between" }}>
//       <div>
//         {deposit.map((item, index) => (
//           <div key={index}>
//             <TextField
//               label={`Deposit Amount (${item.date})`}
//               variant="outlined"
//               margin="normal"
//               value={item.amount}
//               onChange={(e) => handleDepositChange(index, "amount", e.target.value)}
//             />
//           </div>
//         ))}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => addDepositOrWithdraw("deposit")}
//         >
//           Add Deposit
//         </Button>
//       </div>
//       <div>
//         {withdraw.map((item, index) => (
//           <div key={index}>
//             <TextField
//               label={`Withdraw Amount (${item.date})`}
//               variant="outlined"
//               margin="normal"
//               value={item.amount}
//               onChange={(e) => handleWithdrawChange(index, "amount", e.target.value)}
//             />
//           </div>
//         ))}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => addDepositOrWithdraw("withdraw")}
//         >
//           Add Withdraw
//         </Button>
//       </div>
//     </div>
//     <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
//       <Button variant="contained" color="primary" onClick={handleSubmit}>
//         {editingUser ? "Update" : "Add"}
//       </Button>
//     </div>
//   </div>
// </Drawer>
