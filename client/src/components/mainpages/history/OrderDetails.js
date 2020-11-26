import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

const OrderDetails = () => {
  const state = useContext(GlobalState);
  const [history] = state.UserAPI.history;
  const [token] = state.token;
  const [isAdmin] = state.UserAPI.isAdmin;
  const [orderDetails, setOrderDetails] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  const changeStatus = async () => {
    if (isAdmin) {
      await axios.put(
        `/api/modifyOrder/${params.id}`,
        {
          status: "Delivered",
        },
        {
          headers: { Authorization: token },
        }
      );
    }
  };

  if (orderDetails.length === 0) return null;
  return (
    <div className="history_page">
      {orderDetails.shipping ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Postal Code</th>
              <th>Country Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{orderDetails.shipping.name}</td>
              <td>
                {orderDetails.shipping.address.line1 +
                  " - " +
                  orderDetails.shipping.address.city}
              </td>
              <td>{orderDetails.shipping.address.postal_code}</td>
              <td>{orderDetails.shipping.address.country}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
      {orderDetails.shipping ? (
        orderDetails.status === "Pending Delivery" ? (
          <div>
            <h4 style={{ color: "orange" }}>{orderDetails.status}</h4>
            {isAdmin ? (
              <form onSubmit={changeStatus}>
                <button type="submit">Delivered</button>
              </form>
            ) : null}
          </div>
        ) : (
          <h4 style={{ color: "#00cc00" }}>{orderDetails.status}</h4>
        )
      ) : null}
      <table style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity</th>
            <th>{orderDetails.shipping ? "Price" : "Status"}</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>
                {orderDetails.shipping
                  ? "$ " + item.price
                  : orderDetails.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
