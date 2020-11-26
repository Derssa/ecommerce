import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51HldDgCdZu5Yv0u0RtnK76zvZD8ADYxUA88THQHWJRIPvqxgmkR0TxcIWer35llBss2VzMX2HO0jbJxYKuYfSQfz0047RyB6be"
);

const Cart = () => {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.UserAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cart]);

  const addToCart = async () => {
    await axios.patch(
      "/user/addCart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    addToCart();
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    addToCart();
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addToCart();
    }
  };

  const handleClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await fetch("/user/payment", {
      method: "POST",
      headers: { Authorization: token },
    });

    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "4rem" }}>Cart Empty</h2>
    );
  return (
    <div className="allCart">
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />
          <div className="box_detail">
            <h2>{product.title}</h2>

            <span>${product.price * product.quantity}</span>
            <p>{product.description}</p>
            <p>{product.content}</p>
            <div className="amount">
              <button onClick={() => decrement(product._id)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}>+</button>
            </div>
            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="total">
        <h3>Total: ${total}</h3>
        <Link to="#!" onClick={handleClick}>
          Payment
        </Link>
      </div>
    </div>
  );
};

export default Cart;
