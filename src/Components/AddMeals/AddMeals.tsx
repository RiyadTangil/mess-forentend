import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddMeals.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { rootDomain } from "../../API/API";
import { Box } from "@mui/material";
import { UserInfo } from "../../Types";

interface MealAndDateProps {
  handleEditRequest: () => void;
  userId: string;
  info: UserInfo["meals"] | null; 
  previousMyDates:any
  setMyDates:any
}

const MealAndDate: React.FC<MealAndDateProps> = ({
  handleEditRequest,
  info,
  userId,
}) => {
  const initialChoice = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  };
  const [date, setDate] = useState<string>(
    new Date().toLocaleString().replace(/\//g, '-').slice(0, 10)
  );
  const [userChoices, setUserChoices] = useState(initialChoice);
  const [previousMyDates, setMyDates] = useState<any[]>([]); // Replace 'any' with the type of 'previousMyDates'

  const [rqsId, setRqsId] = useState<number>(0);
  const [reload, setReload] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [messId, setMessId] = useState<string>();
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const messInfoString = localStorage.getItem("messInfo");
    if (messInfoString) {
      const messInfo = JSON.parse(messInfoString);
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
    }
  }, [reload, currentUserId]);

  const handleIncrement = (meal: string) => {
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [meal]: prevChoices[meal] ? prevChoices[meal] + 1 : 1,
    }));
  };

  const handleDecrement = (meal: string) => {
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

  const handleExistingDataUpdate = async (mealId: number) => {
    await axios.patch(rootDomain + `/meal/${mealId}`, {
      choices: userChoices,
    });
    setReload(!reload);
    setDate(new Date().toLocaleString().replace(/\//g, '-').slice(0, 10));
  };

  const handleSave = async () => {
    const isItemExist = previousMyDates.find((entry) => entry.date === date);

    if (isItemExist) {
      await handleExistingDataUpdate(isItemExist._id);
    } else {
      const newUserChoice = {
        date,
        choices: userChoices,
        user: currentUserId,
        mess: messId,
      };

      await axios.post(rootDomain + `/meal/create-meal`, newUserChoice);
      setMyDates((prevDates) => [...prevDates, newUserChoice]);
      setReload(!reload);
      setDate(new Date().toLocaleString().replace(/\//g, '-').slice(0, 10));
    }

    setUserChoices(initialChoice);
    toggleDrawer();
  };

  const changeRequest = (info: any) => {
    setUserChoices(info.choices);
    setDate(info.date);
    setRqsId(info.id);
    toggleDrawer();
  };

  useEffect(() => {
    if (info) {
      setUserChoices(info.choices);
      setDate(info.date);
      setRqsId(info.id);
      toggleDrawer();
    }
  }, [info]);

  // handleEditRequest();

  const handleUpdate = async () => {
    const updatingUserChoice = userChoices;
    const lastIdx = previousMyDates.length - 1;
    setUserChoices(previousMyDates[lastIdx]?.choices);

    await handleExistingDataUpdate(rqsId);
    setDate(previousMyDates[lastIdx]?.date);
    setRqsId(0);
    toggleDrawer();
  };

  const MealInput = (label: string) => (
    <div key={label}>
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
  );

  const DrawerContent = () => (
    <div className="drawer-content">
      <div className="card">
        <h1 className="header">Place Meal and Date</h1>
        <p className="date">Date: {date}</p>
        <div className="checkboxes">
          {["breakfast", "lunch", "dinner"].map((label) => MealInput(label))}
        </div>
        <button
          className="save-btn"
          onClick={rqsId ? () => handleUpdate() : () => handleSave()}
        >
          {rqsId ? "Update" : " Save"}
        </button>
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
    </div>
  );
};

export default MealAndDate;
