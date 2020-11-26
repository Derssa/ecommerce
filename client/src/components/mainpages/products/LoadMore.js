import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";

const LoadMore = () => {
  const state = useContext(GlobalState);
  const [page, setPage] = state.ProductAPI.page;
  const [result] = state.ProductAPI.result;

  return (
    <div className="load_more">
      {result < page * 8 ? (
        ""
      ) : (
        <button onClick={() => setPage(page + 1)}>Load More</button>
      )}
    </div>
  );
};

export default LoadMore;
