import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MealAndDate.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Table from "../../Components/Table/Table";
const MealAndDate = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [userChoices, setUserChoices] = useState({});
  const [previousMyDates, setMyDates] = useState([]);

  const [rqsId, setRqsId] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const [messId, setMessId] = useState();

  useEffect(() => {
    const messInfo = JSON.parse(localStorage.getItem("messInfo")) || {};
    setCurrentUserId(messInfo.userId);
    setMessId(messInfo.mess_id);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/meal/${messInfo.userId}`
        );

        setMyDates(response.data.data.meals ?? []);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, [reload, currentUserId]);

  const handleIncrement = (meal) => {
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [meal]: prevChoices[meal] ? prevChoices[meal] + 1 : 1,
    }));
  };

  const handleDecrement = (meal) => {
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
      setUserChoices({});
    }
  }, [date, previousMyDates]);

  const handleExistingDataUpdate = async (mealId, newChoice = {}) => {
    // setMyDates(updatedDates);

    await axios.patch(`http://localhost:5000/api/v1/meal/${mealId}`, {
      choices: userChoices,
    });
    setReload(!reload);
    setDate(new Date().toISOString().slice(0, 10));
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

      await axios.post(
        `http://localhost:5000/api/v1/meal/create-meal`,
        newUserChoice
      );
      setMyDates((prevDates) => [...prevDates, newUserChoice]);
      setReload(!reload);
      setDate(new Date().toISOString().slice(0, 10));
    }

    setUserChoices({});
  };

  const changeRequest = (info) => {
    setUserChoices(info.choices);
    setDate(info.date);
    setRqsId(info.id);
  };

  const handleUpdate = async () => {
    const updatingUserChoice = userChoices;
    const lastIdx = previousMyDates.length - 1;
    setUserChoices(previousMyDates[lastIdx]?.choices);

    await handleExistingDataUpdate(rqsId, updatingUserChoice);

    setDate(previousMyDates[lastIdx]?.date);
    setRqsId(0);
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
  const header = ["Date", "Breakfast", "Lunch", "Dinner"];
  return (
    <div className="meal-container">
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
      {/* <Table
        title={"Previous Dates"}
        headers={header}
        data={previousMyDates}
        onEdit={changeRequest}
      /> */}
      <div className="table-container table-card">
        <h2>Previous Dates</h2>
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
                  {/* {Object.keys(info?.newChoice)?.length} */}
                  <button onClick={() => changeRequest(info)}>
                    {" "}
                    Edit Request
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

export default MealAndDate;
