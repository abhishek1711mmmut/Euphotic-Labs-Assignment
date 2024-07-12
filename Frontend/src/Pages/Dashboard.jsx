// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { getDishes, toggleDishStatus } from "../services/dishService";

const Dashboard = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await getDishes();
        setDishes(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchDishes();

    // Set up WebSocket connection
    const ws = new WebSocket(import.meta.env.VITE_REACT_APP_WS_URL); // Connect to WebSocket server on port 8080

    ws.onmessage = (event) => {
      const updatedDish = JSON.parse(event.data);
      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.dishId === updatedDish.dishId ? updatedDish : dish
        )
      );
    };

    return () => {
      ws.close(); // Clean up WebSocket connection on component unmount
    };
  }, []);

  const handleToggle = async (dishId) => {
    try {
      const updatedDish = await toggleDishStatus(dishId);
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.dishId === dishId ? updatedDish : dish))
      );
    } catch (err) {
      setError(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[90vh] justify-center items-center text-4xl italic text-blue-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error fetching dishes: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Dish Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-center">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="py-2">Dish ID</th>
              <th className="py-2">Dish Name</th>
              <th className="py-2">Image</th>
              <th className="py-2">Published</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes?.map((dish) => (
              <tr key={dish.dishId}>
                <td className="py-2 border-b">{dish?.dishId}</td>
                <td className="py-2 border-b">{dish?.dishName}</td>
                <td className="py-2 border-b">
                  <img
                    src={dish?.imageUrl}
                    alt={dish?.dishName}
                    className="max-w-[200px] bg-red-300 mx-auto h-auto"
                  />
                </td>
                <td className="py-2 border-b">
                  {dish?.isPublished ? "Yes" : "No"}
                </td>
                <td className="py-2 border-b">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleToggle(dish?.dishId)}
                  >
                    Toggle Status
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

export default Dashboard;
