import SupplierSidebar from "@/components/sidebar/SupplierSidebar"
import withBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const LayoutSupplier = () => {
  const { current } = useSelector((state) => state.user)
   if (!current?.roles?.some((el) => el.name === "ROLE_SUPPLIER")) {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />
  }
  return (
    <div className="grid grid-cols-11 bg-gray-100 gap-3 h-full max-h-screen">
      <div className="col-span-2 bg-white max-h-full overflow-y-auto">
        <SupplierSidebar />
      </div>
      <div className="col-span-9 bg-white max-h-full w-full overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default withBaseTopping(LayoutSupplier)
