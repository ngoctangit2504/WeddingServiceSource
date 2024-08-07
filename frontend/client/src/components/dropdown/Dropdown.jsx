import React from 'react';
import { NavLink } from 'react-router-dom';

const Dropdown = ({ items, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="absolute bg-white shadow-md rounded-md mt-2 w-[1000px] p-4 grid grid-cols-7 gap-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          className="block text-gray-800"
        >
          <div className="p-4 hover:bg-pink-200 rounded-md transition duration-300 flex flex-col items-center">
            <img src={item.iconURL} alt={item.name} className="w-12 h-12 mb-2" />
            <div className="font-bold">{item.name}</div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Dropdown;