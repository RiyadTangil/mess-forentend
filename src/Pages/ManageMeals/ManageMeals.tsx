import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getMessInfoFromLocalHost, getToday } from "../../helperFunctions";
import { rootDomain } from "../../API/API";

import ArrowUpwardIcon from "@mui/icons-material/ExpandLess";
import ArrowDownwardIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";

interface User {
  _id: string;
  name: string;
}

interface Meal {
  choices: Record<string, number>;
  _id: string;
  date: string;
  user: string;
  mess: string;
}

interface MessData {
  _id: string;
  users: User[];
  meals: Meal[];
}

const ManageMeals: React.FC = () => {
  const [messData, setMessData] = useState<MessData | null>(null);
  const [usersWhoseMealsFound, setUsersWhoseMealsFound] = useState<
    Record<string, string>
  >({});
  const [mealChoices, setMealChoices] = useState<
    Record<string, Meal["choices"]>
  >({});
  const [selectedDate, setSelectedDate] = useState<string>(getToday());

  useEffect(() => {
    const fetchMessData = async () => {
      try {
        const messInfo = getMessInfoFromLocalHost();
        if (!messInfo) throw new Error("Mess ID not found in localStorage");

        const response = await axios.get(
          rootDomain +
            `/meal/getMealsByMessIdAndDate/${messInfo.mess_id}?date=${selectedDate}`
        );
        const res = response.data.data;
        setMessData(res);
        const initialMealChoices: Record<string, Meal["choices"]> = {};
        const usersWhoseMealsExist: Record<string, string> = {};

        res.users.forEach((user) => {
          if (user.meals[0]?.choices)
            usersWhoseMealsExist[user._id] = user.meals[0]?._id;
          initialMealChoices[user._id] = user.meals[0]?.choices || {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
          };
        });
        setMealChoices(initialMealChoices);
        setUsersWhoseMealsFound(usersWhoseMealsExist);
      } catch (error) {
        console.error("Error fetching mess data", error);
        toast.error("Error fetching mess data");
      }
    };

    fetchMessData();
  }, [selectedDate]);

  const handleIncrement = (userId: string, mealType: keyof Meal["choices"]) => {
    setMealChoices((prevChoices) => ({
      ...prevChoices,
      [userId]: {
        ...prevChoices[userId],
        [mealType]: prevChoices[userId][mealType] + 1,
      },
    }));
  };

  const handleDecrement = (userId: string, mealType: keyof Meal["choices"]) => {
    setMealChoices((prevChoices) => ({
      ...prevChoices,
      [userId]: {
        ...prevChoices[userId],
        [mealType]:
          prevChoices[userId][mealType] > 0
            ? prevChoices[userId][mealType] - 1
            : 0,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      toast.loading("Submitting meal choices...");
      const requests = Object.entries(mealChoices).map(
        async ([userId, mealChoice]) => {
          if (Object.keys(usersWhoseMealsFound).includes(userId)) {
            await axios.patch(
              rootDomain + `/meal/${usersWhoseMealsFound[userId]}`,
              {
                choices: mealChoice,
                date: selectedDate,
              }
            );
          } else {
            await axios.post(rootDomain + "/meal/create-meal", {
              date: selectedDate,
              choices: mealChoice,
              user: userId,
              mess: messData?._id,
            });
          }
        }
      );
      await Promise.all(requests);
      toast.success("Meal choices submitted successfully");
    } catch (error) {
      console.error("Error submitting meal choices", error);
      toast.error("Error submitting meal choices");
    } finally {
      toast.dismiss();
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("event.target.value => ", event.target.value);
    setSelectedDate(moment(event.target.value).format("DD-MM-YYYY"));
  };

  if (!messData) {
    return <div>Loading...</div>;
  }
  interface ActionButtonsProps {
    user: User;
    label: string;
  }
  const ActionButtons: React.FC<ActionButtonsProps> = ({ user, label }) => {
    return (
      <td>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {mealChoices[user._id][label]}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "5px",
            }}
          >
            <ArrowUpwardIcon onClick={() => handleIncrement(user._id, label)} />
            <ArrowDownwardIcon
              onClick={() => handleDecrement(user._id, label)}
            />
          </div>
        </div>
      </td>
    );
  };
  return (
    <div style={{fontSize:"12px"}}>
      <input type="date" onChange={handleDateChange} />
      <h2>{selectedDate}</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {messData.users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <ActionButtons user={user} label={"breakfast"} />
              <ActionButtons user={user} label={"lunch"} />
              <ActionButtons user={user} label={"dinner"} />
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ManageMeals;
