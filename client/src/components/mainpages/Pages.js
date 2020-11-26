import React from "react";
import Login from "./auth/Login";
import Cart from "./cart/Cart";
import Products from "./products/Products";
import { Switch, Route } from "react-router-dom";
import Register from "./auth/Register";
import NotFound from "./utils/notFound/NotFound";
import DetailProduct from "./detailProduct/DetailProduct";
import { useContext } from "react";
import { GlobalState } from "../../GlobalState";
import OrderHistory from "./history/OrderHistory";
import OrderDetails from "./history/OrderDetails";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.UserAPI.isLogged;
  const [isAdmin] = state.UserAPI.isAdmin;

  return (
    <Switch>
      <Route exact path="/" component={Products} />
      <Route exact path="/detail/:id" component={DetailProduct} />
      <Route exact path="/login" component={isLogged ? NotFound : Login} />
      <Route
        exact
        path="/history"
        component={isLogged ? OrderHistory : NotFound}
      />
      <Route
        exact
        path="/category"
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        exact
        path="/create_product"
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        exact
        path="/edit_product/:id"
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        exact
        path="/history/:id"
        component={isLogged ? OrderDetails : NotFound}
      />
      <Route
        exact
        path="/register"
        component={isLogged ? NotFound : Register}
      />
      <Route exact path="/cart" component={Cart} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  );
};

export default Pages;
