import React from "react"
import withBaseTopping from "@/hocs/WithBaseTopping"
import clsx from "clsx"

const Header = ({ navigate }) => {
  return (
    <div
      className={clsx(
        "bg-emerald-800 flex justify-center text-white",
        !location.pathname.includes("danh-sach") && "h-[240px] pt-12"
      )}
    >
      <div className="w-main flex flex-col gap-8">
        <span className="text-6xl font-bold tracking-tight">
          Tìm kiếm nhanh với ...
        </span>
        <span className="text-lg">
          WeddingService.com - Website đăng tin .., và tìm kiếm nhanh dễ dàng các nhu cầu về ....
        </span>
      </div>
    </div>
  )
}

export default withBaseTopping(Header)
