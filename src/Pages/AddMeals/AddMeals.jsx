import { useState, useEffect } from "react";
import axios from "axios";
import "./AddMeals.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { rootDomain } from "../../API/API";
import { Box } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

import { getMessInfoFromLocalHost, getToday } from "../../helperFunctions";
import toast from "react-hot-toast";
const AddMeals = () => {
  const initialChoice = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  };
  const [userChoices, setUserChoices] = useState(initialChoice);
  const [date, setDate] = useState(getToday());
  const [previousMyDates, setMyDates] = useState([]);

  const [rqsId, setRqsId] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const [messId, setMessId] = useState();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const messInfo = getMessInfoFromLocalHost();
    setCurrentUserId(messInfo.userId);

    setMessId(messInfo.mess_id);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          rootDomain + `/meal/${messInfo.userId}`
        );

        setMyDates(response.data.data.meals ?? []);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, [reload, currentUserId]);
  
  const restrictedTm = { dinner: "8 pm", breakfast: "8 am", lunch: "8 am" };
  const handleIncrement = (meal) => {
    const currentTime = new Date().getHours();
    if (
      (meal === "breakfast" && currentTime >= 8) ||
      (meal === "lunch" && currentTime >= 8) ||
      (meal === "dinner" && currentTime >= 18)
    ) {
      toast.error(`Cannot update ${meal} choice after ` + restrictedTm[meal]);
      return;
    }
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [meal]: prevChoices[meal] ? prevChoices[meal] + 1 : 1,
    }));
  };

  const handleDecrement = (meal) => {
    const currentTime = new Date().getHours();
    if (
      (meal === "breakfast" && currentTime >= 8) ||
      (meal === "lunch" && currentTime >= 8) ||
      (meal === "dinner" && currentTime >= 18)
    ) {
      toast.error(`Cannot update ${meal} choice after ` + restrictedTm[meal]);
      return;
    }
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [meal]:
        prevChoices[meal] && prevChoices[meal] > 0 ? prevChoices[meal] - 1 : 0,
    }));
  };

  useEffect(() => {
    const currentDateEntry = previousMyDates.find(
      (entry) => entry.date === date
    );
    if (currentDateEntry) {
      setUserChoices(currentDateEntry.choices);
    } else {
      setUserChoices(initialChoice);
    }
  }, [date, previousMyDates]);

  // newChoice = {}
  const handleExistingDataUpdate = async (mealId) => {
    // setMyDates(updatedDates);
    toast.loading("Submitting meal choices...");
    await axios.patch(rootDomain + `/meal/${mealId}`, {
      choices: userChoices,
    });
    toast.dismiss();
    toast.success("Meal choices submitted successfully");
    setReload(!reload);
    setDate(getToday());
  };

  const handleSave = async () => {
    
    const isItemExist = previousMyDates.find((entry) => entry.date === date);

    if (isItemExist) {
      // Date already exists, update the entry
      await handleExistingDataUpdate(isItemExist._id);
    } else {
      // Date does not exist, add a new entry
      const newUserChoice = {
        date,
        choices: userChoices,
        user: currentUserId,
        mess: messId,
      };
      toast.loading("Submitting meal choices...");
      await axios.post(rootDomain + `/meal/create-meal`, newUserChoice);
      toast.success("Meal choices submitted successfully");
      toast.dismiss();
      setMyDates((prevDates) => [...prevDates, newUserChoice]);
      setReload(!reload);
      setDate(getToday());
    }

    setUserChoices(initialChoice);
    toggleDrawer();
  };

  const changeRequest = (info) => {
    setUserChoices(info.choices);
    setDate(info.date);
    setRqsId(info.id);
    toggleDrawer();
  };

  const handleUpdate = async () => {
    const updatingUserChoice = userChoices;
    const lastIdx = previousMyDates.length - 1;
    setUserChoices(previousMyDates[lastIdx]?.choices);

    await handleExistingDataUpdate(rqsId, updatingUserChoice);

    setDate(previousMyDates[lastIdx]?.date);
    setRqsId(0);
    toggleDrawer();
  };
  const MealInput = (label) => {
    return (
      <>
        <div>
          <label>
            <CheckCircleIcon style={{ marginRight: "10px" }} />
            {label}
          </label>
          <button className="minus-btn" onClick={() => handleDecrement(label)}>
            -
          </button>
          <span>{userChoices[label]}</span>
          <button className="plus-btn" onClick={() => handleIncrement(label)}>
            +
          </button>
        </div>
      </>
    );
  };

 
  const DrawerContent = () => (
    <div className="drawer-content">
      <div className="card">
        <p className="header">Place Meal and Date</p>
        <p className="date">Date: {date}</p>
        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
          <Button
            variant="text"
            className="cancel-btn"
            onClick={toggleDrawer}
          >
            <CancelIcon />
          </Button>
        </Box>
        <div className="checkboxes">
          {["breakfast", "lunch", "dinner"].map((label) => MealInput(label))}
        </div>
        <Button
          className="save-btn"
          onClick={rqsId ? () => handleUpdate() : () => handleSave()}
        >
          {rqsId ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
  

  return (
    <div className="meal-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px",
          width: "100%",
        }}
      >
        <Button variant="contained" onClick={toggleDrawer}>
          Add Meal
        </Button>
      </Box>

      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
        <DrawerContent />
      </Drawer>

      <div className="table-container table-card">
        <h2 className="table-header">Previous Dates</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {previousMyDates.map((info) => (
              <tr key={info.id}>
                <td>{info.date}</td>
                <td>
                  {info?.choices?.breakfast > 0
                    ? info?.choices?.breakfast
                    : "X"}
                </td>
                <td>{info?.choices?.lunch > 0 ? info?.choices?.lunch : "X"}</td>
                <td>
                  {info?.choices?.dinner > 0 ? info?.choices?.dinner : "X"}
                </td>
                <td>
                  <button
                    disabled={date !== info.date ? true : false}
                    onClick={() => changeRequest(info)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddMeals;