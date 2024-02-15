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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { rootDomain } from "../../API/API";
import { getMessInfoFromLocalHost } from "../../helperFunctions";
import { MealsApiResponse, UserInfo } from "../../Types";


const MealsDashboard: React.FC = () => {
  const [mealsData, setMealsData] = useState<MealsApiResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch meals data from the API
  useEffect(() => {
    const fetchMealsData = async () => {
      try {
        const messInfo = getMessInfoFromLocalHost();
        const response = await fetch(
          rootDomain + "/meal/getMealsByMessId/" + messInfo.mess_id
        );
        const data: MealsApiResponse = await response.json();
        setMealsData(data);
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
    let allUsersMeals = 0;

    const today = new Date().toISOString().split("T")[0];

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

    return (
      <>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Total Meals of All Users</Typography>
            <Typography variant="body2">
              Total Meals:{" "}
              {allUsersBreakfast / 2 + allUsersLunch + allUsersDinner} |
              Breakfast: {allUsersBreakfast} | Lunch: {allUsersLunch} | Dinner:{" "}
              {allUsersDinner}
            </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="h6">Today's Meals of All Users</Typography>
            <Typography variant="body2">
              Breakfast: {todayBreakfast} | Lunch: {todayLunch}| Dinner:{" "}
              {todayDinner}
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  };
  return (
    <div>
      {calculateTodayMeals(mealsData?.data?.users)}
      {/* <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Total Meals of All Users</Typography>
          <Typography variant="body2">
            Total Meals: {allUsersMeals} | Breakfast: {allUsersBreakfast} |
            Lunch: {allUsersLunch}| Dinner: {allUsersDinner}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="h6">Today's Meals of All Users</Typography>
        </CardContent>
      </Card> */}

      {mealsData?.data.users.map((user) => (
        <div key={user._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.name} </Typography>
            </CardContent>
          </Card>
          <Accordion>
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
