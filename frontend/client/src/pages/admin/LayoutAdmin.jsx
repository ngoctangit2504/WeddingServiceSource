import { AdminSidebar } from "@/components"
import withBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const LayoutAdmin = ({ dispatch }) => {
  const { current } = useSelector((s) => s.user)
  if (!current?.roles?.some((el) => el.name === "ROLE_ADMIN")) {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />
  }

  return (
    <div className="grid grid-cols-11 gap-3 overflow-hidden max-h-screen">
      <div className="col-span-2 bg-white max-h-screen overflow-y-auto">
        <AdminSidebar />
      </div>
      <div className="col-span-9 bg-white max-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default withBaseTopping(LayoutAdmin)
