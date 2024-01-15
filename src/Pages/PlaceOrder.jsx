// src/components/PlaceOrder.js
/* eslint no-use-before-define: 0 */ // --> OFF
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./placeOrder.css"; // Import the CSS file
const Modal = ({ isOpen, onClose, onSave, mealChoices, onCheckboxChange }) => {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h2>Edit Meal Choices</h2>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={mealChoices.breakfast}
              onChange={() => onCheckboxChange("breakfast")}
            />
            Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              checked={mealChoices.lunch}
              onChange={() => onCheckboxChange("lunch")}
            />
            Lunch
          </label>
          <label>
            <input
              type="checkbox"
              checked={mealChoices.dinner}
              onChange={() => onCheckboxChange("dinner")}
            />
            Dinner
          </label>
        </div>
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [mealChoices, setMealChoices] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);

  const handleCheckboxChange = (mealType) => {
    setMealChoices((prevChoices) => ({
      ...prevChoices,
      [mealType]: !prevChoices[mealType],
    }));
  };

  const handleSaveOrder = () => {
    const uniqueId = `${new Date().toISOString()} - ${Math.random()}`;
    const orderData = {
      id: uniqueId,
      date: new Date().toLocaleDateString(),
      choices: mealChoices,
    };

    // Save order to local storage
    const storedOrders = JSON.parse(localStorage.getItem("mealOrders")) || [];
    storedOrders.push(orderData);
    localStorage.setItem("mealOrders", JSON.stringify(storedOrders));

    // Update previousOrders state for display
    setPreviousOrders([...storedOrders]);
    // Reset mealChoices
    setMealChoices({
      breakfast: false,
      lunch: false,
      dinner: false,
    });
  };

  const handleEditOrder = (id, index) => {
    setIsModalOpen(true);
    setSelectedOrderId(id);
    // Find the order in local storage by id
    const storedOrders = JSON.parse(localStorage.getItem("mealOrders")) || [];
    const orderToEdit = storedOrders.find((order) => order.id === id);

    if (orderToEdit) {
      // Set mealChoices state with the saved choices for editing
      setMealChoices({ ...orderToEdit.choices });

      // Remove the order from local storage
      const updatedOrders = storedOrders.filter((order) => order.id !== id);

      // Update the existing order with new choices
      orderToEdit.choices = mealChoices;

      // Add the updated order back to the array
      storedOrders[index] = orderToEdit;
      //   updatedOrders.push(orderToEdit);

      // Save the updated orders to local storage
      localStorage.setItem("mealOrders", JSON.stringify(storedOrders));

      // Update previousOrders state for display
      setPreviousOrders([...storedOrders]);
    }
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    const storedOrders = JSON.parse(localStorage.getItem('mealOrders')) || [];
    const updatedOrders = storedOrders.map((order) =>
      order.id === selectedOrderId
        ? { ...order, choices: mealChoices }
        : order
    );
    localStorage.setItem('mealOrders', JSON.stringify(updatedOrders));
    setPreviousOrders([...updatedOrders]);
    setMealChoices({
      breakfast: false,
      lunch: false,
      dinner: false,
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch previous orders from local storage on component mount
    const storedOrders = JSON.parse(localStorage.getItem("mealOrders")) || [];
    setPreviousOrders([...storedOrders]);
  }, []);

  return (
    <div className="place-order-container">
      <h1>Place Your Order</h1>
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={mealChoices.breakfast}
            onChange={() => handleCheckboxChange("breakfast")}
          />
          Breakfast
        </label>
        <label>
          <input
            type="checkbox"
            checked={mealChoices.lunch}
            onChange={() => handleCheckboxChange("lunch")}
          />
          Lunch
        </label>
        <label>
          <input
            type="checkbox"
            checked={mealChoices.dinner}
            onChange={() => handleCheckboxChange("dinner")}
          />
          Dinner
        </label>
      </div>
      <button onClick={handleSaveOrder}>Save Order</button>

      <h2>Previous Orders</h2>
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
          {previousOrders.map((order, index) => (
            <tr key={order.id}>
              <td>{order.date}</td>
              <td>{order.choices.breakfast ? "Yes" : "No"}</td>
              <td>{order.choices.lunch ? "Yes" : "No"}</td>
              <td>{order.choices.dinner ? "Yes" : "No"}</td>
              <td>
                {order.date === new Date().toLocaleDateString() && (
                  <button onClick={() => handleEditOrder(order.id, index)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        mealChoices={mealChoices}
        onCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  mealChoices: PropTypes.object.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};
export default PlaceOrder;
