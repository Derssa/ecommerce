import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";

const BtnRender = ({ product, deleteProduct }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.UserAPI.isAdmin;
  const addCart = state.UserAPI.addCart;
  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link
            id="btn_buy"
            to="#!"
            onClick={() => deleteProduct(product._id, product.images.public_id)}
          >
            Delete
          </Link>
          <Link id="btn_view" to={`/edit_product/${product._id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link id="btn_buy" to="#!" onClick={() => addCart(product)}>
            buy
          </Link>
          <Link id="btn_view" to={`/detail/${product._id}`}>
            view
          </Link>
        </>
      )}
    </div>
  );
};

export default BtnRender;
