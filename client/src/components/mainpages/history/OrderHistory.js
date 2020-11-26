import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import Axios from "axios";

const OrderHistory = () => {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.UserAPI.history;
  const [isAdmin] = state.UserAPI.isAdmin;
  const [token] = state.token;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const res = await Axios.get("/api/orders", {
            headers: { Authorization: token },
          });
          setHistory(res.data.orders);
        } else {
          const res = await Axios.get("/api/order", {
            headers: { Authorization: token },
          });
          setHistory(res.data.order);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);

  return (
    <div className="history_page">
      <h2>History</h2>
      <h4>You have {history.length} orders</h4>
      <div>
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date of purchase</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((items) => (
              <tr key={items._id}>
                <td>{items.orderid}</td>
                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/history/${items._id}`}>view</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
