import React, { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.UserAPI.isLogged;
  const [isAdmin] = state.UserAPI.isAdmin;
  const [cart] = state.UserAPI.cart;
  const [menu, setMenu] = useState(false);

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  const adminRouter = () => {
    return (
      <>
        <li onClick={() => setMenu(false)}>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li onClick={() => setMenu(false)}>
          <Link to="/category">Categories</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li onClick={() => setMenu(false)}>
          <Link to="/history">History</Link>
        </li>
        <li onClick={() => setMenu(false)}>
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };

  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    <header>
      <div className="menu" onClick={() => setMenu(true)}>
        <IconButton style={{ padding: 0 }}>
          <MenuRoundedIcon style={{ fontSize: 30, padding: 0 }} />
        </IconButton>
      </div>
      <div className="logo">
        <h1 onClick={() => setMenu(false)}>
          <Link to="/">{isAdmin ? "ADMIN" : "STORE"}</Link>
        </h1>
      </div>
      <ul style={styleMenu}>
        <li onClick={() => setMenu(false)}>
          <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
        </li>
        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li onClick={() => setMenu(false)}>
            <Link to="/login">Login/Register</Link>
          </li>
        )}

        <li className="menu" onClick={() => setMenu(false)}>
          <IconButton style={{ padding: 0 }}>
            <CloseRoundedIcon style={{ fontSize: 30 }} />
          </IconButton>
        </li>
      </ul>
      {isAdmin ? (
        ""
      ) : (
        <div className="cart_icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <ShoppingCartRoundedIcon style={{ fontSize: 30 }} />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
