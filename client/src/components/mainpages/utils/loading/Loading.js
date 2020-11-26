import React from "react";
import loadingImg from "../../../../img/ttv_loading.gif";
import "./loading.css";

const Loading = () => {
  return (
    <div className="load_page">
      <img src={loadingImg} alt="" />
    </div>
  );
};

export default Loading;
