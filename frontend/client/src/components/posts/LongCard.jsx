import { formatMoney, formatVietnameseToString } from "@/ultils/fn"
import path from "@/ultils/path"
import clsx from "clsx"
import moment from "moment"
import React from "react"
import { Link } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import { Button } from ".."

const LongCard = ({
  image,
  title,
  address,
  price,
  createdDate,
  hideImage,
  containerClassName,
  id,
}) => {
  return (
    <div
      className={twMerge(
        clsx("w-full grid grid-cols-10 rounded-md border", containerClassName)
      )}
    >
      {!hideImage && (
        <img
          src={image}
          alt="avatar"
          className="w-full col-span-2 h-[156px] object-cover p-2 rounded-tl-md rounded-bl-md"
        />
      )}
      <div
        className={clsx(
          "p-3 flex flex-col gap-1 w-full",
          hideImage ? "col-span-10" : "col-span-8"
        )}
      >
        <span className="text-sm text-gray-500">

          {address?.split(",")[address?.split(",")?.length - 1]}
        </span>
        <Link
          className="text-fuchsia-950 cursor-pointer hover:underline font-semibold line-clamp-2"
          to={`/${path.DETAIL_POST}/${id}/${formatVietnameseToString(title)}`}
        >
          {title}
        </Link>
        <span className="text-sm text-gray-500">{address}</span>
        <div className="mt-3 flex justify-between items-center">
          <Button
          >
            Nhận Báo Giá
          </Button>
          <span className="text-gray-500 text-sm">
            {moment(createdDate).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default LongCard
