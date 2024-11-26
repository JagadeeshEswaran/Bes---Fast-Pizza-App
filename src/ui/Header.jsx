import React from "react";
import { Link } from "react-router-dom";
import SearchOrder from "../features/orders/SearchOrder";

const Header = () => {
  return (
    <header className="w-100 flex h-16 items-center justify-between border">
      <Link to="/">Fast Pizza Co.</Link>

      <SearchOrder />

      <p>Besant</p>
    </header>
  );
};

export default Header;
