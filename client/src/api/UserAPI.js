import Axios from "axios";
import { useState, useEffect } from "react";

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await Axios.get("/user/info", {
            headers: { Authorization: token },
          });
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) return alert("please login to continue buying");

    const check = cart.every((item) => {
      return item._id !== product._id;
    });
    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await Axios.patch(
        "/user/addCart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );

      alert("product added to cart");
    } else {
      alert("this product already in your cart");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
};

export default UserAPI;
