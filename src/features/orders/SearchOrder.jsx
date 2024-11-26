import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchOrder = () => {
  const [searchInput, setInput] = useState("");
  //   const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    // if (!searchInput) return;

    // navigate(`/order/${searchInput}`);
    // setInput("");
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        placeholder="Search order by Order ID"
        value={searchInput}
        onChange={(e) => setInput(e.target.value)}
        className="h-10 w-60 rounded border"
      />
    </form>
  );
};

export default SearchOrder;
