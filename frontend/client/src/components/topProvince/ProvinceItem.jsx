import React from "react";
import { Link } from "react-router-dom";
import { formatVietnameseToString } from "@/ultils/fn";
import moment from "moment";
import path from "@/ultils/path";

const ProvinceItem = ({ image, title, createdDate, id, address }) => {
  return (
    <Link
      to={`/${path.DETAIL_POST}/${id}/${formatVietnameseToString(title)}`}
      className="col-span-1 cursor-pointer border drop-shadow bg-white rounded-md"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-[180px] object-cover rounded-t-md"
      />
      <div className="p-4 bg-gray-100">
        <h2 className="font-semibold text-pink-700">{title}</h2>
        <span className="text-sm text-gray-500">{address}</span>
        <small className="block text-gray-500">
          {moment(createdDate).format("DD/MM/YYYY")}
        </small>
      </div>
    </Link>
  );
};

export default ProvinceItem;
