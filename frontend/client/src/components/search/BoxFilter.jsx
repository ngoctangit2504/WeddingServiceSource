import clsx from "clsx"
import React from "react"
import { twMerge } from "tailwind-merge"

const BoxFilter = ({ children, title, className, containerClassName }) => {
  return (
    <div
      className={twMerge(
        clsx("rounded-md text-sm bg-gray-100", containerClassName)
      )}
    >
      <h2
        className={twMerge(
          clsx(
            "text-white rounded-tl-md rounded-tr-md font-bold bg-pink-500 p-3",
            className
          )
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

export default BoxFilter
