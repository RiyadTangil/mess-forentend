import moment from "moment";
import { UserInfo } from "../Types";

export const getMessInfoFromLocalHost = () => {
  const messInfoString = localStorage.getItem("messInfo");
  const messInfo = messInfoString ? JSON.parse(messInfoString) : {};

  return messInfo;
};
export const getToday = () => {
  let date = moment(new Date()).format("DD-MM-YYYY");
  // const today = new Date().toLocaleString().replace(/\//g, "-").split(",")[0];
  return date;
};
export const totalMealCounter = (users: UserInfo[]) => {
  let allUsersBreakfast = 0;
  let allUsersLunch = 0;
  let allUsersDinner = 0;

  for (const user of users) {
    for (const meal of user.meals) {
      allUsersBreakfast += meal.choices.breakfast;
      allUsersLunch += meal.choices.lunch;
      allUsersDinner += meal.choices.dinner;
    }
  }
  const totalMeal = allUsersBreakfast / 2 + allUsersLunch + allUsersDinner;

  return { totalMeal, allUsersBreakfast, allUsersLunch, allUsersDinner };
};
