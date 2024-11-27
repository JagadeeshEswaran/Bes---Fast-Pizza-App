import React from "react";
import { Link } from "react-router-dom";
import SearchOrder from "../features/orders/SearchOrder";
import Username from "./Username";

const Header = () => {
  return (
    <header className=" bg-yellow-500 flex justify-between items-center py-4 px-3 border-b-8">
      <Link to="/" className="uppercase tracking-widest font-semibold">
        Fast Pizza Co.
      </Link>

      <SearchOrder />

      <Username />
    </header>
  );
};

export default Header;
