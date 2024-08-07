import path from "@/ultils/path"
import React from "react"
import { Link } from "react-router-dom"

const ProvinceItem = ({ image, provinceName, totalPosts }) => {
  return (
    <Link
      to={`/${path.TOP_PROVINCE}/${provinceName}`}
      className="col-span-1 cursor-pointer border drop-shadow bg-white rounded-md"
    >
      <img
        src={image}
        alt=""
        className="w-full h-[180px] object-cover rounded-t-md"
      />
      <div className="p-4 bg-gray-100">
        <h2 className="font-semibold text-pink-700">{provinceName}</h2>
        <small>{`${totalPosts} tin đăng`}</small>
      </div>
    </Link>
  )
}

export default ProvinceItem
