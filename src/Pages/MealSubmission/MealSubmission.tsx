import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getMessInfoFromLocalHost } from "../../helperFunctions";
import { rootDomain } from "../../API/API";

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

const MealSubmission: React.FC = () => {
  const [messData, setMessData] = useState<MessData | null>(null);
  const [mealChoices, setMealChoices] = useState<
    Record<string, Meal["choices"]>
  >({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

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
        res.users.forEach((user) => {
          initialMealChoices[user._id] = user.meals[0]?.choices || {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
          };
        });
        setMealChoices(initialMealChoices);
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
          const todayMeal = messData?.meals?.find(
            (meal) => meal.date === selectedDate && meal.user === userId
          );
          if (todayMeal) {
            await axios.patch(rootDomain + `/meal/${todayMeal._id}`, {
              choices: mealChoice,
            });
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
    setSelectedDate(event.target.value);
  };

  if (!messData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
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
              <td>
                <button style={{width:"5px",}} onClick={() => handleDecrement(user._id, "breakfast")}>
                  -
                </button>
                {mealChoices[user._id].breakfast}
                <button style={{width:"5px",}}  onClick={() => handleIncrement(user._id, "breakfast")}>
                  +
                </button>
              </td>
              <td>
                <button onClick={() => handleDecrement(user._id, "lunch")}>
                  -
                </button>
                {mealChoices[user._id].lunch}
                <button onClick={() => handleIncrement(user._id, "lunch")}>
                  +
                </button>
              </td>
              <td>
                <button onClick={() => handleDecrement(user._id, "dinner")}>
                  -
                </button>
                {mealChoices[user._id].dinner}
                <button onClick={() => handleIncrement(user._id, "dinner")}>
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default MealSubmission;
