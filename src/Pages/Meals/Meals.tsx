import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Drawer,
  TextField,
  Button,
  Snackbar,
  Typography,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { rootDomain } from "../../API/API";
import { getMessInfoFromLocalHost, getToday } from "../../helperFunctions";
import { Expenditure, MealsApiResponse, UserInfo } from "../../Types";
import axios from "axios";
import toast from "react-hot-toast";

const MealsDashboard: React.FC = () => {
  const [mealsData, setMealsData] = useState<MealsApiResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messInfo, setMessInfo] = useState(getMessInfoFromLocalHost());
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [todayMealInfo, setTodayMealInfo] = useState({
    breakFast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [totalMealInfo, setTotalMealInfo] = useState({
    breakFast: 0,
    lunch: 0,
    dinner: 0,
  });

  // Fetch meals data from the API
  useEffect(() => {
    const fetchMealsData = async () => {
      try {
        const response = await fetch(
          rootDomain + "/meal/getMealsByMessId/" + messInfo.mess_id
        );
        const data: MealsApiResponse = await response.json();
        setMealsData(data);
        calculateTodayMeals(data?.data?.users);
      } catch (error) {
        console.error("Error fetching meals data:", error);
      }
    };

    fetchMealsData();
  }, []);

  const handleEditButtonClick = (user: UserInfo) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleUpdateMealInfo = async () => {
    // Implement your API call to update meal info here
    setDrawerOpen(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const calculateTotalMeals = (meals: UserInfo["meals"]) => {
    let totalMeals = 0;
    let totalBreakfast = 0;
    let totalLunch = 0;
    let totalDinner = 0;

    for (const meal of meals) {
      totalMeals +=
        meal.choices.breakfast * 0.5 + meal.choices.lunch + meal.choices.dinner;
      totalBreakfast += meal.choices.breakfast;
      totalLunch += meal.choices.lunch;
      totalDinner += meal.choices.dinner;
    }

    return (
      <>
        <Typography variant="body2">
          Breakfast: {totalBreakfast} | Lunch: {totalLunch} | Dinner:{" "}
          {totalDinner} | Total Meals: {totalMeals}
        </Typography>
      </>
    );
  };
  const calculateTodayMeals = (users: UserInfo[] | undefined) => {
    if (!users) return null;
    let todayBreakfast = 0;
    let todayLunch = 0;
    let todayDinner = 0;
    let allUsersBreakfast = 0;
    let allUsersLunch = 0;
    let allUsersDinner = 0;

    const today = getToday();

    for (const user of users) {
      for (const meal of user.meals) {
        if (meal.date === today) {
          todayBreakfast += meal.choices.breakfast;
          todayLunch += meal.choices.lunch;
          todayDinner += meal.choices.dinner;
        }
        allUsersBreakfast += meal.choices.breakfast;
        allUsersLunch += meal.choices.lunch;
        allUsersDinner += meal.choices.dinner;
      }
    }
    setTodayMealInfo({
      breakFast: todayBreakfast,
      lunch: todayLunch,
      dinner: todayDinner,
    });
    setTotalMealInfo({
      breakFast: allUsersBreakfast,
      lunch: allUsersLunch,
      dinner: allUsersDinner,
    });
  };
  const handleMealRate = async () => {
    setLoading(true);
    console.log(mealsData?.data);
    const totalExpenditure = mealsData?.data.expenditures.reduce(
      (total, exp) => total + exp.amount,
      0
    );
    const totalMeal =
      totalMealInfo.breakFast / 2 + totalMealInfo.lunch + totalMealInfo.dinner;
    try {
      const response = await axios.patch(
        rootDomain + "/mess/" + messInfo.mess_id,
        {
          meal_rate: +(totalExpenditure / totalMeal).toFixed(2),
        }
      );
      toast.success("Data updated successfully");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card sx={{ mb: 1, borderRadius: "16px" }}>
        <CardContent>
          <Typography variant="p">আজকে মোট মিল হবে</Typography>
          <Typography variant="body2">
            মোট মিল{" "}
            {todayMealInfo.breakFast / 2 +
              todayMealInfo.lunch +
              todayMealInfo.dinner}{" "}
            | সকাল : {todayMealInfo.breakFast} | দুপুর: {todayMealInfo.lunch} |
            রাত: {todayMealInfo.dinner}
          </Typography>
        </CardContent>
      </Card>

      {mealsData?.data.users.map((user) => (
        <div key={user._id} style={{ marginBottom: "8px" }}>
          <Card style={{ borderRadius: "16px 16px 0px 0px" }}>
            <CardContent style={{ padding: 6 }}>
              <Typography variant="h6">{user.name} </Typography>
            </CardContent>
          </Card>
          <Accordion style={{ borderRadius: " 0px 0px 16px 16px" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {calculateTotalMeals(user.meals)}
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Breakfast</TableCell>
                    <TableCell>Lunch</TableCell>
                    <TableCell>Dinner</TableCell>
                    {/* <TableCell>Action</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.meals.map((meal) => (
                    <TableRow key={meal.date}>
                      <TableCell>{meal.date}</TableCell>
                      <TableCell>{meal.choices.breakfast}</TableCell>
                      <TableCell>{meal.choices.lunch}</TableCell>
                      <TableCell>{meal.choices.dinner}</TableCell>
                      {/* <TableCell>
                        <IconButton onClick={() => handleEditButtonClick(user)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
      <Card sx={{ mt: 1, borderRadius: "16px" }}>
        <CardContent>
          <Typography variant="h6">Total Meals of All Users </Typography>

          <Typography variant="body2">
            Total Meals:{" "}
            {totalMealInfo.breakFast / 2 +
              totalMealInfo.lunch +
              totalMealInfo.dinner}{" "}
            | Breakfast: {totalMealInfo.breakFast} | Lunch:{" "}
            {totalMealInfo.lunch} | Dinner: {totalMealInfo.dinner}
            <Button
              size="small"
              variant="outlined"
              onClick={handleMealRate}
              // variant="text"
              disabled={loading}
              endIcon={<UpdateIcon />}
            >
              Meal Rate {mealsData?.data?.meal_rate}
            </Button>
          </Typography>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div>
          <Typography variant="h6" gutterBottom>
            Edit Meal Info
          </Typography>
          <TextField
            label="Breakfast"
            value={selectedUser?.meals[0]?.choices.breakfast || ""}
            fullWidth
          />
          <TextField
            label="Lunch"
            value={selectedUser?.meals[0]?.choices.lunch || ""}
            fullWidth
          />
          <TextField
            label="Dinner"
            value={selectedUser?.meals[0]?.choices.dinner || ""}
            fullWidth
          />
          <Button variant="contained" onClick={handleUpdateMealInfo}>
            Update
          </Button>
        </div>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Meal info updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MealsDashboard;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// export default MealsDashboard;
