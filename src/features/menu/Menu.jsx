import { useEffect, useState } from "react";
import { getMenu } from "../../services/apiRestaurant";
import { useLoaderData } from "react-router-dom";
import MenuItem from "./MenuItem";

export const menuLoader = async () => {
  const menu = await getMenu();

  return menu;
};

function Menu() {
  const data = useLoaderData();

  return (
    <ul>
      {data.map((item) => (
        <MenuItem key={item.id} pizza={item} />
      ))}
    </ul>
  );
}

export default Menu;
