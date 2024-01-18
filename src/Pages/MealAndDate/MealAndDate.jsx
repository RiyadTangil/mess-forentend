// MealAndDate.js (React Component)
import React, { useState, useEffect } from "react";
import "./MealAndDate.css"; // Import the CSS file

const MealAndDate = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [userChoices, setUserChoices] = useState({});
  const [previousMyDates, setMyDates] = useState([]);
  const [dataBase, setDataBase] = useState([]);
  const [rqsId, setRqsId] = useState(0);
  const userIDs = [1, 2, 3, 4];
  const currentUserId = userIDs[0];
  useEffect(() => {
    const storedDates = JSON.parse(localStorage.getItem("previousDates")) || [];
    const myStoredData = storedDates.filter(
      (info) => info.id === currentUserId
    );
    setMyDates(myStoredData);

    setDataBase(storedDates);
  }, []);

  const handleCheckboxChange = (meal) => {
    setUserChoices((prevChoices) => ({
      ...prevChoices,
      [meal]: !prevChoices[meal],
    }));
  };

  useEffect(() => {
    const storedDates = JSON.parse(localStorage.getItem("previousDates")) || [];
    const myStoredData = storedDates.filter(
      (info) => info.id === currentUserId
    );
    setMyDates(myStoredData);
    setDataBase(storedDates);
    // Check if there is stored data for the current date and prefill checkboxes
    const currentDateEntry = myStoredData.find((entry) => entry.date === date);
    if (currentDateEntry) {
      setUserChoices(currentDateEntry.choices);
    } else {
      setUserChoices({});
    }
  }, [date]);
  const handleExistingDataUpdate = (existingDateIndex, newChoice = {}) => {
    const updatedDates = [...previousMyDates];
    updatedDates[existingDateIndex] = {
      date,
      choices: userChoices,
      newChoice,
      id: updatedDates[existingDateIndex].id,
    };

    setMyDates(updatedDates);
    const existingDatabaseIndex = dataBase.findIndex(
      (entry) => entry.date === date && entry.id === currentUserId
    );
    const updatedDatabaseDates = [...dataBase];
    updatedDatabaseDates[existingDatabaseIndex] = {
      date,
      choices: userChoices,
      newChoice,
      id: updatedDatabaseDates[existingDatabaseIndex].id,
    };

    localStorage.setItem("previousDates", JSON.stringify(updatedDatabaseDates));
    setDate(new Date().toISOString().slice(0, 10));
  };
  const handleSave = () => {
    const existingDateIndex = previousMyDates.findIndex(
      (entry) => entry.date === date
    );

    if (existingDateIndex !== -1) {
      // Date already exists, update the entry
      handleExistingDataUpdate(existingDateIndex);
    } else {
      // Date does not exist, add a new entry
      // const uniqueId = `${new Date().getTime()}-${Math.random()}`;
      const newUserChoice = {
        date,
        choices: userChoices,
        id: currentUserId,
        newChoice: {},
      };

      setDataBase((prevDates) => [...prevDates, newUserChoice]);
      setMyDates((prevDates) => [...prevDates, newUserChoice]);

      localStorage.setItem(
        "previousDates",
        JSON.stringify([...dataBase, newUserChoice])
      );
      setDate(new Date().toISOString().slice(0, 10));
    }

    // setUserChoices({});
  };

  const changeRequest = (info) => {
    setUserChoices(info.choices);
    setDate(info.date);

    setRqsId(info.id);
    // console.log(info);
  };

  const handleUpdate = () => {
    const existingDateIndex = previousMyDates.findIndex(
      (entry) => entry.id === rqsId
    );
    const updatingUserChoice = userChoices;
    setUserChoices(crnDateInfo.choices);
    const crnDateInfo = previousMyDates[0];
    handleExistingDataUpdate(existingDateIndex, updatingUserChoice);
    setDate(crnDateInfo.date);
    setRqsId(0);
  };

  return (
    <div className="meal-container">
      <div className="card">
        <h1 className="header">Place Mealand  {currentUserId}</h1>
        <p className="date">Date: {date}</p>
        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={userChoices.breakfast || false}
              onChange={() => handleCheckboxChange("breakfast")}
            />
            Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              checked={userChoices.lunch || false}
              onChange={() => handleCheckboxChange("lunch")}
            />
            Lunch
          </label>
          <label>
            <input
              type="checkbox"
              checked={userChoices.dinner || false}
              onChange={() => handleCheckboxChange("dinner")}
            />
            Dinner
          </label>
        </div>
        <button
          className="save-btn"
          onClick={rqsId ? handleUpdate : handleSave}
        >
          {rqsId ? "Update" : " Save"}
        </button>
      </div>

      <div className="table-container">
        <h2>Previous Dates</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th>Request To change</th>
            </tr>
          </thead>
          <tbody>
            {previousMyDates.map((info) => (
              <tr key={info.id}>
                <td>{info.date}</td>
                <td>{info.choices.breakfast ? "X" : "-"}</td>
                <td>{info.choices.lunch ? "X" : "-"}</td>
                <td>{info.choices.dinner ? "X" : "-"}</td>
                <td>
                  {Object.keys(info?.newChoice).length}
                  <button onClick={() => changeRequest(info)}>Request</button>
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
