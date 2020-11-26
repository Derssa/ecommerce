import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import ProductItem from "../utils/productItem/ProductItem";
import Filters from "./Filters";
import LoadMore from "./LoadMore";

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.ProductAPI.products;
  const [isAdmin] = state.UserAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.ProductAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      await axios.post(
        "api/destroy",
        { public_id: public_id },
        {
          headers: { Authorization: token },
        }
      );
      await axios.delete(`api/product/${id}`, {
        headers: { Authorization: token },
      });

      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <>
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product.product_id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
};

export default Products;
