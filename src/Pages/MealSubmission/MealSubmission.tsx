import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getMessInfoFromLocalHost } from "../../helperFunctions";

interface User {
  _id: string;
  name: string;
}

interface MealChoice {
  breakfast: number;
  lunch: number;
  dinner: number;
}

interface MessData {
  _id: string;
  users: User[];
}

const MealSubmission: React.FC = () => {
  const [messData, setMessData] = useState<MessData | null>(null);
  const [todayMealExistUsers, setTodayMealExistUsers] = useState<
    Record<string, string>
  >({});
  const [mealChoices, setMealChoices] = useState<Record<string, MealChoice>>(
    {}
  );

  useEffect(() => {
    const fetchMessData = async () => {
      try {
        const messInfo = getMessInfoFromLocalHost();
        if (!messInfo) throw new Error("Mess ID not found in localStorage");

        const response = await axios.get(
          `http://localhost:5000/api/v1/meal/getMealsByMessId/${messInfo.mess_id}`
        );
        const res = response.data.data;
        setMessData(res);
        const todayDate = new Date().toISOString().slice(0, 10);
        const initialMealChoices: Record<string, MealChoice> = {};
        res.users.forEach((user) => {
          if (user?.meals[0]?.date === todayDate) {
            setTodayMealExistUsers((prevID) => {
              return { ...prevID, [user._id]: user.meals[0]._id };
            });

            initialMealChoices[user._id] = user.meals[0].choices;
          } else {
            initialMealChoices[user._id] = {
              breakfast: 0,
              lunch: 0,
              dinner: 0,
            };
          }
        });
        setMealChoices(initialMealChoices);
      } catch (error) {
        console.error("Error fetching mess data", error);
        toast.error("Error fetching mess data");
      }
    };

    fetchMessData();
  }, []);

  const handleIncrement = (userId: string, mealType: keyof MealChoice) => {
    setMealChoices((prevChoices) => ({
      ...prevChoices,
      [userId]: {
        ...prevChoices[userId],
        [mealType]: prevChoices[userId][mealType] + 1,
      },
    }));
  };

  const handleDecrement = (userId: string, mealType: keyof MealChoice) => {
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
          if (todayMealExistUsers.hasOwnProperty(userId)) {
            await axios.patch(
              `http://localhost:5000/api/v1/meal/${todayMealExistUsers[userId]}`,
              { choices: mealChoice }
            );
          } else
            await axios.post("http://localhost:5000/api/v1/meal/create-meal", {
              date: new Date().toISOString().slice(0, 10),
              choices: mealChoice,
              user: userId,
              mess: messData?._id,
            });
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

  if (!messData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{new Date().toISOString().slice(0, 10)}</h2>
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
                <button onClick={() => handleDecrement(user._id, "breakfast")}>
                  -
                </button>
                {mealChoices[user._id].breakfast}
                <button onClick={() => handleIncrement(user._id, "breakfast")}>
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
