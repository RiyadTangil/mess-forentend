import React, { useState, useEffect } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box, Divider } from "@mui/material";
import toast from "react-hot-toast";
import { getMessInfoFromLocalHost } from "../../helperFunctions";
import { rootDomain } from "../../API/API";

interface User {
  _id: string;
  name: string;
  id: string;
}

interface Expenditure {
  _id: string;
  desc: string;
  amount: number;
  user: { name: string };
}

const Expenditures: React.FC = () => {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] =
    useState<Expenditure | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const messInfo = getMessInfoFromLocalHost();
    const fetchExpenditures = async () => {
      try {
        const response = await axios.get(
          rootDomain + "/expenditure/getExpenditureByMessId/" + messInfo.mess_id
        );
        setExpenditures(response.data.data.expenditures);
        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching expenditures:", error);
      }
    };

    fetchExpenditures();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        rootDomain + "/expenditure/create-expenditure",
        {
          desc,
          amount: +amount,
          user: selectedUser?.id,
          mess: "65d39197e6b84074f4a52c3e", // Hardcoded for now, replace with actual mess ID
        }
      );
      toast.success("Expenditure submitted successfully");
      setDrawerOpen(false);
      setDesc("");
      setAmount("");
      setExpenditures([...expenditures, response.data.data]);
    } catch (error) {
      console.error("Error submitting expenditure:", error);
      toast.error("Failed to submit expenditure");
    }
  };

  const handleEdit = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedExpenditure) return;
    const payload = {
      desc: selectedExpenditure.desc,
      amount: +selectedExpenditure.amount,
    };
    try {
      const response = await axios.patch(
        rootDomain + `/expenditure/${selectedExpenditure._id}`,
        payload
      );
      const updatedExpenditure = response.data.data;
      const updatedExpenditures = expenditures.map((exp) =>
        exp._id === updatedExpenditure._id ? { ...exp, ...payload } : exp
      );
      setExpenditures(updatedExpenditures);
      toast.success("Expenditure updated successfully");
      setModalOpen(false);
      setSelectedExpenditure(null);
    } catch (error) {
      console.error("Error updating expenditure:", error);
      toast.error("Failed to update expenditure");
    }
  };

  const totalExpenditure = expenditures.reduce(
    (total, exp) => total + exp.amount,
    0
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100vw" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Add Expenditure
          </Button>
        </Box>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: "70vw", padding: 2 }}>
            <h2>Add Expenditure</h2>
            <Autocomplete
              value={selectedUser}
              onChange={(event, newValue) => setSelectedUser(newValue)}
              options={users}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Select User" />
              )}
            />
            <TextField
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Drawer>
        <h2>Expenditure List</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenditures.map((expenditure) => (
              <tr key={expenditure._id}>
                <td>{expenditure.desc}</td>
                <td>{expenditure.amount}</td>
                <td>{expenditure.user.name}</td>
                <td>
                  <Button onClick={() => handleEdit(expenditure)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80vw",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2>Edit Expenditure</h2>
            <TextField
              label="Description"
              value={selectedExpenditure?.desc}
              onChange={(e) =>
                setSelectedExpenditure({
                  ...selectedExpenditure!,
                  desc: e.target.value,
                })
              }
            />
            <TextField
              label="Amount"
              type="number"
              value={selectedExpenditure?.amount}
              onChange={(e) =>
                setSelectedExpenditure({
                  ...selectedExpenditure!,
                  amount: parseInt(e.target.value),
                })
              }
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" onClick={handleUpdate}>
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ marginTop: "20px" }}>
          <h2>Total Expenditure: {totalExpenditure}</h2>
        </Box>
      </div>
    </div>
  );
};

export default Expenditures;
