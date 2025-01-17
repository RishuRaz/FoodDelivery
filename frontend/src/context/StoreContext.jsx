import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const url = "https://food-del-backend-6y2z.onrender.com";

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    try {
      if (token) {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) updatedCart[itemId] -= 1;
      else delete updatedCart[itemId];
      return updatedCart;
    });

    try {
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, count]) => {
      const item = food_list.find((product) => product._id === itemId);
      return item ? total + item.price * count : total;
    }, 0);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: authToken } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
